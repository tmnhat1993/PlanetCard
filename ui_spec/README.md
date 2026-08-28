# UI Spec

Shared contract cho Web reference và Godot production UI.

## Contents

- `tokens.json`: canonical dimensions/colors/timing hypotheses.
- `components/`: component records và state requirements.
- `screens/`: screen hierarchy/behavior specs.
- `fixtures/`: resolved display data, không chứa gameplay logic.
- `parity/`: screenshot review records khi implementation bắt đầu.

## Rules

- Reference logical resolution là 960×540.
- Token change phải được review ở Web và Godot.
- Fixture values đã được resolve; Web preview không reimplement combat formulas.
- Generated art không chứa shipping text.
- Godot là production renderer; Web là design/reference renderer.

Version hiện tại: `ui_spec_version: 1`.
