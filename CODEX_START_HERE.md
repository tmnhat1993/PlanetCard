# CODEX — START HERE

Bạn đang triển khai một game card-battler + planetary economy trong Godot.

## 1. North Star

Đây **không phải** city builder có card combat và cũng không phải Slay the Spire clone có thêm màn hình economy.

Core promise:

> Người chơi sở hữu một hành tinh, dùng kinh tế của hành tinh để nâng battleship và tạo lợi thế deckbuilding, sau đó chinh phục các hành tinh khác để mở hệ card, local economy và chiến thuật mới.

Một hành tinh phải là một **combat + economy ecosystem**, không chỉ là biome hoặc skin.

## 2. Vertical slice bắt buộc

Chỉ STONE + PLANT.

Người chơi có thể bắt đầu STONE hoặc PLANT về sau, nhưng implementation order:

1. Project foundation + data contracts.
2. Headless combat.
3. Combat greybox UI.
4. Combat sandbox/content validation.
5. Base Builder standalone bằng debug adapters.
6. Deck/Ship Builder.
7. First integration.
8. STONE playable slice.
9. PLANT campaign 5 stages + boss.
10. Trade License → export → booster → hybrid deck → Mastery.

Không triển khai civilization cao cấp trước khi loop này ổn.

Execution details và exit gates nằm trong `IMPLEMENTATION_START_HERE.md`.

## 3. Hard rules

### Architecture
- Godot 4.x.
- Typed GDScript.
- Gameplay logic không nằm trong UI node.
- Custom Resource cho static game data.
- Runtime state tách khỏi static data.
- Card không có script riêng nếu chỉ khác data/effects.
- Enemy action không có script riêng nếu có thể compose effect primitives.
- Không hard-code faction check trong combat resolver.
- Tất cả effect phải đi qua `EffectResolver`.
- RNG phải có seedable abstraction.
- Combat phải deterministic khi cùng seed + cùng input.

### Combat
- Deck Mass/Capacity != Energy.
- Starting Hull: 100.
- Starting Cargo: 10.
- Starting Reactor: 3 Energy/turn.
- Starting Relic Slots: 2.
- Starting deck target: 9 cards / 10 Mass.
- Multi-enemy formation supported từ Phase 0.
- Enemy Intent hiển thị trước.
- Hull persist qua các battle trong expedition.
- Shield reset mỗi encounter.
- No permadeath trong vertical slice.

### Content
STONE = stable / armor / setup / fracture / heavy hit.
PLANT = poison / growth / regen / seed / root / summon.

### UX
- Combat UI ưu tiên readability hơn spectacle.
- Player phải hiểu tại sao damage/block/heal có output hiện tại.
- Deck Builder luôn hiển thị Mass X/Y và Ship scaling stats.
- Telegraph mechanic khó trước khi nó gây fail bất ngờ.

## 4. Required gameplay vocabulary

Player và enemy dùng chung effect vocabulary:

- Damage
- GainShield
- GainArmor
- HealHull
- ApplyStatus
- RemoveStatus
- BuffStat
- DebuffStat
- Draw
- Discard
- Exhaust
- LockCard
- AddJunkCard
- ModifyEnergy
- Summon
- DestroySummon
- CreateModule
- DestroyModule
- SetField
- Counter
- Cleanse
- Sacrifice
- Transform
- StealBuff

Không cần implement tất cả ở sprint đầu; xem roadmap.

## 5. Stats

Ship:
- Hull
- Reactor
- Cargo
- Relic Slots

Scaling:
- Arsenal → direct damage / missile / burn.
- Engineering → shield / repair / armor / modules.
- Science → poison / corrosion / debuff / field.
- Command → drone / summon / draw / manipulation.

Duration scaling ưu tiên breakpoint thay vì % liên tục.

## 6. Development discipline

Mỗi task:
1. Viết test hoặc debug scenario.
2. Implement system.
3. Tạo minimal data fixture.
4. Chạy scenario.
5. Chỉ sau đó mới nối UI.
6. Commit nhỏ theo system.

Không build 50 cards để test architecture. Dùng 10–20 cards có chủ đích.

## 7. Definition of Done của vertical slice

Một người chơi mới phải có thể:

- hiểu STONE deck trong tutorial,
- chỉnh deck theo enemy intent,
- clear 5-stage PLANT campaign,
- nhận Trade License,
- sản xuất và export product,
- mua pack bằng local currency,
- mở được Plant cards,
- thấy Mastery progress,
- đổi relic / nâng cargo,
- tạo hybrid deck,
- quay lại challenge và cảm nhận build mới mạnh/khác rõ.

Nếu thiếu bất kỳ mắt xích nào ở trên, vertical slice chưa hoàn tất.

## 8. Art

Trước khi sửa PixelLab integration:
- đọc `https://api.pixellab.ai/v2/llms.txt`
- đọc OpenAPI hiện hành nếu cần field chi tiết.
- không invent endpoint/parameter.
- API token chỉ đọc từ environment.
- không commit token.
- không overwrite `assets/approved`.
