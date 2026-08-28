# PHASE 1 — Headless Combat

## Objective

Combat chạy hoàn chỉnh bằng commands và structured events, không phụ thuộc UI scene.

## Subphases

### 1A — Deck/turn

- Draw, hand, discard, exhaust.
- Energy refresh.
- Play validation.
- End turn.

### 1B — Effects/damage

- Damage, Shield, Armor, Hull/HP.
- Heal, Draw, Discard, ModifyEnergy.
- Death/victory/defeat.

### 1C — Status

- Poison, Fracture, Jam, Weakness, System Failure.
- Apply/remove/tick/duration.

### 1D — Enemy/intent

- Multi-enemy.
- Target validation.
- Intent planning.
- Enemy phase/order.

### 1E — Passive entities

- One summon.
- One module.
- Two relics.

## Required tests

- Same seed + commands = same events/final state.
- Reshuffle and hand-full.
- Shield → Armor → Hull.
- Poison direct damage.
- Death giữa effect chain.
- Invalid/dead target.
- Relic once-per-turn.
- Full summon/module zone.

## Exit gate

- Scripted three-turn scenario passes.
- Tank + Support + Striker formation behaves correctly.
- Persistent Hull can be passed into a second encounter request.
- No card/enemy-specific rule script for fixture content.
- Combat result matches contract in `docs/14_feature_contracts.md`.

## Not in scope

- Player-facing UI.
- Balance/content volume.
- Rewards applied to profile.
