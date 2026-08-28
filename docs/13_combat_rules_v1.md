# 13 — Combat Rules v1

Tài liệu này là luật mặc định để implementation không phải tự suy diễn. Các mục có nhãn **HYPOTHESIS** là giả thuyết thiết kế cần playtest; thay đổi chúng phải đi kèm test và changelog.

## 1. Core invariants

- Cùng content version, seed, starting state và player commands phải tạo cùng kết quả.
- UI không mutate combat state trực tiếp; UI gửi command cho `CombatController`.
- Mỗi effect đi qua `EffectResolver` và sinh structured `CombatEvent`.
- Kiểm tra entity death sau từng atomic effect.
- Static data không bị mutate trong combat.
- Không dùng faction check trong resolver; faction identity đến từ tags, status, condition và effect composition.

## 2. Encounter state

Player bắt đầu vertical slice với:

- Max Hull: 100.
- Reactor: 3 Energy/turn.
- Cargo: 10 Mass.
- Relic Slots: 2.
- Base Hand Size: 5.
- Player Summon Slots: 2. **HYPOTHESIS**
- Player Module Slots: 2. **HYPOTHESIS**

Hull hiện tại đi qua các encounter trong cùng expedition. Shield, Armor, temporary stats, statuses, summons và modules reset khi encounter kết thúc, trừ khi data ghi rõ `persists_between_encounters=true`.

## 3. Zones và draw

Card zones:

- `DRAW_PILE`
- `HAND`
- `DISCARD_PILE`
- `EXHAUST_PILE`
- `LOCKED` là state của card instance, không phải zone riêng.

Luật mặc định:

1. Encounter bắt đầu: shuffle deck bằng deck RNG stream.
2. Player turn đầu draw đến Base Hand Size.
3. Cuối player turn, discard mọi card không có `RETAIN` hoặc lock/root effect giữ lại.
4. Đầu turn kế tiếp, draw đến Base Hand Size, không phải luôn draw đúng 5. **HYPOTHESIS**
5. Card effect `Draw N` có thể đưa hand vượt Base Hand Size, tối đa Hard Hand Limit 10. **HYPOTHESIS**
6. Nếu cần draw khi draw pile rỗng, shuffle discard pile ngay và tiếp tục draw.
7. Nếu cả draw và discard đều rỗng, phần draw còn lại fizzles và ghi log.
8. Nếu hand đã đạt Hard Hand Limit, card draw dư vẫn ở draw pile và effect ghi `DRAW_BLOCKED_HAND_FULL`.
9. Card Exhaust đi thẳng vào exhaust pile sau resolve thành công.
10. Card bị Lock/Root vẫn chiếm hand slot. Duration tiếp tục tick theo status/card-instance rule.
11. Card `PASSIVE` mặc định có `RETAIN_IN_HAND`: không bị discard ở cuối turn, người chơi luôn có quyền discard chủ động.
12. Passive còn trong hand chiếm một hand/draw slot. Ví dụ Base Hand Size 5 và đang giữ 1 Passive thì đầu turn chỉ draw thêm đến tổng 5 card, không draw 5 card mới.
13. Bonus của Passive `WHILE_RETAINED_IN_HAND` là computed modifier, không cộng dồn lại mỗi turn. Modifier biến mất ngay khi card rời hand.

## 4. Energy và card play

Thứ tự validate card play:

1. Combat đang ở `PLAYER_ACTION`.
2. Card nằm trong hand.
3. Card không bị locked.
4. Target hợp lệ.
5. Còn đủ Energy sau tất cả modifier.
6. Còn slot nếu effect bắt buộc tạo summon/module.

Sau khi validate:

1. Trừ Energy.
2. Phát event `CARD_PLAY_STARTED`.
3. Resolve effects theo thứ tự trong data.
4. Kiểm tra death/victory/defeat sau từng atomic effect.
5. Đưa card vào discard hoặc exhaust.
6. Phát event `CARD_PLAY_COMPLETED`.

Nếu target chết giữa chuỗi effects:

- Effect sau yêu cầu cùng target sẽ fizzle trừ khi có `retarget_rule`.
- Effect self/global vẫn resolve.
- Không tự động chọn target mới.

## 5. Damage pipeline

### Card outcome amplification

Mỗi card numeric có primary outcome với `base`, `compatible_system` và `amplification_coefficient`. Ship có đúng một stat `ship_amplification`; chỉ dùng stat này khi `compatible_system` của card nằm trong `ship.compatible_systems`, nếu không effective amplification bằng `0`:

`outcome = base + floor(base × ship_amplification × amplification_coefficient / 100)`

- `ship_amplification` và coefficient không âm.
- Làm tròn xuống đúng một lần ở bonus value.
- Snapshot các input khi bắt đầu resolve atomic effect; UI preview phải dùng cùng hàm thuần.
- Card không tương thích hoặc ship stat bằng 0 chỉ tạo base outcome.
- Bonus được ghi riêng trong `EFFECT_RESOLVED`: `base`, `bonus_percent`, `bonus_value`, `outcome`.
- Ví dụ `base=5`, ship `5`, coefficient `4` → `20%`, bonus `1`, outcome `6`.

### Normal damage

Damage thông thường đi theo thứ tự:

`Shield → Armor → Hull/HP`

- Shield là pool bị consume trước.
- Armor là pool bị consume sau Shield và tồn tại giữa các turn trong cùng encounter. **HYPOTHESIS**
- Hull/HP không thể nhỏ hơn 0.
- Shield và Armor không thể nhỏ hơn 0.
- Multi-hit resolve từng hit riêng và phát event riêng.

### Direct damage

Direct damage bỏ qua Shield và Armor. Phase đầu chỉ dùng cho Poison/Corrosion khi data ghi rõ `damage_channel=DIRECT`.

### Healing

- `HealHull` không vượt Max Hull.
- Heal không phục hồi Shield hoặc Armor.
- Heal trên entity đã defeated fizzles.
- Overheal không chuyển đổi thành Shield nếu effect không ghi rõ.

### Death timing

- Entity được đánh dấu defeated ngay khi Hull/HP về 0.
- Trigger `ENTITY_DEFEATED` chạy sau atomic effect gây chết.
- Defeated entity không thực hiện action đã planned.
- Victory/defeat được kiểm tra sau trigger queue liên quan đến cái chết đã resolve.

## 6. Targeting và formation

Target rules phase đầu:

- `SELF`
- `SINGLE_ENEMY`
- `ALL_ENEMIES`
- `RANDOM_ENEMY`
- `SINGLE_ALLY`
- `ALL_ALLIES`
- `PLAYER_ZONE`
- `ENEMY_ZONE`

Formation slot order mặc định:

`SUPPORT → TANK → STRIKER`, sau đó theo slot index.

`PROTECTED` **HYPOTHESIS**:

- Protect effect lưu `protector_entity_id`.
- Single-target hostile effect nhắm protected unit được redirect sang protector nếu protector còn sống và target rule cho phép.
- AoE không bị redirect.
- Direct/global effect có thể bỏ qua protect nếu data ghi `ignores_protection=true`.

Không có implicit taunt. Mọi redirect phải đến từ status/passive rõ ràng.

## 7. Turn order

### Encounter start

1. Build runtime entities.
2. Reset encounter-only values.
3. Shuffle deck.
4. Resolve encounter-start passives.
5. Plan enemy intents.
6. Start player turn 1.

### Player turn

1. `PLAYER_TURN_STARTED`.
2. Resolve player start-of-turn triggers/statuses.
3. Refresh Energy đến Reactor value.
4. Draw đến Base Hand Size.
5. Enter `PLAYER_ACTION`.
6. Player plays zero or more cards.
7. Player requests End Turn.
8. Resolve player end-of-turn triggers/statuses.
9. Discard non-retained hand cards.
10. Decrement player-owned end-turn durations.

### Enemy phase

1. Enemies act theo Initiative giảm dần, hòa thì theo formation slot index. **HYPOTHESIS**
2. Trước mỗi action, bỏ qua defeated hoặc disabled entity.
3. Resolve action effects.
4. Resolve enemy end-of-turn statuses/triggers cho owner tương ứng.
5. Decrement enemy-owned durations.
6. Cleanup expired statuses.
7. Plan/reveal intent cho enemy phase kế tiếp.
8. Check end state và bắt đầu player turn mới.

## 8. Status rules

Mỗi `StatusData` phải khai báo:

- `stack_mode`: `ADD`, `REFRESH_DURATION`, `REPLACE`, `MAX`, `UNIQUE`.
- `max_stacks` hoặc `null`.
- `duration_type`: `TURNS`, `UNTIL_CONSUMED`, `ENCOUNTER`, `PERMANENT`.
- `tick_timing`.
- `duration_decrement_timing`.
- `dispel_tags`.
- `persists_between_encounters`.

Defaults phase đầu:

### Poison

- Stack mode: `ADD`.
- Tick: cuối turn của owner.
- Mỗi stack gây 1 direct damage.
- Không tự decay. **HYPOTHESIS**
- Cleanse/remove effect mới xóa stack.

### Fracture

- `UNTIL_CONSUMED`.
- Qualifying `PHYSICAL` hoặc `HEAVY` attack consume Fracture sau khi bonus được tính.
- Mặc định một qualifying hit consume toàn bộ instance.

### Jam/Lock

- Duration theo player turns.
- Card instance bị lock vẫn nằm trong hand.
- Duration giảm ở cuối player turn.
- Card rời hand do explicit discard/exhaust thì lock instance bị xóa.

### Weakness / System Failure

- Modifier áp dụng khi tính computed stat, không mutate base stat.
- Duration giảm ở cuối turn của owner.
- Nhiều instance dùng `REFRESH_DURATION`; modifier không cộng dồn ở Phase 0. **HYPOTHESIS**

## 9. Intent và enemy planning

- Enemy plan intent trước player action phase.
- Intent đã reveal không reroll do UI refresh/save-load.
- Nếu status làm action không hợp lệ, action fizzles hoặc dùng explicit fallback trong data; không random action mới ngầm.
- Weighted planner phải hỗ trợ `no_repeat_more_than`, condition và phase pool.
- Boss ưu tiên deterministic sequence/state machine hơn pure weighted random.
- Scanner Lv0 vẫn thấy next intent để bảo đảm readability. Scanner upgrade cung cấp thêm planned action hoặc hidden mechanic detail. Đây là cách giải quyết mâu thuẫn spec hiện tại. **HYPOTHESIS**

## 10. Summons và modules

- Summon là combat entity có HP, owner, slot, statuses và targetability.
- Module là persistent battlefield object; mặc định không có HP nếu data không khai báo.
- Khi zone đầy, effect tạo entity fizzles và không hoàn Energy/card.
- Destroyed summon/module rời zone sau death/trigger queue.
- Summon action order dùng Initiative; hòa thì slot index.
- Module passive subscribe qua controlled trigger registry, không kết nối trực tiếp vào global event bus.

## 11. RNG streams

Một master seed sinh các deterministic substream:

- `DECK`: shuffle và random discard.
- `ENEMY`: weighted actions và random enemy targets.
- `EFFECT`: random effect values/targets của player.
- `REWARD`: loot sau combat.

Thêm animation hoặc UI randomness không được consume gameplay RNG. Mỗi RNG event phải ghi stream và result trong debug log.

## 12. Command và event

Player command tối thiểu:

- `PLAY_CARD(card_instance_id, target_ids)`
- `END_TURN`
- `INSPECT_ENTITY(entity_id)` — read-only, không ảnh hưởng deterministic state.

Combat event tối thiểu:

- `TURN_STARTED`
- `ENERGY_CHANGED`
- `CARD_DRAWN`
- `CARD_PLAY_STARTED`
- `EFFECT_RESOLVED`
- `DAMAGE_APPLIED`
- `STATUS_APPLIED`
- `ENTITY_DEFEATED`
- `INTENT_PLANNED`
- `TURN_ENDED`
- `COMBAT_ENDED`

Event phải chứa IDs và numeric values, không chỉ chứa UI string.

## 13. Open tuning questions

Các câu hỏi không chặn implementation nhưng phải A/B test trong Combat Sandbox:

- Draw-to-5 hay draw-fixed-N.
- Armor pool hay flat reduction.
- Poison có decay không.
- Summon/module slot count.
- Initiative giảm dần hay formation-only.
- Hard Hand Limit 10.
- Retain/Root discard interaction.

Mọi thay đổi phải giữ replay versioned; replay cũ chỉ được đảm bảo khi cùng `combat_rules_version`.
