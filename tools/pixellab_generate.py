#!/usr/bin/env python3
"""
Manifest-driven PixelLab Pixen generator.

Usage:
  PIXELLAB_API_TOKEN=... python tools/pixellab_generate.py assets/manifests/stone_basalt_sentinel.json

Rules:
- Never stores the API token.
- Never overwrites approved assets.
- Reads current live API docs before modifying request shapes.
"""

from __future__ import annotations
import base64
import json
import os
import sys
from pathlib import Path
import requests

BASE_URL = "https://api.pixellab.ai/v2"

ALLOWED_FIELDS = {
    "description",
    "image_size",
    "outline",
    "detail",
    "view",
    "direction",
    "no_background",
    "background_removal_task",
    "seed",
    "enhance_prompt",
}

def decode_image_field(value: str) -> bytes:
    if value.startswith("data:"):
        value = value.split(",", 1)[1]
    return base64.b64decode(value)

def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: pixellab_generate.py <manifest.json>", file=sys.stderr)
        return 2

    manifest_path = Path(sys.argv[1])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    if manifest.get("approved"):
        raise RuntimeError("Refusing to regenerate an approved asset manifest.")

    endpoint = manifest.get("endpoint", "/create-image-pixen")
    if endpoint != "/create-image-pixen":
        raise RuntimeError(
            "This helper intentionally supports only /create-image-pixen. "
            "Read the live OpenAPI schema before extending it."
        )

    token = os.environ.get("PIXELLAB_API_TOKEN")
    if not token:
        raise RuntimeError("PIXELLAB_API_TOKEN is not set.")

    payload = {k: manifest[k] for k in ALLOWED_FIELDS if k in manifest}

    output_path = Path(manifest["output_path"])
    if not output_path.is_absolute():
        # Assume command runs from repository/package root.
        output_path = Path.cwd() / output_path

    if output_path.exists():
        raise FileExistsError(f"Refusing to overwrite existing file: {output_path}")

    response = requests.post(
        BASE_URL + endpoint,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=180,
    )
    response.raise_for_status()
    body = response.json()

    image_obj = body.get("image") or {}
    image_b64 = image_obj.get("base64")
    if not image_b64:
        raise RuntimeError(f"Unexpected response: missing image.base64. Keys={list(body.keys())}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(decode_image_field(image_b64))

    meta_path = output_path.with_suffix(".generation.json")
    metadata = {
        "manifest": str(manifest_path),
        "endpoint": endpoint,
        "seed": manifest.get("seed"),
        "style_version": manifest.get("style_version"),
        "enhanced_prompt": body.get("enhanced_prompt"),
        "usage": body.get("usage"),
    }
    meta_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    print(f"Saved: {output_path}")
    print(f"Metadata: {meta_path}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
