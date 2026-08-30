# Phase 1 — Web Preview ↔ Godot Parity Record

Reference resolution for both renderers: `960×540`.

## Main Menu

- Spec/reference: Web UI Lab `#/start`.
- Godot scene: `res://scenes/main_menu/main_menu.tscn`.
- Godot capture: `tests/artifacts/main_menu__default__godot__phase1.png`.
- Layout: PASS for title/logo/menu/footer hierarchy.
- Style: PASS for approved background/logo, pixel typography, dark panels, and
  gold focus treatment.
- Behavior: PASS for New Game, save-aware Continue, and Exit.

## PLANT Home

- Spec/reference: Web UI Lab `#/home`, PLANT state.
- Godot scene: `res://scenes/home/home.tscn`.
- Godot capture: `tests/artifacts/home__default__godot__phase1.png`.
- Layout: PASS for top HUD, world hotspots, central HQ, Bio Farm, and map CTA.
- Style: PASS for approved PLANT base art and green/gold semantic colors.
- Behavior: PASS for ready/empty harvest, affordable/unaffordable upgrade, and
  navigation.
- Intentional difference: Phase 1 hides functional management destinations and
  presents Shipyard as explicitly locked.

## Planet Select

- Spec/reference: Web UI Lab `#/world-map` and `#/planet-intel`.
- Godot scene: `res://scenes/planet_select/planet_select.tscn`.
- Godot capture: `tests/artifacts/planet_select__default__godot__phase1.png`.
- Layout: PASS for selected planet, locked node, intel panel, rewards, and launch.
- Style: PASS for approved space/planet art and faction state treatment.
- Behavior: PASS for Home and Launch paths.
- Intentional difference: World Map and Planet Intel are combined into one
  Phase 1 screen to keep the basic loop compact.

## Combat

- Spec/reference: Web UI Lab `#/combat`.
- Godot scene: `res://scenes/combat/combat.tscn`.
- Godot capture: `tests/artifacts/combat__default__godot__phase1.png`.
- Layout: PASS for title/vitals, three-enemy formation, ship, hand, Energy, and
  End Turn hierarchy.
- Style: PASS for approved combat art, compact cards, visible intent, and
  semantic Hull/Shield colors.
- Behavior: PASS for card selection, target selection, self cards, insufficient
  Energy disable, enemy phase, victory, defeat, and retreat.
- Intentional difference: summon/relic rails are omitted because management and
  passive entities are outside Phase 1.

## Combat Result

- Spec/reference: Web UI Lab `#/combat-result`.
- Godot scene: `res://scenes/result/result.tscn`.
- Godot capture: `tests/artifacts/result__victory__godot__phase1.png`.
- Layout: PASS for outcome header, defeated count, resource row, and navigation.
- Style: PASS for modal treatment and PLANT reward semantics.
- Behavior: PASS for Home/Map return and already-applied reward state.

## Known follow-up

- Add minimum-content, long-text, disabled, and crowded fixtures when the UI
  component scenes are extracted during combat hardening.
- Automate Web captures and pixel overlay after two or three screens stabilize.
- Font rasterization differences are accepted per the parity workflow.

