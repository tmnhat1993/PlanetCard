import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const htmlPath = new URL("../index.html", import.meta.url);
const cssPath = new URL("../app/globals.css", import.meta.url);

test("declares all vertical-slice wireframes and quick navigation", async () => {
  const [page, html] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(htmlPath, "utf8"),
  ]);

  assert.match(html, /Planet Deckbuilder · UI Wireframe Lab/);
  assert.match(page, /QUICK NAVIGATOR/);
  assert.match(page, /metaKey \|\| event\.ctrlKey/);

  const ids = [
    "start", "overview", "combat", "combat-result", "deck-builder", "collection",
    "home", "production", "shipyard", "research", "world-map",
    "planet-intel", "expedition", "trade", "booster", "mastery",
  ];

  for (const id of ids) {
    assert.match(page, new RegExp(`id: \\\"${id}\\\"`));
  }
});

test("includes a reusable card builder with local library, outcome preview, and JSON export", async () => {
  const [page, builder, model, repository, outcome, presets, artLibrary, guideline] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(new URL("../app/card-builder/CardBuilderScreen.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/card-builder/model.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/card-builder/repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/card-builder/outcome.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/card-builder/presets.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/card-builder/artLibrary.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/docs/card-art-guideline.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /#\/tools\/card-builder/);
  assert.doesNotMatch(page, /id: "card-builder"/);
  assert.match(page, /card-builder-tool/);
  assert.match(builder, /CARD BUILDER UTILS/);
  assert.match(builder, /EXPORT LIBRARY/);
  assert.match(builder, /ATTRIBUTE STAMPS/);
  assert.match(model, /validateCardDraft/);
  assert.match(repository, /window\.localStorage/);
  assert.match(repository, /fileToCardArt/);
  assert.match(repository, /renderStarterCardPng/);
  assert.match(presets, /BASALT BREAKER/);
  assert.match(presets, /VERDANT RITUAL/);
  assert.match(presets, /CRYSTAL HEART/);
  assert.match(builder, /rarity_star_v01\.png/);
  assert.match(model, /system_stone_v01\.png/);
  assert.match(model, /type_action_v01\.png/);
  assert.match(builder, /ICON ASSET CATALOG/);
  assert.match(builder, /saveCardDraft\(presetToDraft\(starter\)\)/);
  assert.match(builder, /EXPORT PNG/);
  assert.match(builder, /OUTCOME AMPLIFICATION/);
  assert.match(builder, /SHIP AMPLIFICATION/);
  assert.match(builder, /SYSTEM COMPATIBLE/);
  assert.match(builder, /live-card__laminate/);
  assert.match(builder, /laminate--\$\{draft\.stars\}/);
  assert.match(builder, /laminate--\$\{card\.stars\}/);
  assert.match(builder, /live-card__icon-bridge/);
  assert.match(builder, /OCCUPIES DRAW SLOT/);
  assert.match(builder, /Search cards/);
  assert.match(builder, /Filter by system/);
  assert.match(builder, /Filter by stars/);
  assert.match(builder, /Filter by type/);
  assert.match(builder, /RARITY SORT/);
  assert.match(builder, /b\.stars - a\.stars/);
  assert.match(builder, /LIBRARY_PAGE_SIZE = 5/);
  assert.match(builder, /CATALOG_PAGE_SIZE = 8/);
  assert.match(builder, /function Pagination/);
  assert.match(builder, /outcome\.bonusPercent/);
  assert.doesNotMatch(builder, /live-card__outcome/);
  assert.doesNotMatch(builder, /asset-card__content"><small/);
  assert.match(model, /primary_outcome/);
  assert.match(outcome, /bonusPercent = shipAmplification \* cardCoefficient/);
  assert.match(outcome, /Math\.floor\(base \* bonusPercent \/ 100\)/);
  assert.match(model, /RETAIN_IN_HAND/);
  assert.match(model, /occupies_draw_slot/);
  assert.match(presets, /plant_guardian_seed/);
  assert.match(presets, /stone_sentinel/);
  assert.match(presets, /PLANT 1★/);
  assert.match(presets, /STONE 1★/);
  assert.equal((presets.match(/set: "PLANT 1★"/g) ?? []).length, 7);
  assert.equal((presets.match(/set: "STONE 1★"/g) ?? []).length, 7);
  assert.equal((presets.match(/set: "PLANT 2★"/g) ?? []).length, 7);
  assert.equal((presets.match(/set: "STONE 2★"/g) ?? []).length, 7);
  assert.equal((presets.match(/set: "PLANT 3★"/g) ?? []).length, 7);
  assert.equal((presets.match(/set: "STONE 3★"/g) ?? []).length, 7);
  assert.equal((presets.match(/set: "PLANT 4★"/g) ?? []).length, 7);
  assert.equal((presets.match(/set: "STONE 4★"/g) ?? []).length, 7);
  assert.match(builder, /ARTWORK PACK/);
  assert.match(builder, /USE IN BUILDER/);
  assert.match(builder, /Search artwork/);
  assert.match(artLibrary, /export const ART_LIBRARY/);
  assert.match(artLibrary, /plant_eclipse_orchid/);
  assert.match(artLibrary, /stone_singularity_core/);
  assert.match(guideline, /Thang độ phức tạp theo sao/);
  const artFiles = await readdir(new URL("../public/assets/cards/art_library", import.meta.url), { recursive: true });
  assert.equal(artFiles.filter((file) => file.endsWith(".png")).length, 48);

  const artworkIds = [
    "plant_thorn_snap", "plant_sap_leech", "plant_bloom_mend", "plant_barkskin", "plant_regrowth_cycle", "plant_solar_bloom", "plant_guardian_seed",
    "stone_meteor_fang", "stone_crushing_aegis", "stone_basalt_bulwark", "stone_orbiting_plate", "stone_crystal_reinforce", "stone_geothermal_core", "stone_sentinel",
  ];
  await Promise.all(artworkIds.map((id) => access(new URL(`../public/assets/cards/sets/${id.startsWith("plant_") ? "plant_one_star" : "stone_one_star"}/${id}_art_v03.png`, import.meta.url))));

  const twoStarArtworkIds = [
    "plant_thorn_volley", "plant_siphon_bloom", "plant_spore_cleanse", "plant_canopy_ward", "plant_germination_loop", "plant_photosynthetic_surge", "plant_symbiotic_guard",
    "stone_asteroid_barrage", "stone_seismic_rebound", "stone_faultline_crush", "stone_fortress_mantle", "stone_tectonic_bastion", "stone_core_compression", "stone_aegis_monolith",
  ];
  await Promise.all(twoStarArtworkIds.map((id) => access(new URL(`../public/assets/cards/sets/${id.startsWith("plant_") ? "plant_two_star" : "stone_two_star"}/${id}_art_v01.png`, import.meta.url))));
});

test("includes an animated start screen with the three main menu actions", async () => {
  const [page, css] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);

  assert.match(page, /function StartScreen/);
  assert.match(page, />NEW GAME</);
  assert.match(page, />CONTINUE</);
  assert.match(page, />EXIT</);
  assert.match(page, /start_title_logo_v01\.png/);
  assert.match(page, /start_space_flyby_bg_v01\.png/);
  assert.match(css, /@keyframes space-drift/);
  assert.match(css, /@keyframes star-flight/);
});

test("uses two pixel-art ground base layouts with complete building navigation", async () => {
  const [page, css] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);

  assert.match(page, /home_plant_base_v01\.png/);
  assert.match(page, /home_stone_base_v01\.png/);
  assert.match(page, /BIO FARM/);
  assert.match(page, /ORE MINE/);
  assert.match(page, /TECH GARDEN/);
  assert.match(page, /CRYSTAL LAB/);
  assert.match(page, /ARSENAL/);
  assert.match(page, /SHIPYARD/);
  assert.match(page, /BASE LEVEL/);
  assert.match(page, /UNIVERSE MAP/);
  assert.match(page, /id: "deck-builder"/);
  assert.match(page, /id: "overview"/);
  assert.match(css, /\.home-base-screen/);
  assert.match(css, /image-rendering:pixelated/);
  await Promise.all([
    access(new URL("../public/assets/home/home_plant_base_v01.png", import.meta.url)),
    access(new URL("../public/assets/home/home_stone_base_v01.png", import.meta.url)),
  ]);
});

test("uses an asset-driven planet carousel for the overview", async () => {
  const [page, css] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);

  assert.match(page, /function OverviewScreen/);
  assert.match(page, /VERDANT PRIME/);
  assert.match(page, /BASALT CROWN/);
  assert.match(page, /VEILED MOON/);
  assert.match(page, /CARDS UNLOCKED/);
  assert.match(page, /Previous planet/);
  assert.match(page, /Next planet/);
  assert.doesNotMatch(page, /From stone economy/);
  assert.match(css, /\.planet-overview-screen/);
  assert.match(page, /WORLD_JUMP_STARTED/);
  assert.match(page, /WORLD_ARRIVED/);
  assert.match(page, /phase-\$\{transitionPhase\}/);
  assert.match(page, /planet-overview-warp/);
  assert.match(css, /@keyframes planet-jump-depart/);
  assert.match(css, /@keyframes planet-jump-arrive/);
  assert.match(css, /font-family:"Pixelify Sans"/);
  assert.match(css, /\.game-viewport \*\{font-family:var\(--game-pixel-font\)!important\}/);
  assert.match(css, /Pixel UI construction for the Overview screen/);
  await access(new URL("../public/assets/fonts/pixelify-sans/PixelifySans-Variable.ttf", import.meta.url));
  await access(new URL("../public/assets/fonts/pixelify-sans/OFL.txt", import.meta.url));
  const assets = [
    "overview_plant_space_bg_v03.png", "overview_stone_space_bg_v03.png", "overview_veiled_space_bg_v03.png",
    "overview_plant_planet_fg_v03.png", "overview_stone_planet_fg_v03.png", "overview_veiled_planet_fg_v03.png",
  ];
  assert.match(page, /size: "is-major"/);
  assert.match(page, /size: "is-medium"/);
  assert.match(page, /size: "is-dwarf"/);
  assert.match(css, /\.planet-overview-planet\.is-major\{--planet-display-scale:\.7\}/);
  assert.match(css, /\.planet-overview-planet\.is-medium\{--planet-display-scale:\.54\}/);
  assert.match(css, /\.planet-overview-planet\.is-dwarf\{--planet-display-scale:\.41\}/);
  await Promise.all(assets.map((asset) => access(new URL(`../public/assets/overview/${asset}`, import.meta.url))));
});

test("keeps the Godot reference viewport fixed and debug controls outside it", async () => {
  const [page, css] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);

  assert.match(page, /width: 960/);
  assert.match(page, /height: 540/);
  assert.match(page, /ratio: "16:9"/);
  assert.match(page, /className="game-viewport"/);
  assert.match(page, /preview-bar debug-layer/);
  assert.match(page, /screen-rail debug-layer/);
  assert.match(css, /\.game-viewport \{[^}]*width: 960px;[^}]*height: 540px;[^}]*aspect-ratio: 16 \/ 9;[^}]*contain: strict;/);
  assert.match(css, /--utility-font:Inter/);
  assert.match(css, /\.screen-rail\{width:220px/);
  assert.match(css, /\.preview-workspace\{margin-left:220px;margin-right:0/);
  assert.match(css, /\.stage-scroller\{display:flex;justify-content:center\}/);
  assert.match(css, /writing-mode:horizontal-tb/);
  assert.match(page, /<small>\{screen\.title\}<\/small>/);
  assert.match(page, /const \[scale, setScale\] = useState\(1\)/);
});

test("renders combat as one continuous battlefield with readable essential HUD", async () => {
  const [page, css] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);

  assert.match(page, /OVERGROWN BASIN/);
  assert.match(page, /combat-relic-rail/);
  assert.match(page, /enemy-status/);
  assert.match(page, /combat-hand-cards/);
  assert.match(page, /Meteor Fang/);
  assert.match(page, /Guardian Seed/);
  assert.doesNotMatch(page, />DRAW </);
  assert.doesNotMatch(page, />DISCARD </);
  assert.match(page, /plant_dummy_enemy_v01\.png/);
  assert.match(page, /stone_battleship_v01\.png/);
  assert.match(page, /SUMMON_SLOT_SELECTED/);
  assert.match(css, /overgrown_basin_bg_v01\.png/);
  assert.match(css, /Combat V2: one continuous illustrated battlefield/);
  assert.match(css, /\.combat-map-title\{[^}]*left:50%/);
  assert.match(css, /\.combat-relic-rail>button:hover>span/);
});

test("keeps combat result compact over the battlefield with progression rewards", async () => {
  const [page, css] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);

  assert.doesNotMatch(page, /EXP EARNED/);
  assert.match(page, />SHARD<strong>\+12/);
  assert.match(page, /ENEMIES DEFEATED/);
  assert.match(page, /icon-sporeling/);
  assert.match(page, /icon-vine-warden/);
  assert.match(page, /icon-thornmaw/);
  assert.match(page, /RESOURCES ACQUIRED/);
  assert.match(page, /RETURN TO MAP/);
  assert.match(page, /!isFinalBattle && <Button tone="primary"/);
  assert.match(css, /\.combat-result-background\{[^}]*filter:blur\(7px\)/);
  assert.match(css, /\.combat-result-popup\{[^}]*width:650px/);
  await access(new URL("../public/assets/icons/combat_result_icon_atlas_v01.png", import.meta.url));
});
