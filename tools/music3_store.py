"""Durable, audio-path-only Library storage for the MiniMax gateway."""

from __future__ import annotations

import json
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "library.json"
LOCK = threading.RLock()


class StoreError(RuntimeError):
    """Represent an unreadable or unwritable local Library index."""


def load_library() -> list[dict]:
    """Read the gateway's durable Library index."""
    with LOCK:
        if not DATA_PATH.exists():
            return []
        try:
            return json.loads(DATA_PATH.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            raise StoreError(f"Could not read {DATA_PATH}: {error}") from error


def save_library(items: list[dict]) -> None:
    """Persist Library metadata without copying audio into the repository."""
    with LOCK:
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        DATA_PATH.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")


def find_item(task_id: str) -> dict | None:
    """Return one stored task by its ComfyUI prompt id."""
    return next((item for item in load_library() if item["id"] == task_id), None)


def first_audio(outputs: dict) -> dict | None:
    """Extract the first audio output descriptor from ComfyUI history."""
    for node in outputs.values():
        for audio in node.get("audio", []):
            if audio.get("filename"):
                return audio
    return None
