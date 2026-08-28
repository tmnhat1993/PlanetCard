# 22 — Plant & Stone one-star card sets

Đây là bộ common 1★ đầu tiên để test vòng lặp combat. Trong bảng, `Coeff` là `amplification_coefficient`; duration mặc định là số turn cố định.

## Plant 1★

| Card | Type | Cost | Base | Coeff | Rule |
|---|---:|---:|---:|---:|---|
| Thorn Snap | Action | 1 | 3 Damage | 4 | Deal damage. |
| Sap Leech | Action | 1 | 2 Damage | 4 | Heal Hull bằng 50% damage thực tế đã gây, làm tròn xuống. |
| Bloom Mend | Action | 1 | 3 Heal | 6 | Heal Hull. |
| Barkskin | Buff | 1 | 2 Defend | 0 | +2 Defend trong 3 turn; trị số cố định ở bản đầu. |
| Regrowth Cycle | Buff | 2 | 2 Heal/tick | 5 | Heal ở đầu turn trong 3 turn. `duration_amplification_coefficient=3` được lưu riêng nhưng chưa bật scaling duration. |
| Solar Bloom | Buff | 1 | 1 Energy/tick | 3 | +1 extra Energy ở đầu turn trong 2 turn. |
| Guardian Seed | Passive | 0 | 1 Defend | 10 | Aura trong lúc card ở hand; retain, optional discard, chiếm draw slot. |

## Stone 1★

Stone dùng cùng vai trò card để so sánh A/B, nhưng có base Damage/Defend cao hơn, coefficient thấp hơn và không có Heal.

| Card | Type | Cost | Base | Coeff | Rule |
|---|---:|---:|---:|---:|---|
| Meteor Fang | Action | 1 | 5 Damage | 3 | Deal damage. |
| Crushing Aegis | Action | 1 | 4 Damage | 3 | Gain Defend bằng 50% damage thực tế đã gây. |
| Basalt Bulwark | Action | 1 | 5 Defend | 4 | Gain Defend. |
| Orbiting Plates | Buff | 1 | 4 Defend | 0 | +4 Defend trong 3 turn; trị số cố định ở bản đầu. |
| Crystal Reinforce | Buff | 2 | 3 Defend/tick | 3 | Gain Defend ở đầu turn trong 3 turn. |
| Geothermal Core | Buff | 1 | 1 Energy/tick | 2 | +1 extra Energy ở đầu turn trong 2 turn. |
| Stone Sentinel | Passive | 0 | 2 Defend | 6 | Aura trong lúc card ở hand; retain, optional discard, chiếm draw slot. |

## Passive hand contract

- `discard_at_turn_end=false`.
- `player_may_discard=true`.
- `occupies_draw_slot=true`.
- Passive modifier là computed aura, không cộng dồn thêm mỗi turn.
- Khi card rời hand, modifier bị gỡ ngay.
- Draw đầu turn vẫn là “draw đến Base Hand Size”; một Passive đang giữ làm giảm số card mới rút được một.

## Balance assumptions to playtest

- Energy Cost và Mass đang là giá trị khởi đầu, chưa phải balance cuối.
- Buff duration không được amplification trong resolver v1. Trường duration coefficient của Regrowth Cycle chỉ là dữ liệu dự phòng để quyết định sau.
- Các effect dựa trên “damage dealt” dùng damage thực tế sau mitigation, không dùng damage trước Shield/Armor.
