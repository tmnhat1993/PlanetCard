# 10 — Initial Balance Targets

Đây là **starting hypothesis**, không phải final truth.

## Player baseline

Hull: 100  
Reactor: 3  
Cargo: 10  
Relic Slots: 2  
Hand size: 5 (test starting point)  
Draw per turn: refill/draw policy phải A/B test.

## Starting deck

9 cards / 10 Mass.

Card Mass distribution:
- common/simple: mostly 1
- engine/heavy: often 2
- exceptional: 3+

Energy:
- bread-and-butter: 1
- strong setup/payoff: 2
- major swing: 3+

## Amplification starting point

- Ship amplification đầu game: khoảng `0–5` cho hệ đang dùng.
- Common card coefficient: khoảng `2–4`.
- Uncommon/Rare coefficient: khoảng `4–7`, nhưng rarity không bắt buộc cao hơn.
- UI và balance sheet luôn hiển thị `base`, `% bonus`, `bonus value` và final outcome riêng.
- Công thức chuẩn: `base + floor(base × ship_amplification × card_coefficient / 100)`.

## Encounter duration target

Normal: ~4–7 turns.
Elite: ~6–9.
Boss: ~8–14 depending phases.

Nếu normal fight dài 12 turn thường xuyên, pacing có vấn đề.

## Damage pressure

Mục tiêu không phải ép player mất HP mỗi trận; nhưng một expedition tốt phải làm sustain/repair đáng cân nhắc.

First balance pass:
- Normal encounter expected Hull loss: 0–12.
- Bad matchup/misplay: 10–25.
- Elite: meaningful persistent pressure.
- Boss: có khả năng kill từ healthy state nếu deck không counter mechanic.

## Card rarity

Rarity không đồng nghĩa card luôn mạnh hơn raw number.

Rare có thể:
- build-around,
- rule-changing,
- scaling,
- cross-faction synergy.

Common phải vẫn useful.

## Booster

Early:
- mostly common,
- uncommon visible,
- rare gated/boosted by Mastery.

Implement pity/progress hooks trước khi tuning drop rate final.
