# Godot Development Log

## 2026-08-29 — Phase 0 started

### Scope decision

- Created a new production project in `godot_project/`.
- Kept `web_preview/` unchanged and treated it as the reference renderer.
- Locked the logical viewport to `960×540` with Canvas Items stretching.
- Kept playable Base and Combat work outside Phase 0.

### Foundation implemented

- Added the Godot project and boot fixture-gallery scene.
- Added the initial directory split for core, data, combat, UI, scenes, and tests.
- Added typed Resources for cards, effects, enemies, enemy actions, statuses,
  encounters, planets, buildings, relics, and ship upgrades.
- Added a JSON content registry with duplicate-ID, scalar, and cross-reference
  validation.
- Added three card fixtures, three enemy fixtures, two statuses, and one
  encounter using PLANT-first content.
- Added named deterministic RNG streams: `DECK`, `ENEMY`, `EFFECT`, and
  `REWARD`.
- Added deterministic runtime IDs, minimal combat initial state, and structured
  event logging.
- Added UI token loading, Godot Theme creation, and a development fixture
  gallery placeholder.
- Added a headless Phase 0 verification runner and intentionally invalid
  fixtures for duplicate/missing-reference regression checks.

### Verification

- Godot detected at `/Applications/Godot.app`.
- Detected engine version: `4.7.1.stable.official`.
- Godot editor import completed with all global classes registered.
- Boot scene completed a three-frame headless smoke run without parser or
  runtime errors.
- Phase 0 headless runner passed `18/18` checks.
- Valid fixtures produced `0` validation errors and `0` warnings.
- Negative regression fixtures correctly emitted `DUPLICATE_ID` and
  `MISSING_REFERENCE` errors.

### Next checkpoint

- Open the fixture gallery in the Godot editor/game window for visual review.
- Add Web/Godot screenshot parity records when the first Phase 1 screen is
  implemented.
- Begin Phase 1 with Main Menu and the PLANT Home flow only after approval.

### Phase 0 exit gate

- [x] Godot 4.x project and production folder structure.
- [x] JSON fixtures load into typed runtime Resources.
- [x] Missing and duplicate IDs fail loudly.
- [x] Same seed/content produces the same initial state and RNG values.
- [x] Gameplay RNG is separated into named streams.
- [x] Structured event logging and deterministic runtime IDs exist.
- [x] UI tokens load and a fixture-gallery placeholder opens.
- [x] A documented command runs validation and tests.

## 2026-08-29 — Phase 1 basic playable slice

### Implemented flow

- Replaced the Phase 0 fixture gallery as the main scene with a production
  `GameRoot` flow controller.
- Added Main Menu with New Game, save-aware Continue, and Exit.
- Added PLANT-first Home Base using the approved Verdant Haven asset.
- Added click-to-harvest Bio Farm state and a first HQ upgrade that increases
  harvest yield.
- Added a PLANT Planet Select/Intel screen with one available encounter and a
  locked future destination.
- Added playable combat with a fixed ten-card starter deck, draw/hand/discard
  zones, three Energy per turn, target selection, visible enemy intents,
  damage, Shield, Hull healing, card draw, enemy phase, poison pressure,
  victory, and defeat.
- Added Combat Result with rewards and navigation back to Home or the map.

### Persistence and integration

- Added versioned profile serialization and verified temporary-file commit.
- Added autosave after New Game, harvest, HQ upgrade, and combat result.
- Added idempotent combat reward and production-cycle source IDs.
- Victory grants five Biomass, advances one production cycle, and marks the Bio
  Farm ready to harvest again.
- Base, Combat, Progression, and UI communicate through state/command/result
  boundaries; UI scripts do not resolve gameplay effects.

### UI parity work

- Reviewed Main Menu, Home, World Map, Combat, and Combat Result in the running
  HTML UI Lab before implementing their Godot equivalents.
- Imported approved reference assets and Pixelify Sans into the Godot project.
- Preserved the shared `960×540` logical viewport, primary hierarchy, faction
  palette, panel treatment, card hand, enemy formation, intent visibility, and
  result-modal structure.
- Captured all five Godot screens at exactly `960×540` in `tests/artifacts/`.
- Detailed parity status is recorded in `PARITY_PHASE1.md`.

### Verification

- Phase 0 regression runner: `18/18 PASS`.
- Phase 1 runner: `22/22 PASS`.
- Phase 1 production UI flow runner: `8/8 PASS`.
- Godot editor import completed successfully on `4.7.1.stable.official`.
- Main game smoke-run completed without parser or runtime errors.
- All Phase 1 screens rendered through Godot's OpenGL compatibility renderer.

### Deferred by design

- Deck/collection management.
- Processor queues, research, shipyard, and multi-building management.
- Relics, summons, modules, boss phases, and the full status vocabulary.
- Multi-stage expedition persistence, trade, boosters, and mastery.

### Phase 1 exit gate

- [x] New Game enters PLANT Home by default.
- [x] Bio Farm can be harvested by click and cannot be double-claimed.
- [x] HQ upgrade spends Biomass and improves harvest yield.
- [x] Player can select and launch the first PLANT encounter.
- [x] Combat is playable entirely through the Godot UI.
- [x] Damage, Shield, heal, draw, Energy, intent, victory, and defeat work.
- [x] Victory reward and production advancement are idempotent.
- [x] Save/load preserves the basic Base state.
- [x] Result returns to Home with updated resource/production state.
- [x] Godot reference renders follow the Web UI Lab hierarchy and styling.
