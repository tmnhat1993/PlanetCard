# 19 — Open Decisions & Hypotheses

Đây là decision backlog, không phải danh sách blocker. Implementation dùng default hiện hành cho tới khi có evidence để đổi.

## Status vocabulary

- `OPEN`: chưa có default an toàn, có thể block phase.
- `HYPOTHESIS`: có default để implement/playtest.
- `LOCKED`: đã quyết định cho milestone.
- `REVISIT`: từng lock nhưng có evidence cần xem lại.

## Combat

| Decision | Default | Status | Review gate |
|---|---|---|---|
| Turn draw | Discard non-retained, draw to 5 | HYPOTHESIS | Phase 3 |
| Hard hand limit | 10 | HYPOTHESIS | Phase 3 |
| Damage order | Shield → Armor → Hull | HYPOTHESIS | Phase 1 tests/Phase 3 feel |
| Armor model | Consumable pool across encounter turns | HYPOTHESIS | Phase 3 |
| Poison | Owner end, direct, no decay | HYPOTHESIS | Phase 3 |
| Player summon/module slots | 2/2 | HYPOTHESIS | Phase 3 |
| Intent baseline | Next intent always visible | HYPOTHESIS | Phase 2 |
| Scanner | More future actions/mechanic detail | HYPOTHESIS | Phase 7 |

## Economy/progression

| Decision | Default | Status | Review gate |
|---|---|---|---|
| Production clock | Expedition completed stage only | HYPOTHESIS | Phase 6 |
| Realtime/offline progress | None | LOCKED for MVP | After Phase 8 |
| Queue input | Reserve/consume on queue | HYPOTHESIS | Phase 4 |
| Queue length | 5, one active job/building | HYPOTHESIS | Phase 4 |
| Failed expedition salvage loss | 50% unbanked | HYPOTHESIS | Phase 7 |
| Home Hull recovery | Undefined | OPEN | Before Phase 7 |
| Pack price/drop/mastery thresholds | Undefined | OPEN | Before Phase 8 |

## Technical/UI

| Decision | Default | Status | Review gate |
|---|---|---|---|
| Content source | JSON canonical → typed Resource runtime | HYPOTHESIS | Phase 0 |
| Save mid-combat | Restart same encounter/seed | HYPOTHESIS | Phase 6 |
| HTML role | Reference renderer only | LOCKED | Phase 2 |
| UI parity tolerance | Main bounds within 2 logical px | HYPOTHESIS | Phase 2 |
| First platform | Desktop mouse/keyboard | HYPOTHESIS | Phase 0 |
| Controller support milestone | Undefined | OPEN | Before external Phase 7 test |

## Decision record template

```text
Date:
Decision:
Previous default:
New decision:
Evidence/playtest:
Affected docs/data/tests:
Rules/content/save migration impact:
Owner:
```
