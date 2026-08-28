# Card Builder Utils V1

Mở tool độc lập tại `#/tools/card-builder`. Tool không nằm trong danh sách screen ingame hoặc viewport Godot `960×540`; nút `CARD BUILDER ↗` trên debug toolbar dùng để mở tool.

Module này gồm:

- `model.ts`: data contract, catalog và validation thuần.
- `repository.ts`: local persistence, resize art và download/export.
- `CardBuilderScreen.tsx`: authoring UI và live card preview.

## Persistence V1

Card và art WebP đã resize được lưu trong `localStorage` của browser hiện tại. Mỗi card có revision tăng dần khi save. Nút `JSON` và `ART` xuất hai file để đưa vào project.

Đây là adapter tạm cho HTML preview. Khi Godot importer hoặc local authoring server được xây, chỉ thay `repository.ts`; UI và `CardDraft` giữ nguyên.

## Export convention

- Record: `<card_id>.json`
- Art: `<card_id>_art.webp`
- Project JSON trỏ tới:
  - `assets/cards/source/<card_id>/<art_name>.webp`
  - `assets/cards/runtime/<card_id>/art.webp`
