# Component — Combat Card

- Spec revision: 1
- Web selector: `.combat-card`
- Godot target: `res://ui/components/combat_card.tscn`
- Logical size: 132×184

## Inputs

- instance ID,
- name,
- Energy cost,
- type/tags,
- art ID,
- resolved rules text,
- computed preview,
- playable flag,
- invalid reason,
- selected/targeting state,
- locked duration.

## UI intents

- inspect,
- request play,
- cancel selection.

## States

- normal,
- hover/focus,
- selected,
- unaffordable,
- invalid target,
- locked/rooted,
- resolving,
- disabled.

## Layout

`Frame → Margin → VBox`:

1. Cost + name row.
2. Art region.
3. Type/tag row.
4. Rules region.
5. Computed preview/footer.

Energy là số prominent nhất. Mass không hiện prominent trong combat.

## Edge fixtures

- `stone_rock_cannon_instance_01`
- long two-line title,
- zero-cost card,
- multi-effect text,
- locked card,
- insufficient-energy card.

## Done

- Không overflow ở reference size.
- Title tối đa hai dòng; rules overflow có inspect tooltip.
- Mouse/keyboard/controller gọi cùng request-play intent.
- Không tự trừ Energy hoặc resolve effect.
