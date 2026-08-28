# References checked for this handoff

PixelLab API live documentation checked on 2026-08-27:

- https://api.pixellab.ai/v2/llms.txt
- https://api.pixellab.ai/v2/openapi.json
- https://api.pixellab.ai/v2/docs

Important current facts used:
- API base URL is `https://api.pixellab.ai/v2`.
- Bearer authentication.
- `/create-image-pixen` exists.
- Current Pixen request includes description, image_size and optional outline/detail/view/direction/no_background/background removal task/seed/enhance_prompt.
- `/enhance-pixen-prompt`, `/generate-with-style-v2`, and `/generate-ui-v2` exist.
- Some Pro generation endpoints are asynchronous and use background job polling.

Always treat the live OpenAPI schema as source of truth when implementing API changes.
