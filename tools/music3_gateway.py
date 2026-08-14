"""Expose a small local HTTP API for MiniMax Music 3.0 on ComfyUI."""

from __future__ import annotations

import argparse
import json
import os
import secrets
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen

try:
    from tools.music3_store import DATA_PATH, StoreError, find_item, first_audio, load_library, save_library
except ModuleNotFoundError:
    from music3_store import DATA_PATH, StoreError, find_item, first_audio, load_library, save_library

ROOT = Path(__file__).resolve().parents[1]
COMFY_URL = os.getenv("MUSIC3_COMFY_URL", "http://127.0.0.1:8201").rstrip("/")
WORKFLOW_PATH = Path(os.getenv("MUSIC3_WORKFLOW_PATH", ROOT / "workflows/minimax_music3_api.json"))


class GatewayError(RuntimeError):
    """Represent a user-actionable gateway or ComfyUI failure."""


def json_request(path: str, payload: dict | None = None) -> dict:
    """Call the local ComfyUI API and decode its JSON response."""
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    request = Request(f"{COMFY_URL}{path}", data=body, method="POST" if body else "GET")
    if body:
        request.add_header("Content-Type", "application/json")
    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as error:
        raise GatewayError(f"ComfyUI is unavailable at {COMFY_URL}: {error}") from error


def task_snapshot(task_id: str) -> dict:
    """Map ComfyUI history into the stable status shape used by the UI."""
    item = find_item(task_id) or {"id": task_id, "state": "queued"}
    history = json_request(f"/history/{task_id}")
    entry = history.get(task_id)
    if not entry:
        queue = json_request("/queue")
        active = [row[1] for row in queue.get("queue_running", []) + queue.get("queue_pending", [])]
        item["state"] = "working" if task_id in active else "queued"
        return item
    status = entry.get("status", {}).get("status_str")
    if status == "success":
        audio = first_audio(entry.get("outputs", {}))
        if not audio:
            item.update(state="failed", error="ComfyUI completed without an audio output.")
        else:
            item.update(state="ready", output=audio, result={"file": f"/audio/{task_id}"})
        items = [item if current["id"] == task_id else current for current in load_library()]
        save_library(items)
    elif status == "error":
        item.update(state="failed", error="ComfyUI reported an execution error.")
    else:
        item["state"] = "working"
    return item


def make_workflow(payload: dict) -> tuple[dict, dict]:
    """Fill the checked-in API workflow with one Studio request."""
    try:
        workflow = json.loads(WORKFLOW_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise GatewayError(f"Could not load workflow {WORKFLOW_PATH}: {error}") from error
    seed = int(payload.get("seed") or secrets.randbelow(2**31 - 1))
    duration = min(300.0, max(1.0, float(payload.get("max_duration") or 30)))
    steps = min(60, max(4, int(payload.get("steps") or 30)))
    cfg = min(4.0, max(0.1, float(payload.get("cfg_scale") or 1.7)))
    caption = str(payload.get("caption", "")).strip()
    lyrics = str(payload.get("lyrics", "")).strip()
    workflow["13"]["inputs"].update(caption=caption, lyrics=lyrics, seed=seed, max_duration=duration, cfg_scale=cfg)
    workflow["9"]["inputs"].update(seed=seed, steps=steps, cfg=cfg)
    workflow["15"]["inputs"]["batch_size"] = min(4, max(1, int(payload.get("batch_size") or 1)))
    if payload.get("tiled_decode", True):
        workflow["12"]["class_type"] = "VAEDecodeAudioTiled"
        workflow["12"]["inputs"].update(tile_size=512, overlap=64)
    else:
        workflow["12"]["class_type"] = "VAEDecodeAudio"
        workflow["12"]["inputs"].pop("tile_size", None)
        workflow["12"]["inputs"].pop("overlap", None)
    workflow["35"]["inputs"]["filename_prefix"] = f"audio/minimax_music3_studio/{int(time.time())}"
    return workflow, {"seed": seed, "duration": duration, "steps": steps, "cfg_scale": cfg}


class Handler(BaseHTTPRequestHandler):
    """Serve the Studio API and proxy completed audio from ComfyUI."""

    server_version = "MiniMaxMusic3Gateway/0.1"

    def log_message(self, format: str, *args: object) -> None:
        print(f"[music3] {format % args}")

    def send_json(self, data: object, status: int = 200, error: str | None = None) -> None:
        body = json.dumps({"code": 0 if status < 400 else status, "data": data, "error": error}, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body(self) -> dict:
        """Decode a bounded JSON request body."""
        length = int(self.headers.get("Content-Length", "0"))
        if length > 1_000_000:
            raise GatewayError("Request body is too large.")
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_GET(self) -> None:
        """Handle health, Library, task status, and audio requests."""
        parsed = urlparse(self.path)
        try:
            if parsed.path == "/health":
                stats = json_request("/system_stats")
                system = stats.get("system", {})
                return self.send_json({"status": "online", "service": "MiniMax Music 3.0", "comfyui_version": system.get("comfyui_version"), "comfyui_url": COMFY_URL})
            if parsed.path == "/library":
                return self.send_json({"items": [task_snapshot(item["id"]) for item in load_library()]})
            if parsed.path.startswith("/tasks/"):
                task_id = parsed.path.rsplit("/", 1)[-1]
                return self.send_json(task_snapshot(task_id))
            if parsed.path.startswith("/audio/"):
                return self.proxy_audio(parsed.path.rsplit("/", 1)[-1], parse_qs(parsed.query))
            if parsed.path == "/system":
                return self.send_json({"comfyui_url": COMFY_URL, "workflow": str(WORKFLOW_PATH), "library": str(DATA_PATH)})
            self.send_json(None, 404, "Not found.")
        except (GatewayError, StoreError, ValueError, json.JSONDecodeError) as error:
            self.send_json(None, 502, str(error))

    def do_POST(self) -> None:
        """Queue a MiniMax Music 3.0 generation request."""
        try:
            if self.path != "/generate":
                return self.send_json(None, 404, "Not found.")
            payload = self.read_body()
            workflow, settings = make_workflow(payload)
            response = json_request("/prompt", {"prompt": workflow, "client_id": str(uuid.uuid4())})
            task_id = response.get("prompt_id")
            if not task_id:
                raise GatewayError(response.get("error") or "ComfyUI did not return a prompt id.")
            item = {"id": task_id, "state": "queued", "created_at": int(time.time() * 1000), "prompt": payload.get("caption", ""), "lyrics": payload.get("lyrics", ""), "settings": settings}
            save_library([item, *load_library()])
            self.send_json({"task_id": task_id, "state": "queued", "seed": settings["seed"]})
        except (GatewayError, StoreError, ValueError, json.JSONDecodeError) as error:
            self.send_json(None, 400, str(error))

    def proxy_audio(self, task_id: str, query: dict[str, list[str]]) -> None:
        """Stream a completed file from ComfyUI's /view endpoint."""
        item = find_item(task_id)
        output = item.get("output") if item else None
        if not output:
            return self.send_json(None, 404, "Audio is not ready.")
        params = urlencode({"filename": output["filename"], "subfolder": output.get("subfolder", ""), "type": output.get("type", "output")})
        with urlopen(f"{COMFY_URL}/view?{params}", timeout=30) as response:
            body = response.read()
            self.send_response(200)
            self.send_header("Content-Type", response.headers.get_content_type() or "audio/mpeg")
            self.send_header("Content-Length", str(len(body)))
            if query.get("download"):
                self.send_header("Content-Disposition", f'attachment; filename="{output["filename"]}"')
            self.end_headers()
            self.wfile.write(body)


def main() -> None:
    """Start the local gateway; ComfyUI remains the GPU worker."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default=os.getenv("MUSIC3_GATEWAY_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.getenv("MUSIC3_GATEWAY_PORT", "8202")))
    args = parser.parse_args()
    print(f"MiniMax Music 3.0 gateway: http://{args.host}:{args.port} -> {COMFY_URL}")
    ThreadingHTTPServer((args.host, args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
