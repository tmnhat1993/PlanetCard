# 14 — Feature Contracts

Mục tiêu của contract là cho phép Combat, Base Builder, Deck Builder và Progression chạy độc lập bằng mock data rồi kết nối dần.

## 1. Ownership

### PlayerProfileService

Sở hữu permanent state:

- collection,
- ship upgrades,
- relic inventory,
- saved decks,
- resource inventory,
- buildings/research,
- planet progress,
- trade licenses,
- mastery.

### CombatFeature

Sở hữu runtime combat state. Chỉ nhận snapshot và trả result; không tự ghi permanent profile.

### EconomyFeature

Sở hữu recipes, production queues và cycle advancement. Không gọi combat scene.

### ProgressionService

Là nơi duy nhất apply `RewardBundle`, unlock, mastery và first-clear state vào profile.

### UI

Đọc view model và gửi command. UI không sở hữu authoritative gameplay state.

## 2. Shared identifiers

- ID dùng lowercase snake_case: `stone_rock_cannon`.
- Enum-like vocabulary dùng uppercase snake case: `DAMAGE`, `SINGLE_ENEMY`.
- Save lưu ID, không lưu Resource graph.
- Mọi reference phải được registry validator xác nhận trước khi vào gameplay.

## 3. ExpeditionRequest

```json
{
  "request_version": 1,
  "expedition_id": "runtime_uuid",
  "planet_id": "plant",
  "stage_id": "plant_stage_01",
  "encounter_id": "plant_thornlings_01",
  "seed": 42821,
  "starting_hull": 92,
  "deck": {
    "card_ids": ["stone_rock_cannon"],
    "total_mass": 10
  },
  "ship": {
    "max_hull": 100,
    "reactor": 3,
    "cargo": 10,
    "arsenal": 2,
    "engineering": 2,
    "science": 0,
    "command": 0
  },
  "relic_ids": [],
  "content_version": "vs_001",
  "combat_rules_version": 1
}
```

Request là immutable snapshot. Upgrade profile trong lúc combat không thay đổi combat đang chạy.

## 4. CombatResult

```json
{
  "result_version": 1,
  "expedition_id": "runtime_uuid",
  "encounter_id": "plant_thornlings_01",
  "outcome": "VICTORY",
  "remaining_hull": 84,
  "turn_count": 5,
  "expedition_steps": 1,
  "defeated_enemy_ids": ["plant_thornling"],
  "reward_bundle": {
    "resources": {"ore": 3},
    "cards": [],
    "relics": [],
    "mastery": {},
    "licenses": []
  },
  "combat_summary": {
    "damage_dealt": 52,
    "hull_lost": 8,
    "cards_played": 14
  }
}
```

Combat không apply reward trực tiếp. `ProgressionService` validate và apply result đúng một lần bằng `expedition_id + encounter_id` idempotency key.

## 5. RewardBundle

Supported fields phase đầu:

- `resources: Dictionary[id, amount]`
- `currencies: Dictionary[id, amount]`
- `cards: Array[id]`
- `relics: Array[id]`
- `knowledge: Dictionary[planet_id, amount]`
- `mastery: Dictionary[planet_id, amount]`
- `licenses: Array[id]`
- `unlock_ids: Array[id]`

Duplicate card conversion được ProgressionService xử lý, không xử lý trong combat/pack UI.

## 6. Production contracts

### QueueProductionCommand

```json
{
  "building_id": "stone_processor",
  "recipe_id": "stone_alloy",
  "quantity": 5
}
```

### AdvanceProductionCommand

```json
{
  "cycles": 1,
  "reason": "EXPEDITION_STAGE_COMPLETED",
  "source_id": "runtime_uuid:plant_stage_01"
}
```

`source_id` phải idempotent để load/retry không advance production hai lần.

### ProductionAdvanceResult

Trả:

- consumed inputs,
- completed outputs,
- remaining jobs,
- blocked jobs,
- emitted notifications.

## 7. Deck validation contract

Input:

- card IDs,
- owned collection,
- ship cargo,
- minimum/maximum count,
- unlock restrictions.

Output:

```json
{
  "valid": false,
  "card_count": 9,
  "total_mass": 12,
  "cargo_capacity": 10,
  "errors": ["OVER_MASS_CAPACITY"],
  "warnings": []
}
```

Deck Builder và expedition launch phải gọi cùng validator.

## 8. Pack opening contract

Pack opening là domain operation, không phải animation operation.

Input:

- pack definition ID,
- profile eligibility,
- currency balance,
- reward RNG seed,
- mastery tier.

Output:

- rolled card IDs,
- new/duplicate flags,
- Knowledge conversion,
- mastery gained,
- updated pity/progress state.

UI chỉ reveal result đã được domain service commit. Skip animation không thay đổi reward.

## 9. Feature mocks

Mỗi feature phải chạy khi feature kế tiếp chưa tồn tại:

- Combat nhận fixture `ExpeditionRequest` từ debug menu.
- Base Builder có nút `Advance 1 Cycle`, `Simulate Victory`, `Simulate Defeat` trong dev build.
- Deck Builder dùng collection fixture.
- Progression có fixture RewardBundle.
- UI preview dùng cùng JSON fixture với Godot khi khả thi.

Mock command chỉ tồn tại trong debug build và phải có visual `DEV` indicator.

## 10. Integration sequence

1. Deck Builder tạo valid loadout snapshot.
2. Expedition service tạo request và active expedition record.
3. Combat trả result.
4. Expedition service cập nhật persistent Hull/run state.
5. ProgressionService apply reward idempotently.
6. Economy advance theo `expedition_steps`.
7. Save được commit.
8. UI navigate tới reward hoặc home.

Nếu bước 4–7 lỗi, transaction journal phải cho phép retry mà không nhân đôi reward/cycle.

## 11. Source-of-truth decision

Quy ước ban đầu:

- JSON là canonical authoring/interchange data trong vertical slice.
- Godot dùng typed custom `Resource` classes làm static runtime representation.
- Importer/loader validate JSON và tạo Resource objects/cache.
- Generated cache không hand-edit và không phải source of truth.
- Nếu sau playtest quyết định author trực tiếp bằng `.tres`, phải migration toàn bộ một lần; không duy trì hai nguồn cùng quyền.

Quyết định này là **HYPOTHESIS** nhằm giúp content diff/review/schema validation dễ hơn trong giai đoạn đầu.

## 12. Versioning

Version độc lập:

- `save_version`
- `content_version`
- `combat_rules_version`
- request/result contract version
- UI spec version
- art style version

Không dùng một global version để thay cho tất cả.
