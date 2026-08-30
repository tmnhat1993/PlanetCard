# Planet Deckbuilder — Godot Project

Godot 4.x production project. This directory starts Phase 0 independently from
the HTML UI Lab; the Web preview remains the reference renderer and is not a
runtime dependency.

## Open in Godot

Use Godot `4.7.1` or a compatible Godot 4.x build:

```bash
/Applications/Godot.app/Contents/MacOS/Godot --editor --path godot_project
```

The main scene opens a development-only fixture gallery at the shared logical
resolution of `960×540`.

## Run Phase 0 verification

From `planet_deckbuilder_codex_handoff/`:

```bash
/Applications/Godot.app/Contents/MacOS/Godot \
  --headless \
  --path godot_project \
  --script res://tests/phase0_test_runner.gd
```

The runner verifies:

- JSON fixtures convert to typed runtime `Resource` objects;
- duplicate IDs and missing references fail validation;
- named RNG streams are deterministic and isolated;
- the same seed/content creates the same initial state;
- runtime IDs and structured events behave predictably.

## Current boundary

Phase 1 now includes a small playable loop:

`Main Menu → PLANT Home → harvest/upgrade → Planet Select → Combat → Result → Home`

Management, Deck Builder, research, processor queues, trade, boosters, and
mastery remain intentionally outside this milestone.

Canonical content remains JSON. Shared UI tokens are copied from
`../ui_spec/tokens.json`; until token generation is automated, token changes
must update both files in the same change.

## Run Phase 1 verification

```bash
/Applications/Godot.app/Contents/MacOS/Godot \
  --headless \
  --path godot_project \
  --script res://tests/phase1_test_runner.gd
```

The Phase 1 runner covers the Base loop, save round trip, combat determinism,
damage/shield/heal/draw effects, visible intent, victory/defeat, production
advance, and idempotent reward application.

The production scene-flow smoke runner is separate:

```bash
/Applications/Godot.app/Contents/MacOS/Godot \
  --headless \
  --path godot_project \
  --script res://tests/phase1_ui_flow_runner.gd
```

Godot reference captures are stored in `tests/artifacts/` at `960×540`.
