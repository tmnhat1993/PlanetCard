# PixelLab Tooling

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# Windows: .venv\Scripts\activate

pip install -r tools/requirements.txt
```

Set environment:

```bash
export PIXELLAB_API_TOKEN="..."
```

Generate:

```bash
python tools/pixellab_generate.py assets/manifests/stone_basalt_sentinel.json
```

## Important

Script chỉ hỗ trợ `/create-image-pixen` có chủ đích.

Nếu muốn thêm:
- style generation,
- UI generation,
- animation,
- object,
- character,

Codex phải đọc live:
- https://api.pixellab.ai/v2/llms.txt
- https://api.pixellab.ai/v2/openapi.json

Không đoán payload.
