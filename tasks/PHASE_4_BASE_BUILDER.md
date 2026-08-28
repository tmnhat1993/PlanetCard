# PHASE 4 — Base Builder Standalone

## Objective

Home economy chạy độc lập bằng debug cycle/result mocks, chưa cần Combat scene.

## Scope

- Resource inventory.
- Mine/Extractor.
- Processor recipes.
- Production queue.
- Advance cycle command.
- Claim output.
- Home Planet hotspots.
- Building panels.
- Research placeholder/first unlock.
- Shipyard upgrade purchase.
- Trade Port locked state.
- Profile save/load foundation.

## Debug adapters

- Advance 1 Cycle.
- Simulate Stage Victory.
- Simulate Expedition Return.
- Grant test resources.

Chỉ có trong dev build và phải hiện `DEV` marker.

## Required decisions

- Input reservation timing.
- Queue size/cancel/refund.
- Upgrade prerequisite.
- Resource caps hoặc unlimited MVP.

Defaults nằm trong `docs/18_save_and_progression_model.md` và có thể adjust.

## Exit gate

- Queue Ore → Alloy → Precision Crystal chạy deterministic theo cycles.
- Spend resource mua Cargo hoặc Hull upgrade.
- Save/load round trip giữ inventory, queue và upgrade.
- Locked/empty/error UI states hoạt động.
- Base không import/call CombatController.
