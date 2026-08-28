# 17 — PixelLab Production Workflow

Tài liệu này mở rộng `docs/11_pixellab_pipeline.md` thành workflow production. Trước khi thay đổi API integration phải đọc live PixelLab documentation; không đoán endpoint hoặc payload.

## 1. Principles

- Placeholder-first; art không chặn kiểm chứng combat.
- Generate atomic assets, không generate full shipping UI screenshot.
- Prompt source tách thành Global + Faction + Asset Brief.
- Raw generation không bị sửa/overwrite.
- Approved output immutable; revision tạo asset version mới.
- Mọi asset được review ở intended in-game scale.
- Text là native UI text, không nằm trong generated image.

## 2. Directory lifecycle

```text
assets/
  requests/          # nhu cầu asset và priority
  briefs/            # art direction nguồn
  manifests/         # reproducible generation request
  generated/raw/     # API output nguyên bản
  generated/review/  # optional post-processed candidate
  approved/          # locked shipping candidates
  references/        # approved style anchors/contact sheets
```

Không di chuyển raw file để thay cho provenance. Approved file phải trỏ lại manifest/raw/source IDs.

## 3. Status lifecycle

`BRIEF → GENERATING → GENERATED → REVIEW → REVISION | APPROVED → IMPORTED → IN_GAME_QA → LOCKED`

- `APPROVED`: visual candidate được duyệt.
- `IMPORTED`: import settings và pivot đã cấu hình.
- `IN_GAME_QA`: đã xem trong scene thật.
- `LOCKED`: sẵn sàng dùng trong build milestone.

## 4. Asset request

Request tối thiểu:

- asset ID/version,
- feature/phase,
- asset type,
- faction,
- gameplay role,
- target/source size,
- displayed size,
- camera/direction,
- required states/animation,
- priority,
- brief owner,
- acceptance checklist.

Không generate nếu chưa biết asset xuất hiện ở đâu và kích thước thật bao nhiêu.

## 5. Prompt assembly

Prompt được compose từ:

1. Global Art Bible revision.
2. Faction Art Bible revision.
3. Asset brief revision.
4. Technical constraints: size, background, direction, readability.

Manifest ghi `prompt_sources` và flattened description được gửi tới API.

Exploration có thể dùng enhanced prompt. Khi style đã lock, production dùng explicit prompt và `enhance_prompt=false` khi endpoint hỗ trợ.

## 6. Exploration pass

- Generate 4–8 candidates cho hero asset/style anchor. **HYPOTHESIS**
- Giữ seed/prompt của mọi candidate có tiềm năng.
- Tạo contact sheet với asset ở 1×, 2× và trên combat background.
- Review silhouette trước micro-detail.
- Chọn ít nhất 5–8 approved anchors trước khi bulk production.

Review checklist:

- role đọc được ngay,
- faction shape/material đúng,
- camera và light direction đúng,
- palette không drift,
- không có fake text,
- transparent edges sạch,
- không noisy ở intended size,
- không quá giống asset role khác.

## 7. Style lock

Style version phải ghi:

- anchor asset IDs,
- palette reference,
- outline rule,
- shading tone count,
- camera,
- light direction,
- pixel density/detail budget,
- do/don't examples.

Thay style version giữa production batch cần visual regression review cho asset liên quan.

## 8. Production manifest additions

Ngoài schema hiện tại, manifest production nên có:

- `asset_type`
- `faction`
- `feature`
- `prompt_sources`
- `source_asset_ids`
- `generated_at`
- `api_schema_checked_at`
- `godot_import`
- `review`
- `content_hash`

`godot_import` tối thiểu:

- filter,
- mipmaps,
- intended scale,
- pivot,
- nine-slice margins nếu applicable.

## 9. Post-processing

Allowed khi có record:

- crop/pad canvas,
- remove remaining background,
- stray-pixel cleanup,
- constrained palette correction,
- shadow separation,
- pivot normalization,
- animation frame cleanup.

Không upscale bằng smoothing. Không sửa raw file. Review output nhận version/hash riêng.

## 10. Godot import QA

Default pixel asset import:

- nearest filtering,
- mipmaps off trừ khi có lý do,
- lossless texture mode phù hợp,
- integer display scaling,
- pivot recorded.

In-game QA:

- light/dark background,
- crowded formation,
- status/intent overlap,
- hit tint/flash,
- dead/disabled state,
- 1× và 2× output,
- compare cùng-role assets.

## 11. UI assets

Generate atomic:

- card frame layers,
- panel frame/nine-slice,
- button background states,
- tabs/slots,
- ornamental corners,
- status/resource/relic icons.

Không generate:

- full screen chứa text,
- fixed combat HUD screenshot,
- card đã bake name/rules/cost,
- layout chỉ hoạt động ở một resolution.

Nine-slice asset phải có margins và minimum size trong manifest/component spec.

## 12. Asset order by milestone

### Combat greybox

- placeholders,
- one ship,
- three enemy silhouettes,
- basic card frames,
- core status/intent icons.

### Combat sandbox passed

- STONE/PLANT enemy production set,
- elite/boss,
- module/summon,
- relic/resource icons,
- combat background.

### Full loop validated

- card illustrations,
- planet/building art,
- booster polish,
- additional animation.

## 13. Approval ownership

Một người có thể giữ nhiều role, nhưng record phải tách:

- design acceptance: asset truyền đạt đúng mechanic,
- art acceptance: đúng style,
- technical acceptance: đúng size/import/pivot,
- in-game acceptance: readable trong scene thật.

`LOCKED` chỉ khi cả bốn đạt.

## 14. Failure and regeneration

- Không overwrite approved/raw.
- Regeneration dùng new asset version.
- Nếu endpoint/schema đổi, ghi API version/check date.
- Nếu asset drift style, quay lại anchor/reference, không chỉ kéo dài prompt vô hạn.
- Token/API credential chỉ lấy từ environment và không xuất hiện trong metadata/log commit.
