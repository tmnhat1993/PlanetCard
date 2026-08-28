# 15 — UI Design System

## 1. Goals

- Readability trước spectacle.
- Cùng gameplay state phải có cùng hierarchy trên Web preview và Godot.
- Pixel-art assets không làm text khó đọc.
- UI component tái sử dụng, không dựng riêng cho từng screen.
- Mọi component có normal, hover, focus, pressed, disabled và relevant gameplay states.

## 2. Canvas và scaling

- Logical resolution: 960×540.
- Reference output: 1920×1080 ở integer 2× scale.
- Pixel art: nearest filtering, không mipmap cho UI sprite.
- Text có thể dùng non-pixel font nếu pixel font giảm readability.
- Safe margin mặc định: 16 logical pixels.
- Minimum interactive target: 28×28 logical pixels. **HYPOTHESIS**

Godot root:

- Project stretch mode dùng Canvas Items.
- Root screen là full-rect `Control`.
- Layout chính dùng Container; absolute positioning chỉ cho overlay/animation.
- Không scale từng Label để resize text; dùng Theme font size.

## 3. Token hierarchy

Canonical token nằm ở `ui_spec/tokens.json`.

Nhóm token:

- resolution,
- spacing,
- size,
- color,
- typography,
- border,
- animation,
- z-layer,
- component dimensions.

Godot Theme và Web CSS variables phải được cập nhật từ cùng token revision. Nếu chưa có generator, thay đổi token phải có checklist cập nhật hai renderer trong cùng commit.

## 4. Component inventory

### Foundation

- Primary/secondary/danger button.
- Icon button.
- Panel frame.
- Modal.
- Tab.
- Tooltip.
- Progress bar.
- Resource counter.
- Lock badge.
- Notification/toast.

### Combat

- Combat card.
- Enemy plate.
- Intent badge.
- Status icon/stack.
- Hull/Shield/Armor bar.
- Energy counter.
- Draw/discard pile counter.
- Target indicator.
- Summon/module slot.
- Combat log row.

### Meta

- Collection card tile.
- Deck row.
- Mass meter.
- Ship stat row.
- Building hotspot.
- Production job.
- Upgrade node.
- Planet node.
- Reward item.
- Booster card reveal.

## 5. Component contract

Mỗi component record phải ghi:

- purpose,
- data inputs,
- emitted UI intents/commands,
- logical dimensions,
- container hierarchy,
- typography styles,
- states,
- overflow rules,
- keyboard/controller focus behavior,
- fixture IDs,
- Web selector,
- Godot scene path,
- parity screenshot.

Không mark component `LOCKED` nếu chưa test long name, zero value, max stack, disabled và small viewport/reference resolution.

## 6. Typography

Roles:

- `display`: planet/boss title, dùng hạn chế.
- `heading`: panel title.
- `body`: rules và explanation.
- `label`: stat, intent, tag.
- `number`: Energy, Hull, damage preview.
- `caption`: metadata/debug.

Rules:

- Card rules tối đa khoảng 3–5 dòng ở reference size. **HYPOTHESIS**
- Không nhúng text trong generated asset.
- Dùng icon + text cho mechanic quan trọng; không dựa duy nhất vào màu.
- Computed preview phải phân biệt base và bonus, ví dụ `5 + 1 = 6`, đồng thời hiện `20% bonus` và rounding `FLOOR` khi inspect.
- Truncation phải có tooltip hoặc expanded inspection.

## 7. Color và accessibility

- Hull, Shield, Armor có cả màu, icon và label khác nhau.
- Intent category có shape/icon khác nhau, không chỉ đỏ/vàng/xanh.
- Disabled state không chỉ giảm opacity đến mức unreadable.
- Focus ring luôn thấy được trên keyboard/controller navigation.
- Status stack dùng số thật; không yêu cầu đếm icon trùng.
- Support reduced motion bằng cách rút ngắn/skip nonessential animation.

## 8. Motion

Animation duration là token, không hard-code trong component.

- Micro feedback: 80–140 ms.
- Panel transition: 160–240 ms.
- Card play: 180–320 ms.
- Reward reveal có skip/fast mode.

Các con số là **HYPOTHESIS**. Gameplay state commit trước; animation chỉ trình bày event và không được quyết định outcome.

Combat UI dùng event queue để trình bày. Fast-forward có thể consume nhiều presentation events nhưng không bỏ gameplay events.

## 9. Screen build order

1. Debug fixture gallery.
2. Combat HUD.
3. Combat hand/targeting.
4. Reward/victory.
5. Deck Builder.
6. Home Planet/production.
7. Ship/research.
8. World Map/Intel.
9. Trade/booster/mastery.

## 10. Godot implementation rules

- Gameplay rule không nằm trong `_on_button_pressed`.
- Reusable UI là `.tscn` riêng với typed view script.
- View nhận view model hoặc read-only state projection.
- Theme variation dùng cho semantic variants; không duplicate StyleBox tùy tiện.
- Nine-slice frame dùng `NinePatchRect` hoặc StyleBoxTexture với margins được ghi trong asset metadata.
- Mouse, keyboard và controller gọi cùng UI intent.
- Tooltip không che intent hoặc target quan trọng.
- Debug overlays chỉ tồn tại trong dev build.

## 11. Definition of Done cho một screen

- Chạy với fixture, không cần full backend.
- Có loading/empty/locked/error state nếu applicable.
- Có keyboard focus order.
- Không overflow ở 960×540.
- Screenshot Web/Godot đã review theo parity workflow.
- Không có gameplay calculation duplicate trong view.
- Pixel assets được kiểm tra ở 1× và 2×.
