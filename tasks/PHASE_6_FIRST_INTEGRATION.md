# PHASE 6 — First Integration

## Objective

Kết nối Base → Loadout → Combat → Reward/Production → Home lần đầu.

## Flow

1. Chọn encounter.
2. Validate deck/loadout.
3. Tạo `ExpeditionRequest`.
4. Chạy combat.
5. Nhận `CombatResult`.
6. Persist remaining Hull/run state.
7. Apply reward idempotently.
8. Advance production cycles idempotently.
9. Save transaction.
10. Hiện reward và return Home.

## Required scenarios

- Victory.
- Defeat.
- App restart sau request nhưng trước result.
- Retry result commit không duplicate reward.
- Three encounter expedition với persistent Hull.

## Exit gate

- Shield/temporary state reset giữa encounters; Hull persist.
- Mỗi completed stage advance đúng số cycle.
- Defeat policy đúng spec hiện hành.
- Reload không nhân đôi reward/cycle.
- Combat/Base chỉ giao tiếp qua shared contracts/services.
