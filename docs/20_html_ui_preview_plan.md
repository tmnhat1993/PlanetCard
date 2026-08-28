# 20 — HTML UI Preview Plan

## 1. Objective

Xây toàn bộ UI vertical slice bằng HTML trước để:

- preview/tinh chỉnh nhanh trong browser,
- review tất cả screen và edge state từ một local server,
- khóa layout, hierarchy, token và interaction contract,
- tạo reference cho Godot implementation,
- tránh đưa gameplay logic hoặc shipping dependency vào Web prototype.

Web là **reference renderer**. Godot vẫn là production renderer.

## 2. Technical choice

Default stack:

- Vite dev/build server.
- React + TypeScript.
- CSS custom properties + CSS Grid/Flex.
- Không Tailwind/UI kit ở foundation để giữ token và Godot mapping rõ.
- Không Canvas cho UI; Canvas chỉ xem xét cho effect/background prototype thật sự cần thiết.
- Không Redux; fixture data + local component state + small preview context là đủ.
- Hash/deep-link route để mở trực tiếp một screen/fixture mà không cần backend.

Package versions được pin trong lockfile khi bootstrap. Không ghi version cứng trong spec.

## 3. Preview server experience

Một server duy nhất cung cấp `UI Lab`:

### Left navigation

- Foundations.
- Components.
- Combat.
- Deck/Collection.
- Home/Economy.
- Ship/Research.
- World/Expedition.
- Trade/Pack/Mastery.
- System states.

### Top toolbar

- Screen selector.
- Fixture selector.
- UI state selector.
- Logical viewport: 960×540 mặc định.
- Scale: 50%, 75%, 100%, 200%, Fit.
- Theme/faction context.
- Show safe area.
- Show layout grid/bounds.
- Reduced motion.
- Reset fixture overrides.
- Copy shareable URL.

### Preview canvas

- Luôn render trong logical frame 960×540.
- Browser window chỉ scale frame; không thay đổi layout reference.
- Có full-window mode để cảm nhận build thực tế.

### Inspector panel

- Fixture data read-only/raw view.
- Component state knobs cho visual testing.
- UI intent/event log.
- Token revision, fixture revision và screen status.

Example URL:

```text
http://localhost:5173/#/screens/combat?fixture=combat_stress&scale=fit
```

## 4. Proposed directory structure

```text
web_preview/
  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
  index.html
  README.md
  scripts/
    generate_tokens.mjs
    sync_assets.mjs
  src/
    main.tsx
    app/
      PreviewApp.tsx
      PreviewShell.tsx
      ScreenRegistry.ts
      PreviewContext.tsx
    generated/
      tokens.css
      asset_manifest.json
    foundations/
      reset.css
      typography.css
      layout.css
    components/
      foundation/
      combat/
      meta/
    screens/
      combat/
      deck_builder/
      collection/
      home/
      shipyard/
      research/
      world_map/
      planet_intel/
      expedition/
      rewards/
      trade/
      booster/
      mastery/
    fixtures/
      FixtureRegistry.ts
    utils/
    tests/
  public/generated-assets/
```

Shared authoritative inputs remain outside Web folder:

- `ui_spec/tokens.json`
- `ui_spec/components/`
- `ui_spec/screens/`
- `ui_spec/fixtures/`
- `assets/approved/`

Generated token CSS và copied preview assets không phải source of truth.

## 5. Commands

Planned commands:

```bash
cd web_preview
npm install
npm run dev
npm run dev:lan
npm run typecheck
npm run test
npm run build
npm run preview
npm run capture
```

- `dev`: localhost hot reload.
- `dev:lan`: bind host để preview trên thiết bị khác trong cùng mạng khi cần.
- `build`: production-static preview build.
- `preview`: serve build output.
- `capture`: Playwright screenshots sau khi visual baseline bắt đầu ổn định.

Không đưa PixelLab token/API call vào preview server.

## 6. Screen registry

Mỗi screen đăng ký:

```ts
type ScreenRegistration = {
  id: string;
  group: string;
  title: string;
  component: React.ComponentType<ScreenProps>;
  fixtureIds: string[];
  defaultFixtureId: string;
  status: "planned" | "greybox" | "review" | "approved";
  specPath: string;
};
```

Navigation được sinh từ registry, không hard-code nhiều danh sách screen khác nhau.

## 7. Fixture policy

Fixture là resolved view model, không phải gameplay simulation.

Allowed:

- resolved damage preview,
- current Hull/Shield/Energy,
- prepared Intent label/icon,
- already-rolled pack result,
- production job remaining cycles.

Not allowed:

- Web tự resolve card effect,
- Web tự roll pack/reward,
- Web tự tính enemy action,
- duplicate combat/economy formula bằng TypeScript.

Mỗi screen tối thiểu có:

- default,
- empty/minimal,
- stress/max expected,
- locked/disabled,
- invalid/error,
- long text/localization fixture nếu có text động.

## 8. Complete screen inventory

### A. Foundations/UI Lab

- Token palette/spacing/typography.
- Component gallery.
- Buttons, tabs, panels, modals, tooltip, progress, toast.
- Icon/status/relic/resource gallery.
- Loading, empty, locked, disabled, error states.

### B. Combat

- Combat default.
- Combat stress/crowded.
- Card selected/targeting.
- Invalid target/no Energy/locked card.
- Summon/module zones.
- Boss phase.
- Combat log expanded.
- Victory.
- Defeat.

### C. Deck and collection

- Deck Builder default.
- Over Mass capacity.
- Invalid/missing-owned-card deck.
- Filters/search.
- Card collection.
- Card detail/inspect.
- Relic loadout.

### D. Home and economy

- Home Planet overview.
- Building hotspot states.
- Mine/Extractor panel.
- Processor/production queue.
- Queue full/blocked inputs/completed job.
- Inventory/resource detail.
- Locked Trade Port.

### E. Ship and research

- Ship overview.
- Upgrade list/detail.
- Affordable/unaffordable/prerequisite states.
- Research overview.
- Research unlock confirmation/result.

### F. World and expedition

- World Map.
- Locked/unlocked/completed planet nodes.
- Planet Intel.
- Stage selection/progress.
- Expedition launch confirmation.
- Expedition between-stage summary.
- Reward screen.

### G. Trade, booster and mastery

- Trade market/license locked/unlocked.
- Export form/result.
- Booster shop.
- Pack opening/reveal/result.
- Duplicate → Knowledge state.
- Mastery track/tier unlock.
- Hybrid deck unlock feedback.

### H. System overlays

- Settings shell.
- Save/loading indicator.
- Confirm/cancel modal.
- Error recovery modal.
- Dev fixture/debug indicator.

Narrative dialogue, advanced planets và account/cloud UI không nằm trong vertical-slice preview scope.

## 9. Build phases

## UI-W0 — Bootstrap preview server

Scope:

- Vite/React/TypeScript project.
- Dev and LAN commands.
- Hash route/deep links.
- Preview shell with navigation/toolbar/canvas/inspector.
- Import `ui_spec/tokens.json` and generate CSS variables.
- Fixture registry.
- Approved asset sync placeholder.
- One placeholder screen.

Exit gate:

- One documented command starts server.
- URL opens from browser and hot reload works.
- Deep link survives refresh.
- 960×540 canvas scales Fit/100% correctly.
- Token change can be reflected without manual CSS duplication.

## UI-W1 — Foundation component gallery

Scope:

- Reset/layout/typography.
- Button, icon button, panel, tabs.
- Tooltip, modal, progress bar, resource counter, toast.
- State/focus/disabled examples.
- Component record links.

Exit gate:

- Foundation components cover all required states.
- Keyboard navigation visible.
- Long text and minimum/maximum values do not break gallery.

## UI-W2 — Combat family

Scope:

- Combat card.
- Enemy plate/Intent/status.
- Player HUD.
- Battlefield zones.
- Hand/targeting.
- Combat log.
- Victory/defeat.

Exit gate:

- Default and stress fixtures pass at 960×540.
- Targeting/cancel/disabled visual flow can be clicked through.
- No gameplay calculation exists in Web.
- Combat reference approved before Godot Combat UI implementation.

## UI-W3 — Deck/Collection family

Scope:

- Deck Builder three-column layout.
- Collection/filter.
- Deck Mass and validation messages.
- Computed preview.
- Relic loadout/card detail.

Exit gate:

- Valid, over-capacity and missing-owned-card fixtures readable.
- Add/remove/filter interactions can be previewed locally.

## UI-W4 — Home/Economy/Ship family

Scope:

- Home Planet.
- Building hotspots/panels.
- Production queue/inventory.
- Ship upgrade/research.

Exit gate:

- Produce → process → upgrade flow can be clicked using fixture transitions.
- Locked, insufficient-resource, queue-full and complete states covered.

## UI-W5 — World/Expedition family

Scope:

- World map.
- Planet node/progress.
- Intel/stage selection.
- Launch/return/reward.

Exit gate:

- Home → Map → Intel → Launch → Result → Home navigation demo works.

## UI-W6 — Trade/Pack/Mastery family

Scope:

- License states.
- Export/local currency.
- Booster shop/opening.
- Duplicate/Knowledge.
- Mastery/hybrid unlock.

Exit gate:

- Phase 8 product journey can be reviewed visually end-to-end.
- Skip/reveal animation does not alter prepared result fixture.

## UI-W7 — Review, edge states and visual regression

Scope:

- Complete screen matrix.
- Long text/stress fixtures.
- Keyboard/focus/reduced-motion pass.
- Cross-screen token cleanup.
- Playwright reference capture.
- Static production build.

Exit gate:

- All vertical-slice screens reachable from registry.
- Every approved screen has default + stress/error fixture as applicable.
- `typecheck`, tests and build pass.
- Screenshots reproducible at 960×540.

## UI-W8 — Godot handoff

For each approved component/screen:

- record Web selector/reference route,
- record Godot target `.tscn`,
- map CSS layout to Godot Containers,
- list tokens/assets/states,
- capture Web screenshot,
- create Godot fixture scene later,
- run parity checklist from `docs/16_web_godot_parity_workflow.md`.

Exit gate:

- Godot implementation can be built without reverse-engineering browser code.

## 10. Interaction prototype rules

Web may simulate navigation and UI state transitions:

- select card,
- enter/cancel target mode,
- open/close modal,
- move between prepared fixtures,
- add/remove deck card visually,
- queue prepared production job,
- reveal prepared pack result.

These transitions are presentation prototypes. Domain outcomes remain fixture-driven.

Every interactive action may emit a debug UI intent:

```text
REQUEST_PLAY_CARD
REQUEST_END_TURN
REQUEST_ADD_CARD
REQUEST_QUEUE_PRODUCTION
REQUEST_LAUNCH_EXPEDITION
REQUEST_OPEN_PACK
```

This intent list later maps to Godot signals/commands.

## 11. Asset workflow in preview

- Source asset remains `assets/approved` or approved review candidate.
- `sync_assets` copies only declared files into generated preview assets.
- Missing asset renders labeled placeholder with expected ID/size.
- CSS background/image does not encode gameplay text.
- Panel/card/button frames must support nine-slice-equivalent dimensions.
- Preview supports toggling placeholder vs approved art when useful.

## 12. Quality checks

Required from UI-W0:

- TypeScript typecheck.
- Production build.
- Fixture/schema sanity.

Add after UI-W2 stabilizes:

- Component interaction tests.
- Playwright navigation/screenshot tests.
- Overflow assertions where practical.
- Broken/missing asset check.

Manual review checklist:

- hierarchy readable in five seconds,
- intent/status never hidden behind hover,
- no important state conveyed by color only,
- no clipped dynamic text,
- no required interaction smaller than token target,
- screen remains readable at Fit and 2× display,
- keyboard focus path is logical.

## 13. Definition of Done for an HTML screen

- Registered and deep-linkable.
- Default and edge fixtures exist.
- Uses shared tokens; no unexplained magic color/spacing.
- No gameplay calculation duplicated.
- Keyboard/focus path works for interactive elements.
- Fits 960×540 reference frame.
- Approved asset IDs or explicit placeholders only.
- UI intent log identifies interactions.
- Screen record/status updated.
- Ready for Godot mapping.

## 14. Recommended immediate execution

Start only UI-W0 and UI-W1 first. Then build Combat family before Home/Base screens because Combat establishes the densest component requirements: cards, intent, status, tooltips, targeting, logs and event presentation.

After Combat default + stress layouts are approved, reuse the same tokens/components for Deck Builder and Base Builder instead of styling all screen families in parallel.
