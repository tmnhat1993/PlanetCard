# 09 — Development Roadmap v2

Roadmap chia feature thành module nhỏ có demo độc lập. Task chi tiết nằm trong `tasks/`.

## PHASE 0 — Project Foundation

Data classes, JSON→typed Resource loader, registry/validator, seeded RNG streams, structured log, debug runner và UI token skeleton.

Gate: fixtures validate; same seed tạo same initial state.

## PHASE 1 — Headless Combat

Deck zones, turn state, Energy, effects, damage, statuses, multi-enemy, intent, summon/module/relic và CombatResult.

Gate: scripted combat deterministic, không phụ thuộc UI.

## PHASE 2 — Combat Greybox

Playable Godot combat UI bằng placeholder; Web có thể làm reference renderer cho layout.

Gate: một encounter hoàn thành không cần console và intent/status/output readable.

## PHASE 3 — Combat Sandbox

20–25 cards, 6 enemy archetypes, encounters, boss, 3 deck presets, 3-battle expedition và art budget tối thiểu.

Gate: deck preparation thú vị, có 3 approaches và encounter làm thay đổi deck choice.

## PHASE 4 — Base Builder Standalone

Inventory, production queue/cycles, Home hotspots, building panels, ship upgrade và save/load bằng debug expedition adapters.

Gate: produce → process → upgrade → save/load không cần Combat scene.

## PHASE 5 — Deck & Ship Builder

Collection, deck Mass validation, computed preview, relic loadout và immutable expedition snapshot.

Gate: valid/invalid loadout rõ ràng và dùng cùng calculator/validator với combat.

## PHASE 6 — First Integration

Base → loadout → Combat → result → reward/production → save → Home.

Gate: persistent Hull, idempotent reward/cycle và reload-safe transaction.

## PHASE 7 — STONE Playable Slice

STONE Home, economy, research/upgrade, encounters và complete small loop.

Gate: economy tạo decision combat và external player hoàn thành loop không dùng dev controls.

## PHASE 8 — PLANT Full Core Loop

PLANT campaign/boss, Trade License, export, local currency, booster, duplicate Knowledge, Mastery và hybrid deck.

Gate: boss → trade → pack → new card → hybrid deck → challenge hoàn chỉnh.

## AFTER VERTICAL SLICE

- Advanced Mastery.
- Target crafting.
- Pack pity tuning.
- Card upgrades/presets.
- Scanner progression.
- 10-stage advanced planet framework.
- LIGHT/TECH/DARK/MYTH.
- Side nodes/events/story.
- Seeded/daily challenge.
- Ship classes/card fusion/NG+.

Không bắt đầu backlog này trước Phase 8 exit.

## Cross-cutting tracks

### UI

Foundation → Combat → Deck Builder → Home → Meta. Dùng `ui_spec` và parity workflow.

### Art

Placeholder → exploration → style lock → manifest production → import QA. Bulk art chỉ sau Phase 3 gate.

### Testing

Mỗi phase thêm fixtures, deterministic scenarios và regression tests trước khi nối UI/polish.

### Decisions

Default chưa validated được ghi `HYPOTHESIS` trong `docs/19_open_decisions.md` và review ở gate chỉ định.
