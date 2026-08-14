"""Focused tests for the workflow translation boundary."""

from __future__ import annotations

import json
import unittest
from pathlib import Path
from unittest.mock import patch

from tools import music3_gateway


class WorkflowTranslationTests(unittest.TestCase):
    """Keep user-facing controls mapped to valid ComfyUI inputs."""

    def test_default_request_uses_tiled_decode_and_clamps_duration(self) -> None:
        workflow, settings = music3_gateway.make_workflow({"caption": "brief", "max_duration": 900})
        self.assertEqual(workflow["12"]["class_type"], "VAEDecodeAudioTiled")
        self.assertEqual(workflow["13"]["inputs"]["max_duration"], 300.0)
        self.assertEqual(workflow["12"]["inputs"]["tile_size"], 512)
        self.assertEqual(settings["steps"], 30)

    def test_raw_decode_removes_tiled_only_inputs(self) -> None:
        workflow, _ = music3_gateway.make_workflow({"caption": "brief", "tiled_decode": False, "seed": 42})
        self.assertEqual(workflow["12"]["class_type"], "VAEDecodeAudio")
        self.assertNotIn("tile_size", workflow["12"]["inputs"])
        self.assertEqual(workflow["9"]["inputs"]["seed"], 42)

    def test_checked_in_workflow_is_valid_json(self) -> None:
        payload = json.loads(Path(music3_gateway.WORKFLOW_PATH).read_text(encoding="utf-8"))
        self.assertEqual(payload["35"]["class_type"], "SaveAudioMP3")


if __name__ == "__main__":
    unittest.main()
