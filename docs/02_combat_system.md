# 02 — Combat System

## Hai loại cost

### Deck Mass / Cargo Capacity
Trả lời: "Tàu có thể mang deck nào?"

Starting Cargo = 10.

Ví dụ:
- 8 card Mass 1
- 1 card Mass 2
= 10 Mass.

### Reactor Energy
Trả lời: "Trong turn này đánh được card nào?"

Starting Reactor = 3 Energy/turn.

Một card có:
- Mass: ảnh hưởng deck construction.
- Energy: ảnh hưởng combat tempo.

Không dùng một con số cho cả hai.

## Starting ship

- Hull: 100
- Reactor: 3
- Cargo: 10
- Relic Slots: 2
- Arsenal: 2
- Engineering: 2
- Science: 0
- Command: 0

## Persistent damage

- Hull persist xuyên expedition.
- Shield reset mỗi encounter.
- Armor/status behavior định nghĩa rõ theo keyword.
- Repair có giá trị vì Hull không auto-full sau từng battle.

## Battlefield

Support nhiều enemy từ đầu:

[Support] [Tank] [Striker]
        Field
[Drone]         [Drone]
       Player Ship

Targeting và priority là gameplay.

## Enemy roles

- Striker: damage pressure.
- Tank: protect/redirect.
- Support: buff/heal.
- Controller: lock/tax/junk.
- Summoner: tạo unit.
- Predator: target drone/module.
- Elite: kết hợp mechanic.
- Boss: phases + rules.

## Enemy Intent

Mỗi enemy hiển thị action kế tiếp trước player turn.

Scanner upgrade:
- Lv1: next action.
- Lv2: next 2 planned actions nếu encounter cho phép.
- Lv3: reveal phase mechanic / hidden rule.

Difficulty đến từ quyết định, không phải surprise vô lý.

## Turn outline

1. Start Player Turn.
2. Resolve start-of-turn statuses.
3. Refresh Energy.
4. Draw cards.
5. Player actions.
6. End Turn.
7. Resolve player end effects.
8. Enemy phase theo initiative/order.
9. Resolve enemy end effects.
10. Cleanup/decrement durations.
11. Check victory/defeat.
12. Next turn.

## Effect vocabulary

Tất cả card, enemy action, relic, passive và field compose từ primitive effect.

Core Phase 0:
- Damage
- GainShield
- HealHull
- ApplyStatus
- RemoveStatus
- Draw
- Discard
- ModifyEnergy
- Summon
- DestroySummon

Phase 1–2:
- GainArmor
- BuffStat / DebuffStat
- LockCard
- AddJunkCard
- CreateModule
- DestroyModule
- SetField
- Cleanse
- Counter

Later:
- Sacrifice
- Transform
- StealBuff
- advanced conditional effects.

## Formula principle

Mỗi card có một `base`, một `compatible_system` và một `amplification_coefficient`. Phi thuyền có một chỉ số global `ship_amplification` và danh sách `compatible_systems`. Nếu hệ card không nằm trong danh sách tương thích, effective amplification bằng `0` và outcome chỉ còn base.

```text
bonus_percent = ship_amplification × amplification_coefficient
bonus_value   = floor(base × bonus_percent / 100)
outcome       = base + bonus_value
```

Ví dụ: Base Damage `5`, ship amplification tương thích `5`, card coefficient `4`:

```text
bonus_percent = 5 × 4 = 20%
bonus_value   = floor(5 × 20 / 100) = 1
outcome       = 5 + 1 = 6 Damage
```

Rule này dùng chung cho Damage, Heal Hull, Shield, Armor, Poison base, Summon HP và các outcome số nguyên khác. Effect không có primary numeric outcome không tự nhận scaling. Mọi kết quả làm tròn xuống bằng `floor` sau khi tính bonus; không làm tròn phần trăm trung gian.

## Duration breakpoint

Ví dụ debuff:
- Science 0–4 → 1 turn.
- Science 5–9 → 2 turns.
- Science 10+ → 3 turns.

Mục tiêu: tạo build breakpoint dễ đọc.

## Boss design rule

Boss phải kiểm tra những gì planet đã dạy, không giới thiệu 5 mechanic hoàn toàn mới.

Boss có thể:
- phase transition,
- summon,
- field effect,
- card disruption,
- escalating timer,
- conditional vulnerability.

Mỗi mechanic phải telegraph bằng intent, Intel hoặc animation/icon rõ.
