# Master Prompt for Codex

Read `CODEX_START_HERE.md` and all documents it references before changing code.

Implement the project phase-by-phase. The current target is the earliest incomplete phase under `/tasks`.

Non-negotiable constraints:
- Godot 4.x + typed GDScript.
- Data-driven cards, enemies, relics, statuses, encounters, buildings and planets.
- Deck Mass is separate from combat Energy.
- Multi-enemy combat is a Phase 0 requirement.
- Card, enemy action, relic, passive and field effects share an EffectResolver vocabulary.
- Do not create one script per card/enemy action unless behavior genuinely cannot be expressed by reusable effects + conditions.
- Keep gameplay logic out of presentation/UI nodes.
- Runtime state must not mutate shared static Resources.
- RNG must be seedable; same seed + same actions must reproduce combat.
- Add content validation and useful debug logging.
- Build minimal fixtures before large content sets.
- Do not expand beyond STONE + PLANT before Phase 2 exit criteria pass.
- Do not replace approved art assets.
- For PixelLab API changes, read current https://api.pixellab.ai/v2/llms.txt and OpenAPI first.

For every implementation task:
1. State the acceptance criteria.
2. Implement the smallest reusable system.
3. Add a deterministic debug/test scenario.
4. Connect minimal UI.
5. Report files changed and unresolved risks.

Avoid architecture astronautics. Prefer small reusable systems validated by gameplay.
