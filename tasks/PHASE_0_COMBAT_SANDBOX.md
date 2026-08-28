# CODEX TASK — PHASE 0 COMBAT SANDBOX

> Historical combined brief. Execution đã được chia thành
> `PHASE_0_PROJECT_FOUNDATION.md` → `PHASE_1_HEADLESS_COMBAT.md` →
> `PHASE_2_COMBAT_GREYBOX.md` → `PHASE_3_COMBAT_SANDBOX.md`.

## Objective

Tạo playable debug combat sandbox chứng minh combat architecture và deck preparation.

## Build order

### Sprint 0.1 — Data + runtime skeleton
- CardData
- EffectData base
- EnemyData
- EnemyActionData
- StatusData
- RelicData
- runtime CombatState
- runtime EntityState
- ID registry + validator
- seeded RNG

Acceptance:
- load fixtures
- validate IDs
- print deterministic initial combat state.

### Sprint 0.2 — Deck/turn
- draw pile
- hand
- discard
- exhaust
- energy refresh
- card play validation
- target validation
- Mass validation outside combat

Acceptance:
- scripted test can play 3 turns deterministically.

### Sprint 0.3 — Effects
Implement:
- Damage
- GainShield
- HealHull
- ApplyStatus
- RemoveStatus
- Draw
- Discard
- ModifyEnergy

Acceptance:
- effects produce structured CombatLog events.
- no card-specific combat script.

### Sprint 0.4 — Enemy + intent
- multi-enemy
- action planner
- visible intent
- target selection
- enemy phase

Acceptance:
- Tank + Support + Striker formation behaves correctly.
- player can inspect next action.

### Sprint 0.5 — Status
Implement:
- Poison
- Fracture
- Jam/Lock
- Weakness
- SystemFailure

Acceptance:
- duration/tick ordering documented and tested.

### Sprint 0.6 — Summon/module
- Summon entity
- Module passive
- Destroy summon
- target summon

### Sprint 0.7 — Relic
Implement 2 rule-changing relics.

### Sprint 0.8 — Debug UI
- combat battlefield
- enemy intent
- hand
- energy
- hull/shield
- status tooltip
- combat log toggle
- seed display

### Sprint 0.9 — Content test
- 20–25 cards
- 6 enemy archetypes
- 1 boss
- 3 deck presets

## Exit Criteria

- 3 deck styles feel meaningfully different.
- enemy composition changes deck choice.
- same seed reproducible.
- UI can explain output.
- no architecture dependency on STONE/PLANT hard-code.
