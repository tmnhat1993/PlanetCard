# 11 — PixelLab API & Art Pipeline

> API có thể thay đổi. Trước khi Codex sửa integration, đọc live docs.

Current documentation entrypoints:
- https://api.pixellab.ai/v2/llms.txt
- https://api.pixellab.ai/v2/openapi.json
- https://api.pixellab.ai/v2/docs

Base URL:
`https://api.pixellab.ai/v2`

Auth:
`Authorization: Bearer <token>`

Token phải ở environment `PIXELLAB_API_TOKEN`.

## Current useful endpoints

- `POST /create-image-pixen`
- `POST /enhance-pixen-prompt`
- `POST /generate-with-style-v2` (Pro)
- `POST /generate-ui-v2` (Pro)
- object/character/animation endpoints nếu cần spritesheet về sau.

Theo OpenAPI hiện hành, `create-image-pixen` hỗ trợ:
- description
- image_size
- outline
- detail
- view
- direction
- no_background
- background_removal_task
- seed
- enhance_prompt

Constraints hiện hành:
- minimum side 16
- max area 512×512
- width/height divisible by 4
- nếu một side dưới 32 thì phải square

## Production strategy

### Exploration
- Prompt ngắn.
- Có thể dùng enhance prompt.
- Generate nhiều biến thể.
- Human approve.

### Lock style
Khi có 5–8 asset tốt:
- chọn style anchors,
- ghi palette/material/camera/outline,
- giữ prompt + seed + style version.

### Production
- Manifest-driven.
- `enhance_prompt=false` khi muốn reproducibility.
- Approved output immutable.
- Regeneration tạo version mới.

## Art Bible

Global:
- retro sci-fi pixel art JRPG
- modern resolution, không giả lập Game Boy limitation
- chunky readable clusters
- strong silhouette
- selective outline
- 3–4 shading tones/material
- no smooth gradient
- low top-down 3/4 khi gameplay asset
- readable ở gameplay scale

STONE:
- basalt / granite / quartz / metal braces
- square / heavy / wide / stable
- charcoal / slate / sandstone / pale crystal
- fortress / industrial / durable

PLANT:
- vine / bark / leaf / fungus / membrane
- curved / asymmetric / branching
- deep green / lime / cream / purple spores
- organic / parasitic / bio-engineered

## Do not generate a whole UI screenshot as shipping UI

Generate atomic pieces:
- panel frame
- card frame
- button
- tab
- slot
- icons
- ornamental corners

Compose bằng Godot Control.
Text luôn là real text.

## Asset order for MVP

1. Player ship
2. Stone basic enemy
3. Stone elite
4. Plant basic enemy
5. Plant elite
6. Stone boss
7. Plant boss
8. Card frames
9. Status icons
10. Resource icons
11. Relic icons
12. Card illustration
13. Planet illustration
14. Building illustration

Không làm 100 card arts trước khi combat validated.

## Metadata

Mỗi generation record:
- asset_id
- prompt
- seed
- endpoint
- image size
- style_version
- generated_at
- approved flag
- source/reference IDs nếu có

## Style reference

Nếu dùng `generate-with-style-v2`, OpenAPI hiện hành hỗ trợ style references và async job workflow. Codex phải đọc live schema trước khi implement vì payload có thể khác theo version.
