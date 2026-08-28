# 21 — Card Builder Utils Plan

## Mục tiêu

Tạo một công cụ authoring độc lập để designer ghép thẻ từ art + dữ liệu gameplay, xem preview theo đúng UI web/Godot, rồi lưu thành gói dữ liệu có thể dùng lại. Card Builder không chứa combat logic và không sửa trực tiếp save game của người chơi.

## Quyết định kiến trúc

- Làm Card Builder trong `web_preview` trước để chỉnh UI nhanh.
- Dữ liệu chuẩn vẫn là JSON trong `design_data`; web và Godot chỉ là hai consumer.
- Art được lưu thành file riêng, không nhúng base64 vào JSON.
- Card ID là khóa bất biến dạng `faction_slug`; đổi tên hiển thị không đổi ID.
- Mỗi lần Save phải validate schema, tạo preview thumbnail và cập nhật index.

## Phạm vi V1

1. Chọn hoặc upload card art PNG/WebP.
2. Nhập `id`, tên, faction, rarity, type, cost Energy, Mass và rules text.
3. Gắn nhiều dấu ấn thuộc tính: faction, damage family, mechanic và keyword.
4. Preview card ở kích thước chuẩn và compact.
5. Save draft, duplicate card, update card và export JSON.
6. Tạo đường dẫn art ổn định để cả HTML và Godot cùng đọc.

Ngoài V1: chỉnh effect graph trực quan, batch generation, localization và cloud sync.

## Cấu trúc đề xuất

```text
tools/card_builder/
  README.md
  src/
    model.ts              # CardDraft, CardArtRef, AttributeStamp
    validate.ts           # JSON Schema + semantic checks
    repository.ts         # load/save/index, không biết UI
    export_godot.ts       # tạo manifest/import hints
    thumbnail.ts          # render preview 2 kích thước
  tests/
design_data/
  cards/<faction>/<card_id>.json
  card_index.json
assets/cards/
  source/<card_id>/art_v001.png
  runtime/<card_id>/art.webp
  thumbnails/<card_id>.webp
web_preview/app/card-builder/
  CardBuilderScreen.tsx
  CardPreview.tsx
  AttributeStampPicker.tsx
```

## Data contract bổ sung

```json
{
  "id": "plant_toxic_spore",
  "name": "Toxic Spore",
  "art": {
    "source": "assets/cards/source/plant_toxic_spore/art_v001.png",
    "runtime": "assets/cards/runtime/plant_toxic_spore/art.webp",
    "focus": { "x": 0.5, "y": 0.42 },
    "version": 1
  },
  "stamps": [
    { "id": "faction_plant", "group": "FACTION" },
    { "id": "mechanic_poison", "group": "MECHANIC" }
  ]
}
```

`tags` tiếp tục phục vụ gameplay/query. `stamps` là mô tả trình bày có kiểm soát; stamp có catalog riêng để tránh designer nhập sai chính tả hoặc tạo biến thể trùng nhau.

## Luồng Save

1. UI tạo `CardDraft` trong memory.
2. Validate field bắt buộc và kiểm tra semantic: ID duy nhất, effect hợp lệ, stamp tồn tại, art có đúng tỉ lệ.
3. Copy art source vào thư mục versioned; sinh runtime WebP và thumbnail.
4. Ghi JSON vào file tạm rồi replace file đích để tránh file dở dang.
5. Cập nhật `card_index.json` với checksum của JSON và art.
6. Preview reload đúng record vừa lưu; nếu reload khác draft thì báo Save thất bại.

## Mapping sang Godot

- `CardData` JSON → custom `Resource` hoặc dictionary do `CardRepository` load.
- `art.runtime` → `Texture2D` trong `TextureRect` với crop theo `art.focus`.
- `stamps[]` → component `AttributeStamp`, icon lấy từ catalog theo `id`.
- Card frame/text vẫn là scene Godot; không bake tên hoặc rules text vào bitmap.

## Milestone

### CB-0 — Contract

- Mở rộng `card.schema.json` cho `art` và `stamps`.
- Tạo `attribute_stamp.schema.json` và catalog seed.
- Acceptance: examples cũ vẫn validate; một card mới có art/stamp validate ở CLI.

### CB-1 — Local repository

- CRUD file JSON, version art, index và checksum.
- Acceptance: save/reload/duplicate không mất dữ liệu; không overwrite art cũ.

### CB-2 — HTML Card Builder

- Form, asset picker, live preview, stamp picker, validation panel.
- Acceptance: tạo `plant_toxic_spore` từ đầu và thấy giống card trong Combat.

### CB-3 — Godot parity

- Godot importer + card scene đọc cùng record.
- Acceptance: screenshot HTML/Godot đạt cùng hierarchy, spacing và content ở viewport chuẩn.

### CB-4 — Production hardening

- Undo draft, migration version, orphan asset report, export pack.
- Acceptance: đổi schema không làm mất card cũ và CI phát hiện broken asset reference.

## Việc nên làm ngay sau combat layout

Làm CB-0 trước. Đây là phần nhỏ nhất nhưng khóa đúng contract cho art và dấu ấn, tránh tạo UI form dựa trên cấu trúc dữ liệu còn thay đổi.

## Trạng thái implementation

- CB-0: hoàn thành schema `art`, `stamps`, stamp catalog và client-side validation.
- CB-1: hoàn thành repository V1 bằng browser localStorage, revision, delete/duplicate và export JSON/art. Filesystem repository vẫn là bước kế tiếp.
- CB-2: hoàn thành HTML form, upload/resize art, live preview, stamp picker và saved library tại tool route độc lập `#/tools/card-builder`.
- CB-3/CB-4: chưa bắt đầu.
