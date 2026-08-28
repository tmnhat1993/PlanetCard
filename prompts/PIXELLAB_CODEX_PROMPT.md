# Codex Prompt — PixelLab Integration

Before editing PixelLab integration:
1. Fetch/read `https://api.pixellab.ai/v2/llms.txt`.
2. If request/response fields are needed, inspect `https://api.pixellab.ai/v2/openapi.json`.
3. Do not invent endpoints, enums or payload fields.

Rules:
- Read token from `PIXELLAB_API_TOKEN`.
- Never log token.
- Manifest drives generation.
- Never overwrite an existing generated file.
- Never regenerate `approved: true`.
- Store prompt, seed, endpoint, style_version, usage and enhanced prompt metadata.
- Exploration outputs live in `assets/generated/raw`.
- Human-approved assets move to `assets/approved`.
- Shipping game imports only approved assets.

Start by supporting `POST /create-image-pixen`.
Only add Pro/async/style endpoints when needed by a concrete art task.
