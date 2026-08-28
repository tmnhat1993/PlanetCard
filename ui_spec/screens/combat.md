# Screen — Combat

- Spec revision: 1
- Reference size: 960×540
- Godot target: `res://ui/screens/combat/combat_screen.tscn`

## Hierarchy

### Top HUD

- Hull/Shield/Armor.
- Turn.
- Field.
- Player statuses.
- Seed/debug indicator chỉ trong dev build.

### Battlefield

- Enemy formation.
- Intent luôn visible.
- Enemy statuses.
- Player summon/module zones.
- Target indicators.

### Bottom HUD

- Energy.
- Hand.
- Draw/discard counts.
- End Turn.
- Combat log toggle.

## Required fixtures

- `combat_default.json`
- `combat_stress.json`

## Interaction

1. Focus/select card.
2. UI request validates through controller.
3. If target required, enter targeting mode and highlight valid targets.
4. Confirm target or cancel back to hand.
5. Controller returns presentation events.
6. UI animates or fast-forwards without recalculating results.

## Non-negotiable

- Intent không nằm sau hover.
- Low Hull không che current numeric value.
- Status icon có stack/duration và tooltip.
- End Turn cần confirm only while unresolved optional targeting; normal turn không dùng modal.
- Modal/reward không phá deterministic combat state.
