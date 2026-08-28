# Godot Starter Structure

Folder này không cố tạo half-working project. Codex nên tạo Godot project thật trong repository root hoặc copy cấu trúc đề xuất từ `docs/08_godot_architecture.md`.

## First implementation checkpoint

Một headless/debug scene có thể:
- load 3 card fixtures,
- load 3 enemies,
- create seeded combat state,
- draw hand,
- resolve one DamageEffect,
- produce structured combat log.

Sau đó mới làm visual battlefield.

## Naming

Static:
`*_data.gd`

Runtime:
`*_state.gd`

Systems:
`*_system.gd` / `*_manager.gd`

Effects:
`*_effect.gd`

UI:
`*_view.gd` / `*_panel.gd`

Không đặt combat rule trực tiếp trong button/card view.
