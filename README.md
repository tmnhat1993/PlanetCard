# Planet Deckbuilder — Codex Handoff Kit

Bộ tài liệu thiết kế + triển khai cho game deckbuilder theo hành tinh, hướng tới Godot và pipeline pixel-art qua PixelLab API.

## Mục tiêu vertical slice

Chỉ triển khai **STONE + PLANT** trước, nhưng phải chứng minh được loop hoàn chỉnh:

**Home Planet → sản xuất → nâng tàu → build deck → expedition → boss → trade license → local currency → booster pack → Planet Mastery → hybrid deck**

Nếu loop này chưa thú vị, **không mở rộng Light / Dark / Tech / Myth**.

## File quan trọng nhất

Codex phải đọc theo thứ tự:

1. `CODEX_START_HERE.md`
2. `IMPLEMENTATION_START_HERE.md`
3. `docs/00_game_vision.md`
4. `docs/13_combat_rules_v1.md`
5. `docs/14_feature_contracts.md`
6. `docs/09_phase_roadmap.md`
7. Task phase hiện tại.

Các file `tasks/PHASE_0_COMBAT_SANDBOX.md`, `PHASE_1_STONE_HOME.md` và
`PHASE_2_PLANT_FULL_LOOP.md` được giữ làm brief lịch sử. Execution task mới đã được
chia nhỏ trong `IMPLEMENTATION_START_HERE.md`.

## Nguyên tắc

- Data-driven trước content expansion.
- Tách **Deck Mass/Capacity** khỏi **Combat Energy/Reactor**.
- UI phải cho người chơi đọc được intent, status và scaling.
- Enemy không bị giới hạn 1 đơn vị.
- Card / enemy action / relic / passive / field cùng dùng một Effect vocabulary.
- Home economy phải quay lại phục vụ deckbuilding/combat.
- Không realtime waiting trong MVP: expedition là production clock.
- Art final chỉ làm sau khi combat sandbox có cảm giác tốt.
