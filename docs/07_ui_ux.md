# 07 — UI / UX Brief

## Target logical resolution

Khuyến nghị: **960×540 logical resolution**, scale 2× lên 1920×1080.

Pixel assets vẫn đủ lớn để UI hiện đại, không bị hạn chế kiểu handheld cổ.

Godot:
- nearest filtering cho pixel assets,
- kiểm soát pixel snap,
- text/UI Control có thể dùng font pixel riêng nhưng readability ưu tiên hơn nostalgia.

## Asset target size

- Icons: 32×32
- Relic: 48–64
- Small enemy: 96×96
- Normal enemy: 128×128
- Elite: 160×160
- Boss: 192–256
- Card illustration: ~128×96
- Ship: ~192×128
- Planet illustration: 256×256

## Combat screen

Top:
- Hull/Shield
- Turn
- Field
- player statuses

Center:
- enemy formation
- intent above each enemy
- status stack readable
- player drone/module zone

Bottom:
- Energy
- hand
- Draw/Discard counts
- End Turn

Do not hide enemy intent behind hover/click.

## Card UI

Show:
- Energy cost prominent.
- Name.
- Type/tag.
- Art.
- concise rules.
- computed preview e.g. `Deal 8 (+4)`.

Mass ít prominent trong combat; Mass prominent trong Deck Builder.

## Deck Builder

3-column suggestion:

Left:
- filters
- collection

Center:
- current deck
- card count
- Mass total

Right:
- Ship stats
- computed scaling
- relics

Khi hover/add/remove card:
- update expected output preview,
- show why output changed.

## Home Planet

Planet illustration lớn, building hotspots:
- Mine/Extractor
- Processor
- Research
- Shipyard
- Trade Port

Không cần free-placement city builder trong MVP.

## World Map

Linear main chain, side nodes optional.

Planet node shows:
- Mastery level/bar
- Campaign progress
- Trade status
- Card collection count
- Threat rating

## Pack opening

Fast.
Support:
- Open Again
- Open ×5 later

No long mandatory animation after novelty wears off.

## Intel panel

Show:
- enemy families,
- key threats,
- known boss mechanics,
- recommended counter tags when unlocked.

Example:
Threats:
- Heavy physical
- Armor Break
- Card Jam
- Summons

Recommended:
- Cleanse
- AoE
- Engineering
