# 16 — Web Preview ↔ Godot Parity Workflow

HTML là reference renderer để iterate layout nhanh. Godot là production renderer. Không tự động convert DOM/CSS thành scene tree.

## 1. Shared inputs

Hai renderer dùng chung về mặt contract:

- `ui_spec/tokens.json`
- component specification,
- screen fixture JSON,
- approved atomic assets,
- reference logical resolution 960×540.

Không dùng screenshot UI do AI generate làm shipping UI. Text luôn là native text ở cả Web và Godot.

## 2. Suggested layout

```text
ui_spec/
  tokens.json
  components/
  screens/
  fixtures/
  parity/

web_preview/
  index.html
  src/
  styles/
  public/assets/

godot_project/
  ui/components/
  ui/screens/
  ui/themes/
  tests/ui/
```

Tên `godot_project/` có thể thay bằng project root khi implementation bắt đầu.

## 3. Component workflow

1. Viết component contract.
2. Thêm edge-case fixtures.
3. Dựng Web reference.
4. Review hierarchy, density và interaction.
5. Chụp screenshot 960×540 hoặc isolated component canvas.
6. Dựng Godot scene tương đương.
7. Render cùng fixture.
8. So sánh overlay/diff.
9. Sửa token hoặc mapping, không vá magic number riêng lẻ nếu vấn đề mang tính hệ thống.
10. Ghi parity result và lock revision.

## 4. Layout mapping

| Web | Godot |
|---|---|
| Flex row | `HBoxContainer` |
| Flex column | `VBoxContainer` |
| Simple grid | `GridContainer` |
| Padding wrapper | `MarginContainer` |
| Gap | Container separation theme constant |
| Absolute overlay | Full-rect `Control` + anchors |
| CSS variables | Godot Theme/token resources |
| Nine-slice image | `NinePatchRect`/StyleBoxTexture |
| Component class | Reusable `.tscn` scene |
| Hover/focus selector | Signals + theme variation/state |

Không ép mapping 1:1 nếu Godot Container cần hierarchy khác. Parity đo output và behavior, không đo scene tree giống DOM.

## 5. Fixture rules

Mỗi screen tối thiểu có:

- default,
- minimum content,
- maximum expected content,
- long localized text,
- locked/disabled,
- error/invalid,
- stress state.

Combat stress fixture nên có:

- ba enemy,
- nhiều intent/status,
- hand 7–10 cards,
- summon/module đầy slot,
- long card title,
- insufficient Energy,
- low Hull warning.

## 6. Screenshot protocol

- Viewport/logical resolution: 960×540.
- Browser zoom: 100%.
- Godot logical render: 960×540.
- Dùng cùng asset version và fixture revision.
- Tắt nondeterministic animation/cursor trước khi capture.
- Lưu reference theo `screen__fixture__renderer__revision.png`.

Review ba lớp:

1. Layout: bounds, alignment, spacing, wrapping.
2. Style: color, frame, font role, icon scale.
3. Behavior: focus, hover, disabled, tooltip, selection.

Mục tiêu ban đầu:

- Không khác hierarchy hoặc line wrapping quan trọng.
- Bounds chính sai không quá 2 logical pixels. **HYPOTHESIS**
- Font rasterization được phép khác nhẹ.
- Không yêu cầu byte-identical screenshot.

## 7. Parity record

Mỗi component/screen record:

```text
Spec revision:
Fixture revision:
Web implementation:
Godot scene:
Web screenshot:
Godot screenshot:
Layout status: PASS/FAIL
Style status: PASS/FAIL
Behavior status: PASS/FAIL
Known intentional differences:
Reviewer/date:
```

Intentional difference phải có lý do, ví dụ native tooltip accessibility hoặc font rasterization.

## 8. Change workflow

- Token change: bump UI spec revision, render affected fixtures ở cả hai renderer.
- Component contract change: update Web reference trước hoặc đồng thời, rồi Godot trong cùng task.
- Godot-only gameplay feedback có thể prototype trực tiếp trong Godot; sau khi chấp nhận phải cập nhật component record/Web reference nếu nó là design-system behavior.
- Web preview không được trở thành blocker cho combat bug fix không liên quan visual parity.

## 9. What not to do

- Không copy absolute pixel coordinates từ browser sang mọi Control.
- Không export nguyên UI screenshot thành một texture.
- Không dùng CSS animation timing làm gameplay timing.
- Không duplicate combat formula bằng JavaScript chỉ để preview; dùng resolved fixture values.
- Không giữ hai bộ token độc lập.
- Không coi Figma/HTML/Web là authoritative gameplay state.

## 10. Suggested automation later

Sau khi manual workflow ổn:

- Validate `tokens.json` bằng schema.
- Generate CSS variables và Godot Theme constants.
- Browser screenshot bằng Playwright.
- Godot fixture scene screenshot bằng automated runner.
- Image diff/overlay report.

Automation chỉ nên thêm sau khi hai hoặc ba screen đã chứng minh mapping ổn định.
