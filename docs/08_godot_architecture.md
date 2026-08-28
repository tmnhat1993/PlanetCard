# 08 — Godot Architecture

## Engine

Godot 4.x, typed GDScript.

## Suggested directories

res://
  data/
    cards/
    enemies/
    encounters/
    planets/
    relics/
    statuses/
    buildings/
    ship_upgrades/
  scripts/
    core/
    combat/
    effects/
    data/
    economy/
    progression/
    ui/
  scenes/
    boot/
    home/
    world_map/
    combat/
    deck_builder/
    pack_opening/
  ui/
    components/
    themes/
  art/
    approved/
    placeholder/
  tests/
    combat/
    data/
    economy/

## Static Resource classes

- CardData
- EffectData
- EnemyData
- EnemyActionData
- StatusData
- RelicData
- PlanetData
- BuildingData
- EncounterData
- ShipUpgradeData

## Runtime state

Không mutate Resource dùng chung.

Runtime:
- CombatState
- CombatEntityState
- DeckRuntime
- StatusInstance
- SummonState
- ShipRunState
- PlanetProgressState
- EconomyState

## Combat modules

### CombatController
Orchestrates state transitions.

### EffectResolver
Single entrypoint to resolve effects.

### TargetResolver
Validate and resolve targets.

### StatusManager
Apply/tick/remove statuses.

### DeckManager
Draw/discard/exhaust/lock/card zones.

### EntityManager
Player/enemies/summons/modules.

### IntentSystem
Build/reveal enemy actions.

### CombatRng
Seeded random abstraction.

### CombatLog
Structured events, not UI strings only.

## Effect model

CardData contains an array of EffectData.

Example conceptual structure:

CardData
- id
- faction
- rarity
- mass
- energy_cost
- tags
- target_rule
- effects[]

Effects are composed:
- DamageEffectData
- GainShieldEffectData
- ApplyStatusEffectData
- SummonEffectData
...

EffectResolver maps effect type/resource to behavior.

## Conditions

Support generic conditions rather than special-case scripts:

- target_has_status
- self_has_status
- card_tag_played_count
- hull_below_percent
- enemy_count
- summon_count
- field_is
- first_time_this_turn
- every_nth_trigger

## Event bus caution

Dùng signals/events có cấu trúc, không tạo global EventBus cho mọi thứ.

Combat event examples:
- card_played
- damage_dealt
- status_applied
- entity_defeated
- turn_started
- turn_ended

Relic/module passives subscribe through controlled systems.

## Determinism

Given:
- same seed,
- same starting state,
- same player actions,

combat result phải reproducible.

Điều này giúp:
- debug,
- balance simulation,
- replay,
- seeded challenge sau này.

## Save data

Save IDs + runtime values, không serialize Resource object graph trực tiếp.

Version save schema ngay từ vertical slice:
`save_version: 1`

## Content validation

Startup/dev validator:
- duplicate IDs,
- missing referenced status/card,
- negative mass/cost,
- invalid effect target,
- encounter references nonexistent enemy,
- planet stage count mismatch,
- loot pool invalid.

Fail loudly trong dev build.
