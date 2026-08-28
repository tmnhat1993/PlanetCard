# PHASE 5 — Deck & Ship Builder

## Objective

Tạo valid expedition loadout snapshot từ collection và ship profile.

## Scope

- Collection/filter.
- Current deck.
- Card count.
- Mass X/Y.
- Add/remove card.
- Ship stats/computed preview.
- Relic slots/loadout.
- Deck save/load.
- Deck validator dùng chung với launch.
- Encounter Intel fixture.

## Fixtures

- Valid 9-card/10-Mass deck.
- Over-capacity deck.
- Missing-owned-card deck.
- Long-name/multi-tag cards.

## Exit gate

- Invalid deck vẫn có thể edit/save nhưng không launch.
- Mass/card ownership/minimum rules được báo rõ.
- Preview dùng cùng stat/effect calculator với combat.
- Output tạo được immutable deck/ship/relic snapshot.
- Web/Godot Deck Builder reference đã parity review.
