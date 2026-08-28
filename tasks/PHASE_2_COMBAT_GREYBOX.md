# PHASE 2 — Combat Greybox

## Objective

Người chơi hoàn thành một encounter bằng Godot UI placeholder.

## Scope

- Combat screen container layout.
- Hull/Shield/Armor/Energy.
- Hand và combat card.
- Enemy formation, status, intent.
- Target selection/cancel.
- Draw/discard counts.
- End Turn.
- Tooltip/inspect.
- Combat log toggle và seed display.
- Victory/defeat panel.
- Presentation event queue + fast mode.

## UI workflow

- Dựng fixture Web preview cho combat default/stress nếu có lợi cho iteration.
- Godot là production implementation.
- Review theo `docs/16_web_godot_parity_workflow.md`.
- Placeholder-first; chỉ dùng atomic approved art nếu đã sẵn sàng.

## Exit gate

- Encounter hoàn thành không cần console.
- Người chơi hiểu target, intent, status và computed output.
- UI chỉ gửi commands, không mutate state.
- Stress fixture không overlap nghiêm trọng ở 960×540.
- Keyboard/mouse có focus/cancel path.

## Not in scope

- Final animation/art.
- Full card/enemy content.
- Base Builder.
