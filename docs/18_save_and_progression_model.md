# 18 — Save & Progression Model

## 1. Goals

- Save permanent profile bằng IDs + runtime values.
- Không serialize Resource graph.
- Apply combat reward/production advancement idempotently.
- Có version/migration từ vertical slice.
- Save file hỏng không âm thầm overwrite bản tốt gần nhất.

## 2. Top-level save

```json
{
  "save_version": 1,
  "profile_id": "runtime_uuid",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",
  "content_version": "vs_001",
  "player": {},
  "ship": {},
  "collection": {},
  "decks": [],
  "relics": {},
  "economy": {},
  "planets": {},
  "active_expedition": null,
  "transaction_journal": []
}
```

Timestamps không ảnh hưởng gameplay clock ở MVP.

## 3. New game defaults

Initial hypothesis:

- Hull/Max Hull 100.
- Reactor 3.
- Cargo 10.
- Relic Slots 2.
- Arsenal 2.
- Engineering 2.
- Science 0.
- Command 0.
- Starting deck: 9 cards / 10 Mass theo `docs/06_ship_progression.md`.
- STONE home unlocked.
- PLANT stage 1 visible sau tutorial gate. **HYPOTHESIS**
- Không có realtime/offline production.

Defaults phải đến từ versioned new-game definition, không rải trong UI scripts.

## 4. Collection

Lưu:

- owned count theo card ID,
- discovered flag nếu cần tách khỏi ownership,
- favorite/seen UI flags,
- planet Knowledge,
- pity/progress state theo pack family.

Duplicate conversion là transaction:

1. Roll card.
2. Check ownership/duplicate rule.
3. Add card hoặc Knowledge.
4. Add mastery nếu applicable.
5. Commit journal.

## 5. Decks và loadout

Deck record:

- deck ID/name,
- ordered hoặc counted card IDs,
- relic loadout,
- last validation result/version,
- updated timestamp.

Save có thể giữ invalid deck sau balance/content change, nhưng không cho launch cho tới khi revalidate.

## 6. Economy state

Lưu:

- resources/currencies,
- buildings và levels,
- production queues,
- remaining cycles,
- reserved/consumed inputs theo queue policy,
- research unlocks,
- ship upgrade IDs,
- trade licenses,
- trade unlock/state.

### Queue hypothesis

- Inputs bị reserve/consume khi queue job.
- Cancel trước khi job bắt đầu refund 100%; job đang chạy refund 50%. **HYPOTHESIS — balance/UX review required**
- Mỗi building có một active job và queue length 5 ban đầu. **HYPOTHESIS**
- Không có wall-clock timestamp/offline progress trong MVP.

## 7. Planet progress

Mỗi planet:

- highest unlocked stage,
- clear state và best result theo stage,
- first-clear claimed,
- boss defeated,
- trade license,
- mastery points/tier,
- challenge completion,
- known Intel,
- card collection counters nếu cần cache UI.

First-clear reward và production advancement dùng source ID để không apply hai lần.

## 8. Active expedition

Lưu giữa stages:

- expedition ID,
- planet/current stage,
- remaining Hull,
- loadout snapshot,
- expedition seed/root seed,
- cleared encounters,
- unbanked salvage,
- applied result IDs,
- rules/content version.

Save giữa combat là **OUT OF SCOPE ban đầu**. Autosave trước encounter và sau result commit. Nếu app đóng giữa combat, resume từ đầu encounter với cùng seed/request. **HYPOTHESIS**

## 9. Failure

Vertical slice default:

- Return home.
- Lose 50% unbanked salvage, round down. **HYPOTHESIS**
- Permanent cards/upgrades/licenses/mastery đã banked không mất.
- Production chỉ advance cho completed stages, không advance cho failed encounter. **HYPOTHESIS**
- Current Hull hồi về một home recovery rule cần định nghĩa trước Phase 7; debug build có thể full heal.

## 10. Save transaction order

Sau encounter:

1. Validate CombatResult against active expedition.
2. Append pending transaction journal entry.
3. Update expedition Hull/state.
4. Apply RewardBundle idempotently.
5. Advance production idempotently.
6. Mark transaction committed.
7. Write temp save.
8. Validate reread/checksum.
9. Rotate previous backup.
10. Atomically replace main save.

## 11. Files and recovery

- Main save.
- Previous known-good backup.
- Temporary save during write.
- Optional human-readable debug export in dev build.

On load failure:

1. Do not overwrite bad file.
2. Try backup.
3. Report actionable error.
4. Allow diagnostic export in dev build.

## 12. Migration

Migration chạy tuần tự:

`v1 → v2 → v3`

- Migration function có fixture input/output tests.
- Unknown future save version phải fail safely.
- Removed content IDs cần alias/tombstone/refund policy.
- Balance change không rewrite saved base facts trừ khi migration yêu cầu.

## 13. Autosave points

- New profile creation.
- Production queue/cancel/claim.
- Ship/research purchase.
- Deck/relic loadout save.
- Expedition launch.
- Encounter result commit.
- Expedition return/failure.
- Pack purchase/result commit.

UI animation không phải autosave boundary; domain transaction là boundary.

## 14. Open decisions before Phase 7

- Home Hull recovery/cost.
- Failure salvage loss percentage.
- Queue cancel/refund.
- Resume-mid-combat requirement.
- Number of save slots.
- Manual save availability.
- Cloud save/platform integration.
