# Implementation — Start Here

Tài liệu cũ giữ product vision. Bộ tài liệu mới chia implementation thành module nhỏ có demo/exit gate độc lập.

## Read order

1. `CODEX_START_HERE.md`
2. `docs/13_combat_rules_v1.md`
3. `docs/14_feature_contracts.md`
4. Task phase hiện tại.
5. Nếu làm UI: `docs/15_ui_design_system.md` và `docs/16_web_godot_parity_workflow.md`.
6. Nếu làm art: `docs/17_pixellab_production_workflow.md`.
7. Nếu làm profile/economy: `docs/18_save_and_progression_model.md`.
8. Trước quyết định tuning: `docs/19_open_decisions.md`.
9. Nếu dựng Web UI preview trước Godot UI: `docs/20_html_ui_preview_plan.md`.

## Execution order

1. `tasks/PHASE_0_PROJECT_FOUNDATION.md`
2. `tasks/PHASE_1_HEADLESS_COMBAT.md`
3. `tasks/PHASE_2_COMBAT_GREYBOX.md`
4. `tasks/PHASE_3_COMBAT_SANDBOX.md`
5. `tasks/PHASE_4_BASE_BUILDER.md`
6. `tasks/PHASE_5_DECK_SHIP_BUILDER.md`
7. `tasks/PHASE_6_FIRST_INTEGRATION.md`
8. `tasks/PHASE_7_STONE_SLICE.md`
9. `tasks/PHASE_8_PLANT_FULL_LOOP.md`

## Working convention

- `LOCKED`: implementation phải tuân theo cho milestone hiện tại.
- `HYPOTHESIS`: có default để tiến hành; cần playtest/review.
- `OPEN`: chưa có default đủ an toàn; phải quyết định trước gate ghi trong decision log.
- Không đổi một hypothesis âm thầm. Cập nhật `docs/19_open_decisions.md`, fixture và tests liên quan.
- Mỗi phase chỉ complete khi exit gate chạy được, không phải khi code “gần xong”.

## First implementation checkpoint

Phase 0 tạo project có thể:

- load/validate fixture JSON,
- tạo typed Resource runtime data,
- derive named RNG streams từ seed,
- in deterministic initial state,
- mở một UI fixture gallery placeholder.

Sau đó mới bắt đầu Phase 1 headless combat.
