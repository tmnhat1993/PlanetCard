# PHASE 0 — Project Foundation

## Objective

Tạo Godot project và data/runtime skeleton đủ ổn định để các feature phát triển độc lập.

## Read first

- `docs/13_combat_rules_v1.md`
- `docs/14_feature_contracts.md`
- `docs/15_ui_design_system.md`

## Scope

- Godot 4.x project, typed GDScript.
- Directory structure.
- Typed static Resource classes.
- JSON loader/importer và registry.
- Cross-reference validator.
- Runtime IDs/card instance IDs.
- Seeded RNG với named streams.
- Structured log/event types.
- Test/debug runner.
- UI token + fixture loader skeleton.
- Dev build marker và debug menu shell.

## Fixtures

- 3 cards.
- 3 enemies.
- 2 statuses.
- 1 encounter.

## Exit gate

- Headless/debug run load và validate fixtures.
- Missing/duplicate ID fail loudly.
- Cùng seed in cùng initial state và RNG samples.
- UI fixture gallery mở được một placeholder component.
- Có một command documented để chạy validation/tests.

## Not in scope

- Playable combat.
- Final UI/art.
- Economy/save profile.
