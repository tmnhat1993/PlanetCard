"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CardBuilderScreen from "./card-builder/CardBuilderScreen";

type ScreenId =
  | "start"
  | "overview"
  | "combat"
  | "combat-result"
  | "deck-builder"
  | "collection"
  | "home"
  | "production"
  | "shipyard"
  | "research"
  | "world-map"
  | "planet-intel"
  | "expedition"
  | "trade"
  | "booster"
  | "mastery";

type ScreenDefinition = {
  id: ScreenId;
  group: string;
  title: string;
  eyebrow: string;
  shortcut: string;
  description: string;
};

type ScreenProps = {
  navigate: (id: ScreenId) => void;
  emit: (message: string) => void;
};

const SCREENS: ScreenDefinition[] = [
  { id: "start", group: "System", title: "Start Screen", eyebrow: "MAIN MENU", shortcut: "01", description: "Main menu và planetary flight background." },
  { id: "overview", group: "System", title: "UI Overview", eyebrow: "UI LAB", shortcut: "02", description: "Bản đồ toàn bộ luồng và trạng thái thiết kế." },
  { id: "combat", group: "Combat", title: "Combat", eyebrow: "PLANT · STAGE 02", shortcut: "03", description: "Formation, intent, status, hand và targeting." },
  { id: "combat-result", group: "Combat", title: "Combat Result", eyebrow: "EXPEDITION RESULT", shortcut: "04", description: "Victory, reward và Hull còn lại." },
  { id: "deck-builder", group: "Deck", title: "Deck Builder", eyebrow: "LOADOUT", shortcut: "05", description: "Collection, Mass capacity và computed output." },
  { id: "collection", group: "Deck", title: "Card Collection", eyebrow: "ARCHIVE", shortcut: "06", description: "Card library, filters và card detail." },
  { id: "home", group: "Home", title: "Home Base", eyebrow: "PLANT / STONE COLONY", shortcut: "07", description: "Căn cứ mặt đất, công trình kinh tế và nâng cấp." },
  { id: "production", group: "Home", title: "Production", eyebrow: "STONE PROCESSOR", shortcut: "08", description: "Recipe, queue, cycle và inventory." },
  { id: "shipyard", group: "Home", title: "Shipyard", eyebrow: "BATTLESHIP", shortcut: "09", description: "Ship stats, upgrade và prerequisite." },
  { id: "research", group: "Home", title: "Research", eyebrow: "STONE RESEARCH", shortcut: "10", description: "Research nodes và card unlock." },
  { id: "world-map", group: "Expedition", title: "World Map", eyebrow: "PLANETARY CHAIN", shortcut: "11", description: "Planet progression, locks và mastery." },
  { id: "planet-intel", group: "Expedition", title: "Planet Intel", eyebrow: "PLANT CAMPAIGN", shortcut: "12", description: "Threats, formation và counter guidance." },
  { id: "expedition", group: "Expedition", title: "Expedition", eyebrow: "RUN STATUS", shortcut: "13", description: "Stage sequence, Hull persistence và salvage." },
  { id: "trade", group: "Progression", title: "Trade Market", eyebrow: "PLANT TRADE LICENSE", shortcut: "14", description: "Export goods và local currency." },
  { id: "booster", group: "Progression", title: "Booster Pack", eyebrow: "VERDANT ARCHIVE", shortcut: "15", description: "Pack purchase, reveal và duplicate Knowledge." },
  { id: "mastery", group: "Progression", title: "Planet Mastery", eyebrow: "PLANT MASTERY", shortcut: "16", description: "Tier progress, rewards và hybrid unlock." },
];

const screenById = Object.fromEntries(SCREENS.map((screen) => [screen.id, screen])) as Record<ScreenId, ScreenDefinition>;

const GAME_VIEWPORT = {
  width: 960,
  height: 540,
  ratio: "16:9",
} as const;

function Panel({ title, eyebrow, action, className = "", children }: { title?: string; eyebrow?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {(title || eyebrow || action) && (
        <header className="panel__header">
          <div><span>{eyebrow}</span>{title && <h3>{title}</h3>}</div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

function Button({ children, tone = "default", onClick, disabled = false }: { children: React.ReactNode; tone?: "default" | "primary" | "danger" | "ghost"; onClick?: () => void; disabled?: boolean }) {
  return <button type="button" className={`button button--${tone}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Progress({ value, tone = "gold" }: { value: number; tone?: "gold" | "green" | "blue" | "red" }) {
  return <span className={`progress progress--${tone}`}><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></span>;
}

function Stat({ icon, label, value, detail }: { icon: string; label: string; value: string; detail?: string }) {
  return <div className="stat"><b>{icon}</b><span>{label}<strong>{value}</strong>{detail && <small>{detail}</small>}</span></div>;
}

function Resource({ icon, name, amount, accent = "stone" }: { icon: string; name: string; amount: string; accent?: "stone" | "plant" | "gold" }) {
  return <div className={`resource resource--${accent}`}><b>{icon}</b><span>{name}<strong>{amount}</strong></span></div>;
}

const cardData = [
  { name: "Meteor Fang", cost: 1, type: "ACTION", text: "Deal 3 damage.", tag: "STONE", tone: "stone", stars: 1, art: "/assets/cards/sets/stone_one_star/stone_meteor_fang_art_v03.png" },
  { name: "Basalt Bulwark", cost: 1, type: "BUFF", text: "Gain 2 defence.", tag: "STONE", tone: "stone", stars: 1, art: "/assets/cards/sets/stone_one_star/stone_basalt_bulwark_art_v03.png" },
  { name: "Thorn Snap", cost: 1, type: "ACTION", text: "Deal 3 damage.", tag: "PLANT", tone: "plant", stars: 1, art: "/assets/cards/sets/plant_one_star/plant_thorn_snap_art_v03.png" },
  { name: "Bloom Mend", cost: 1, type: "ACTION", text: "Restore 3 hull.", tag: "PLANT", tone: "plant", stars: 1, art: "/assets/cards/sets/plant_one_star/plant_bloom_mend_art_v03.png" },
  { name: "Guardian Seed", cost: 1, type: "PASSIVE", text: "Held: gain defence.", tag: "PLANT", tone: "plant", stars: 1, art: "/assets/cards/sets/plant_one_star/plant_guardian_seed_art_v03.png" },
];

function GameCard({ card, compact = false, selected = false, onClick }: { card: typeof cardData[number]; compact?: boolean; selected?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={`game-card game-card--${card.tone} ${compact ? "game-card--compact" : ""} ${selected ? "is-selected" : ""}`} onClick={onClick}>
      <span className="game-card__cost">{card.cost}</span>
      <span className="game-card__name">{card.name}</span>
      <span className="game-card__art"><img src={card.art} alt="" /></span>
      <span className="game-card__type">{card.type}</span>
      <span className="game-card__text">{card.text}</span>
      <span className="game-card__tag"><b>{"★".repeat(card.stars)}</b>{card.tag}</span>
    </button>
  );
}

function CombatCard({ card, selected = false, onClick }: { card: typeof cardData[number]; selected?: boolean; onClick?: () => void }) {
  const visualType = card.type === "PASSIVE" ? "passive" : card.type === "BUFF" ? "magic" : "action";
  return (
    <button type="button" className={`combat-card combat-card--${visualType} combat-card--${card.tone} ${selected ? "is-selected" : ""}`} onClick={onClick}>
      <span className="combat-card__cost">{card.cost}</span>
      <span className="combat-card__stars">{Array.from({ length: card.stars }, (_, index) => <img src="/assets/cards/ui/rarity_star_v01.png" alt="" key={index} />)}</span>
      <span className="combat-card__art"><img src={card.art} alt="" /></span>
      <span className="combat-card__icons" aria-label={`${card.tag} ${card.type}`}>
        <i><img src={`/assets/cards/icons/system_${card.tone}_v01.png`} alt="" /></i>
        <i><img src={`/assets/cards/icons/type_${visualType}_v01.png`} alt="" /></i>
      </span>
      <span className="combat-card__content"><strong>{card.name}</strong></span>
      <span className={`combat-card__laminate laminate--${card.stars}`} aria-hidden="true" />
    </button>
  );
}

function ScreenFrame({ title, eyebrow, children, right }: { title: string; eyebrow: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="game-screen">
      <header className="game-screen__header">
        <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
        <div className="game-screen__right">{right}</div>
      </header>
      <div className="game-screen__body">{children}</div>
    </div>
  );
}

function StartScreen({ navigate, emit }: ScreenProps) {
  return (
    <div className="start-screen">
      <div className="start-space" aria-hidden="true">
        <img className="start-space__art" src="/assets/start/start_space_flyby_bg_v01.png" alt="" />
        <span className="star-stream star-stream--near" />
        <span className="star-stream star-stream--far" />
      </div>
      <header className="start-title">
        <span>EXPLORE · BUILD · CONQUER</span>
        <img className="start-title__logo" src="/assets/start/start_title_logo_v01.png" alt="Planet Deckbuilder" />
        <p>A deckbuilding voyage across living worlds.</p>
      </header>
      <nav className="start-menu" aria-label="Main menu">
        <button type="button" className="is-primary" onClick={() => { emit("REQUEST_NEW_GAME"); navigate("home"); }}><span>01</span><b>NEW GAME</b><i>→</i></button>
        <button type="button" onClick={() => { emit("REQUEST_CONTINUE_GAME"); navigate("home"); }}><span>02</span><b>CONTINUE</b><i>→</i></button>
        <button type="button" onClick={() => emit("REQUEST_EXIT_GAME · GODOT QUIT")}><span>03</span><b>EXIT</b><i>×</i></button>
      </nav>
      <footer className="start-footer"><span>BUILD 0.1 · VERTICAL SLICE</span><b>◈</b><span>PRESS ANY MENU OPTION</span></footer>
    </div>
  );
}

function OverviewScreen({ emit }: ScreenProps) {
  const worlds = [
    { id: "verdant-prime", name: "VERDANT PRIME", system: "PLANT HOMEWORLD", size: "is-major", background: "/assets/overview/overview_plant_space_bg_v03.png", planet: "/assets/overview/overview_plant_planet_fg_v03.png", cleared: true, unlockedCards: 18, status: "HOME WORLD" },
    { id: "basalt-crown", name: "BASALT CROWN", system: "STONE TERRITORY", size: "is-medium", background: "/assets/overview/overview_stone_space_bg_v03.png", planet: "/assets/overview/overview_stone_planet_fg_v03.png", cleared: true, unlockedCards: 12, status: "CONQUERED" },
    { id: "veiled-moon", name: "VEILED MOON", system: "UNKNOWN TERRITORY", size: "is-dwarf", background: "/assets/overview/overview_veiled_space_bg_v03.png", planet: "/assets/overview/overview_veiled_planet_fg_v03.png", cleared: false, stage: 3, totalStages: 5, status: "IN PROGRESS" },
  ];
  const [worldIndex, setWorldIndex] = useState(0);
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "depart" | "arrive">("idle");
  const world = worlds[worldIndex];
  const selectWorld = (direction: -1 | 1) => {
    if (transitionPhase !== "idle") return;
    const next = (worldIndex + direction + worlds.length) % worlds.length;
    setTransitionPhase("depart");
    emit(`WORLD_JUMP_STARTED · ${worlds[next].id}`);
    window.setTimeout(() => {
      setWorldIndex(next);
      setTransitionPhase("arrive");
      emit(`WORLD_ARRIVED · ${worlds[next].id}`);
    }, 320);
    window.setTimeout(() => setTransitionPhase("idle"), 850);
  };
  return (
    <div className={`planet-overview-screen phase-${transitionPhase} ${world.cleared ? "is-cleared" : "is-locked"}`}>
      <img className="planet-overview-bg" src={world.background} alt="" key={world.background} />
      <img className={`planet-overview-planet ${world.size}`} src={world.planet} alt={`${world.name} planet system`} key={world.planet} />
      <div className="planet-overview-warp" aria-hidden="true"><i /><i /><span /></div>
      <div className="planet-overview-shade" aria-hidden="true" />
      <div className="planet-overview-counter">WORLD {String(worldIndex + 1).padStart(2, "0")} / {String(worlds.length).padStart(2, "0")}</div>
      <button type="button" disabled={transitionPhase !== "idle"} className="planet-overview-arrow is-prev" aria-label="Previous planet" onClick={() => selectWorld(-1)}><span>←</span><small>PREV</small></button>
      <button type="button" disabled={transitionPhase !== "idle"} className="planet-overview-arrow is-next" aria-label="Next planet" onClick={() => selectWorld(1)}><span>→</span><small>NEXT</small></button>
      <section className="planet-overview-status" aria-live="polite">
        <div><span>{world.system}</span><h2>{world.name}</h2></div>
        {world.cleared ? <div className="planet-world-result is-clear"><small>{world.status}</small><strong>{world.unlockedCards}</strong><span>CARDS UNLOCKED</span></div> : <div className="planet-world-result is-progress"><small>{world.status}</small><strong>STAGE {String(world.stage).padStart(2, "0")}</strong><span>OF {String(world.totalStages).padStart(2, "0")}</span></div>}
      </section>
    </div>
  );
}

function CombatScreen({ emit }: ScreenProps) {
  const [selected, setSelected] = useState(0);
  const enemies = [
    { name: "Sporeling", hp: 12, maxHp: 18, status: "☣", statusLabel: "Poison: loses hull each turn", tone: "purple", scale: "small" },
    { name: "Vine Warden", hp: 31, maxHp: 36, status: "◆", statusLabel: "Guard: protects its allies", tone: "green", scale: "large" },
    { name: "Thornmaw", hp: 18, maxHp: 24, status: "⚔", statusLabel: "Attack: preparing 6 damage", tone: "red", scale: "small" },
  ];
  return (
    <div className="combat-screen">
      <header className="combat-map-title"><span>PLANT · STAGE 02 · TURN 4</span><h2>OVERGROWN BASIN</h2></header>
      <div className="combat-ship-vitals" aria-label="Ship vitals"><span>♥ <b>84 / 100</b></span><span>◇ <b>12 SHIELD</b></span></div>
      <section className="combat-battlefield" aria-label="Battlefield">
        <div className="enemy-row" aria-label="Enemy formation">
          {enemies.map((enemy, index) => (
            <button type="button" className={`enemy enemy--${enemy.scale} enemy--position-${index + 1}`} key={enemy.name} onClick={() => emit(`TARGET_SELECTED · ${enemy.name}`)}>
              <span className={`enemy-status intent--${enemy.tone}`} title={enemy.statusLabel} aria-label={enemy.statusLabel}>{enemy.status}</span>
              <img src="/assets/combat/plant_dummy_enemy_v01.png" alt="Plant faction enemy" />
              <span className="enemy-vitals"><strong>{enemy.name}</strong><em>♥ {enemy.hp} / {enemy.maxHp}</em></span>
            </button>
          ))}
        </div>
        <div className="player-ship" aria-label="Allied battleship">
          <img src="/assets/combat/stone_battleship_v01.png" alt="Stone faction allied battleship" />
        </div>
        <div className="combat-summon-slots" aria-label="Summon slots">
          <button type="button" onClick={() => emit("SUMMON_SLOT_SELECTED · 01")}><b>ORE DRONE</b><span>♥ 9</span></button>
          <button type="button" aria-label="Empty summon slot 2" onClick={() => emit("SUMMON_SLOT_SELECTED · 02")}>+</button>
          <button type="button" aria-label="Empty summon slot 3" onClick={() => emit("SUMMON_SLOT_SELECTED · 03")}>+</button>
        </div>
      </section>
      <aside className="combat-relic-rail" aria-label="Ship relics">
        <button type="button"><b>◆</b><span><strong>Stoneheart Reactor</strong>First defence card each turn gains +2.</span></button>
        <button type="button"><b>◇</b><span><strong>Emergency Seal</strong>At low hull, gain 8 shield once.</span></button>
      </aside>
      <div className="hand-row">
        <div className="energy-orb"><small>ENERGY</small><strong>2 <span>/ 3</span></strong></div>
        <div className="combat-hand-cards">
          {cardData.map((card, index) => <CombatCard key={card.name} card={card} selected={selected === index} onClick={() => { setSelected(index); emit(`REQUEST_SELECT_CARD · ${card.name}`); }} />)}
        </div>
        <Button tone="primary" onClick={() => emit("REQUEST_END_TURN")}>END TURN</Button>
      </div>
    </div>
  );
}

function CombatResultScreen({ navigate }: ScreenProps) {
  const battle = { stage: 2, totalStages: 5, turns: 5, enemiesDefeated: 3, hullRemaining: 84 };
  const isFinalBattle = battle.stage === battle.totalStages;
  return (
    <div className="combat-result-screen">
      <div className="combat-result-background" aria-hidden="true" />
      <section className="combat-result-popup" aria-label="Battle result">
        <header><span>STAGE {String(battle.stage).padStart(2, "0")} CLEAR</span><h1>VICTORY</h1><p>{battle.turns} TURNS · HULL REMAINING {battle.hullRemaining}</p></header>
        <div className="combat-result-metrics">
          <article className="combat-result-defeated"><span>ENEMIES DEFEATED</span><div aria-hidden="true"><i className="result-atlas-icon icon-sporeling" /><i className="result-atlas-icon icon-vine-warden" /><i className="result-atlas-icon icon-thornmaw" /></div><strong>{battle.enemiesDefeated}</strong></article>
        </div>
        <section className="combat-result-rewards"><h2>RESOURCES ACQUIRED</h2><div>
          <article><i className="result-atlas-icon icon-shard" aria-hidden="true" /><span>SHARD<strong>+12</strong></span></article>
          <article><i className="result-atlas-icon icon-ore" aria-hidden="true" /><span>ORE<strong>+3</strong></span></article>
          <article><i className="result-atlas-icon icon-biomass" aria-hidden="true" /><span>BIOMASS<strong>+5</strong></span></article>
          <article><i className="result-atlas-icon icon-plant-mastery" aria-hidden="true" /><span>PLANT MASTERY<strong>+2</strong></span></article>
        </div></section>
        <footer>
          <Button onClick={() => navigate("expedition")}>RETURN TO MAP</Button>
          {!isFinalBattle && <Button tone="primary" onClick={() => navigate("combat")}>NEXT BATTLE →</Button>}
        </footer>
      </section>
    </div>
  );
}

function DeckBuilderScreen({ emit }: ScreenProps) {
  const [active, setActive] = useState("ALL");
  return (
    <ScreenFrame title="Expedition Loadout" eyebrow="DECK BUILDER · PRESET 01" right={<><span className="mass-readout">MASS <b>10</b> / 10</span><Button tone="primary" onClick={() => emit("REQUEST_SAVE_DECK")}>SAVE DECK</Button></>}>
      <div className="deck-layout">
        <Panel title="Collection" eyebrow="42 / 68 CARDS" action={<span className="tiny-search">⌕ SEARCH</span>}>
          <div className="filter-row">{["ALL", "STONE", "PLANT", "1 COST"].map((f) => <button type="button" className={active === f ? "active" : ""} onClick={() => setActive(f)} key={f}>{f}</button>)}</div>
          <div className="collection-mini">{[...cardData, ...cardData.slice(0, 3)].map((card, i) => <GameCard key={`${card.name}-${i}`} card={card} compact onClick={() => emit(`REQUEST_ADD_CARD · ${card.name}`)} />)}</div>
        </Panel>
        <Panel title="Current deck" eyebrow="9 CARDS"><div className="deck-list">{cardData.map((card, index) => <button type="button" key={card.name} onClick={() => emit(`REQUEST_REMOVE_CARD · ${card.name}`)}><span>{index < 3 ? "3×" : "1×"}</span><b>{card.name}</b><i>{card.cost} E</i><em>{index === 2 ? 2 : 1} M</em></button>)}</div><div className="deck-warning">Cargo at capacity · Remove a card before adding.</div></Panel>
        <div className="deck-side"><Panel title="Battleship" eyebrow="COMPUTED STATS"><div className="ship-preview">▲</div><Stat icon="⚔" label="ARSENAL" value="2" detail="Rock Cannon: 7 (+2)" /><Stat icon="⬡" label="ENGINEERING" value="2" detail="Plating: 7 (+2)" /><Stat icon="⌁" label="SCIENCE" value="0" /><Stat icon="◈" label="COMMAND" value="0" /></Panel><Panel title="Relics" eyebrow="2 / 2 SLOTS"><div className="relic-row"><b>◆</b><span>Stoneheart Reactor</span></div><div className="relic-row"><b>◇</b><span>Emergency Seal</span></div></Panel></div>
      </div>
    </ScreenFrame>
  );
}

function CollectionScreen({ navigate }: ScreenProps) {
  return (
    <ScreenFrame title="Card Archive" eyebrow="COLLECTION · 42 / 68" right={<span className="status-chip">STONE + PLANT</span>}>
      <div className="archive-layout"><Panel title="Library" eyebrow="FILTERED: ALL"><div className="archive-grid">{[...cardData, ...cardData, ...cardData.slice(0, 2)].map((card, i) => <GameCard card={card} compact key={`${card.name}-${i}`} />)}</div></Panel><Panel title="Seismic Cannon" eyebrow="UNCOMMON · STONE"><div className="large-card-preview"><GameCard card={cardData[2]} /></div><div className="detail-copy"><span>MASS 2 · ENERGY 2</span><p>Deal 14 damage. If the target has Fracture, deal 8 additional damage.</p><b>Owned: 1</b><small>Setup payoff · Heavy physical</small></div><Button tone="primary" onClick={() => navigate("deck-builder")}>ADD IN DECK BUILDER</Button></Panel></div>
    </ScreenFrame>
  );
}

function HomeScreen({ navigate, emit }: ScreenProps) {
  type HomeFaction = "plant" | "stone";
  type HomeBuilding = { id: ScreenId | "hq"; label: string; note: string; x: string; y: string; code: string };
  const [faction, setFaction] = useState<HomeFaction>("plant");
  const bases: Record<HomeFaction, { name: string; cycle: string; level: number; levelProgress: number; art: string; resource: string; amount: string; resourceIcon: string; buildings: HomeBuilding[] }> = {
    plant: {
      name: "VERDANT HAVEN", cycle: "GROWTH CYCLE 14", level: 3, levelProgress: 64,
      art: "/assets/home/home_plant_base_v01.png", resource: "BIOMASS", amount: "86", resourceIcon: "icon-biomass",
      buildings: [
        { id: "production", label: "BIO FARM", note: "Grow & sell biomass", x: "19%", y: "69%", code: "01" },
        { id: "research", label: "TECH GARDEN", note: "Research Plant cards", x: "23%", y: "30%", code: "02" },
        { id: "hq", label: "VERDANT HQ", note: "Upgrade the whole base", x: "50%", y: "53%", code: "HQ" },
        { id: "deck-builder", label: "ARSENAL", note: "Organize combat deck", x: "77%", y: "30%", code: "03" },
        { id: "shipyard", label: "SHIPYARD", note: "Upgrade starship", x: "80%", y: "70%", code: "04" },
      ],
    },
    stone: {
      name: "BASALT HOLD", cycle: "MINING CYCLE 14", level: 4, levelProgress: 38,
      art: "/assets/home/home_stone_base_v01.png", resource: "ORE", amount: "93", resourceIcon: "icon-ore",
      buildings: [
        { id: "production", label: "ORE MINE", note: "Extract & sell ore", x: "18%", y: "70%", code: "01" },
        { id: "research", label: "CRYSTAL LAB", note: "Research Stone cards", x: "23%", y: "29%", code: "02" },
        { id: "hq", label: "BASALT CITADEL", note: "Upgrade the whole base", x: "50%", y: "53%", code: "HQ" },
        { id: "deck-builder", label: "ARSENAL", note: "Organize combat deck", x: "76%", y: "29%", code: "03" },
        { id: "shipyard", label: "SHIPYARD", note: "Upgrade starship", x: "79%", y: "70%", code: "04" },
      ],
    },
  };
  const base = bases[faction];
  const openBuilding = (building: HomeBuilding) => building.id === "hq"
    ? emit(`BASE_UPGRADE_SELECTED · ${faction.toUpperCase()} · LEVEL ${base.level}`)
    : navigate(building.id);

  return (
    <div className={`home-base-screen home-base-screen--${faction}`}>
      <img className="home-base-art" src={base.art} alt={`${base.name} ground colony`} />
      <div className="home-base-vignette" />
      <header className="home-base-hud">
        <div className="home-faction-switch" aria-label="Home base layout">
          <button type="button" className={faction === "plant" ? "is-active" : ""} onClick={() => setFaction("plant")}>PLANT</button>
          <button type="button" className={faction === "stone" ? "is-active" : ""} onClick={() => setFaction("stone")}>STONE</button>
        </div>
        <div className="home-base-title"><span>HOME BASE · {base.cycle}</span><h2>{base.name}</h2></div>
        <div className="home-base-wallet" aria-label="Current resources">
          <div className="home-resource"><i className="result-atlas-icon icon-shard" /><span>SHARD<strong>128</strong></span></div>
          <div className="home-resource"><i className={`result-atlas-icon ${base.resourceIcon}`} /><span>{base.resource}<strong>{base.amount}</strong></span></div>
        </div>
        <button type="button" className="home-universe-button" onClick={() => navigate("overview")}><span>UNIVERSE MAP</span><b>↗</b></button>
      </header>

      <main className="home-base-world" aria-label={`${base.name} buildings`}>
        {base.buildings.map((building) => (
          <button type="button" className={`home-building ${building.id === "hq" ? "home-building--hq" : ""}`} style={{ left: building.x, top: building.y }} onClick={() => openBuilding(building)} key={`${faction}-${building.label}`}>
            <i>{building.code}</i><span><b>{building.label}</b><small>{building.note}</small></span>
          </button>
        ))}
      </main>

      <footer className="home-base-level">
        <div><span>BASE LEVEL</span><strong>{String(base.level).padStart(2, "0")}</strong></div>
        <div><b>NEXT BASE UPGRADE</b><Progress value={base.levelProgress} tone={faction === "plant" ? "green" : "blue"} /><small>{base.levelProgress}% MATERIALS READY</small></div>
        <button type="button" onClick={() => emit(`BASE_UPGRADE_SELECTED · ${faction.toUpperCase()} · LEVEL ${base.level}`)}>UPGRADE HQ</button>
      </footer>
    </div>
  );
}

function ProductionScreen({ emit }: ScreenProps) {
  return (
    <ScreenFrame title="Stone Processor" eyebrow="PRODUCTION · CYCLE-BASED" right={<div className="resource-strip"><Resource icon="⬡" name="Ore" amount="38" /><Resource icon="▰" name="Alloy" amount="24" /></div>}>
      <div className="production-layout"><Panel title="Recipes" eyebrow="SELECT OUTPUT"><div className="recipe-list"><button type="button" className="selected"><b>▰</b><span>Alloy<small>3 Ore → 1 Alloy</small></span><em>1 CYCLE</em></button><button type="button"><b>◆</b><span>Precision Crystal<small>3 Alloy → 1 Crystal</small></span><em>2 CYCLES</em></button></div><div className="quantity"><span>QUANTITY</span><button>−</button><b>5</b><button>+</button></div><Button tone="primary" onClick={() => emit("REQUEST_QUEUE_PRODUCTION · stone_alloy ×5")}>ADD TO QUEUE</Button></Panel><Panel title="Production queue" eyebrow="2 / 5 JOBS"><div className="job is-active"><span>01</span><b>Alloy ×5<small>Processing now</small></b><Progress value={68} tone="gold" /><em>1 cycle</em></div><div className="job"><span>02</span><b>Precision Crystal ×1<small>Waiting</small></b><Progress value={0} /><em>2 cycles</em></div><div className="queue-empty">03 · EMPTY SLOT</div><div className="queue-empty">04 · EMPTY SLOT</div><div className="queue-empty">05 · EMPTY SLOT</div></Panel><Panel title="Cycle rules" eyebrow="NO REALTIME WAIT"><div className="cycle-card"><b>EXPEDITION STEP</b><strong>+1</strong><span>production cycle</span></div><p className="muted-copy">Clear a stage to advance every active building. Return home to claim completed output.</p><Button onClick={() => emit("DEV_ADVANCE_PRODUCTION · 1 cycle")}>DEV · ADVANCE 1 CYCLE</Button></Panel></div>
    </ScreenFrame>
  );
}

function ShipyardScreen({ emit }: ScreenProps) {
  return (
    <ScreenFrame title="Battleship Configuration" eyebrow="SHIPYARD · MK I" right={<Button tone="primary" onClick={() => emit("REQUEST_CONFIRM_UPGRADE · Cargo I")}>PURCHASE SELECTED</Button>}>
      <div className="shipyard-layout"><div className="ship-silhouette"><span>FRONT</span><b>▲</b><i>HANGAR</i><em>REACTOR</em></div><Panel title="Ship stats" eyebrow="CURRENT LOADOUT"><Stat icon="♥" label="HULL" value="100" detail="Structural integrity" /><Stat icon="⚡" label="REACTOR" value="3" detail="Energy per turn" /><Stat icon="▣" label="CARGO" value="10" detail="Deck Mass capacity" /><Stat icon="◇" label="RELIC BAY" value="2" detail="Equipped slots" /><Stat icon="⌖" label="SCANNER" value="I" detail="Next intent" /></Panel><Panel title="Cargo Rack I" eyebrow="SELECTED UPGRADE"><div className="upgrade-delta"><span>10<small>CURRENT</small></span><i>→</i><strong>12<small>NEW CARGO</small></strong></div><p>Carry two additional Mass. Enables heavier or more flexible deck configurations.</p><div className="cost-line"><Resource icon="▰" name="Alloy cost" amount="20 / 24" accent="gold" /></div><div className="upgrade-list"><button className="active">CARGO I <b>20 Alloy</b></button><button>HULL I <b>15 Alloy</b></button><button disabled>REACTOR I <b>LOCKED</b></button><button>SCANNER I <b>10 Alloy</b></button></div></Panel></div>
    </ScreenFrame>
  );
}

function ResearchScreen({ emit }: ScreenProps) {
  const nodes = [{ name: "Layered Plating", state: "owned" }, { name: "Fortify", state: "owned" }, { name: "Crystal Resonator", state: "ready" }, { name: "Seismic Theory", state: "locked" }, { name: "Counter Matrix", state: "locked" }];
  return (
    <ScreenFrame title="Stone Research Matrix" eyebrow="RESEARCH · TIER I" right={<Resource icon="◆" name="Precision Crystal" amount="4" accent="gold" />}>
      <div className="research-layout"><div className="research-map">{nodes.map((node, i) => <button type="button" className={`research-node research-node--${node.state}`} style={{ left: `${12 + i * 18}%`, top: `${i % 2 ? 54 : 30}%` }} key={node.name} onClick={() => emit(`RESEARCH_NODE_SELECTED · ${node.name}`)}><i>{node.state === "owned" ? "✓" : node.state === "ready" ? "+" : "×"}</i><b>{node.name}</b><small>{node.state.toUpperCase()}</small></button>)}<div className="research-path" /></div><Panel title="Crystal Resonator" eyebrow="MODULE · UNCOMMON"><div className="research-art">◆</div><p>Every third Stone card played this turn grants +2 Arsenal until end of turn.</p><span className="tag-row"><b>STONE</b><b>MODULE</b><b>ENGINE</b></span><Resource icon="◆" name="Research cost" amount="3 / 4" accent="gold" /><Button tone="primary" onClick={() => emit("REQUEST_RESEARCH_UNLOCK · crystal_resonator")}>UNLOCK RESEARCH</Button></Panel></div>
    </ScreenFrame>
  );
}

function WorldMapScreen({ navigate }: ScreenProps) {
  const planets = [{ id: "home" as ScreenId, name: "STONE", sub: "HOME · MASTERY II", state: "complete" }, { id: "planet-intel" as ScreenId, name: "PLANT", sub: "STAGE 2 / 5", state: "active" }, { id: "mastery" as ScreenId, name: "LIGHT", sub: "LOCKED", state: "locked" }, { id: "mastery" as ScreenId, name: "TECH", sub: "LOCKED", state: "locked" }, { id: "mastery" as ScreenId, name: "DARK", sub: "LOCKED", state: "locked" }];
  return (
    <ScreenFrame title="Known Planetary Chain" eyebrow="WORLD MAP · SECTOR 01" right={<span className="status-chip">THREAT: RISING</span>}>
      <div className="world-layout"><div className="star-field">{planets.map((planet, i) => <button type="button" key={planet.name} className={`planet-node planet-node--${planet.state}`} style={{ left: `${9 + i * 20}%`, top: `${i % 2 ? 44 : 57}%` }} onClick={() => planet.state !== "locked" && navigate(planet.id)}><i>{planet.state === "locked" ? "×" : "◆"}</i><b>{planet.name}</b><span>{planet.sub}</span></button>)}<div className="map-path" /></div><Panel title="Sector briefing" eyebrow="PROGRESSION"><p>Defeat each planet boss to open trade, local card pools and hybrid strategies.</p><div className="sector-stats"><Stat icon="◆" label="PLANETS" value="2 / 6" /><Stat icon="⚑" label="LICENSES" value="1" /><Stat icon="▣" label="CARDS" value="42" /></div><Button tone="primary" onClick={() => navigate("planet-intel")}>INSPECT PLANT</Button></Panel></div>
    </ScreenFrame>
  );
}

function PlanetIntelScreen({ navigate }: ScreenProps) {
  return (
    <ScreenFrame title="The Verdant Reach" eyebrow="PLANT · CAMPAIGN 2 / 5" right={<Button tone="primary" onClick={() => navigate("expedition")}>PREPARE EXPEDITION</Button>}>
      <div className="intel-layout"><div className="intel-planet"><div className="bio-planet">PLANT</div><span>THREAT RATING</span><strong>II · MODERATE</strong><Progress value={42} tone="green" /></div><Panel title="Known formation" eyebrow="STAGE 02 · VINE GUARD"><div className="formation-preview"><div><i>♟</i><b>Spore Caster</b><small>SUPPORT</small></div><div><i>♜</i><b>Vine Guard</b><small>TANK</small></div></div><span className="tag-row"><b>PROTECT</b><b>POISON</b><b>SUSTAIN</b></span></Panel><Panel title="Intel report" eyebrow="SCANNER I"><div className="threat-list"><span><i>!</i><b>Guard protects the caster</b><small>Use AoE or remove the tank first.</small></span><span><i>!</i><b>Poison pressure</b><small>Persistent Hull loss rewards faster play.</small></span></div><h4>RECOMMENDED</h4><span className="tag-row"><b>FRACTURE</b><b>HEAVY</b><b>TARGET PRIORITY</b></span></Panel><Panel title="Stage rewards" eyebrow="FIRST CLEAR"><div className="reward-row"><Resource icon="⬡" name="Ore" amount="+8" /><Resource icon="✦" name="Mastery" amount="+2" accent="plant" /></div><small className="muted-copy">Expedition completion advances production by 1 cycle.</small></Panel></div>
    </ScreenFrame>
  );
}

function ExpeditionScreen({ navigate }: ScreenProps) {
  return (
    <ScreenFrame title="Plant Expedition" eyebrow="RUN 42821 · IN PROGRESS" right={<><Stat icon="♥" label="PERSISTENT HULL" value="84 / 100" /><Button tone="primary" onClick={() => navigate("combat")}>ENTER NEXT STAGE</Button></>}>
      <div className="expedition-layout"><div className="stage-track">{["Thornlings", "Vine Guard", "Parasite Bloom", "Rootkeeper", "Mycelial Queen"].map((stage, i) => <div className={`stage-node ${i < 2 ? "is-clear" : i === 2 ? "is-next" : ""}`} key={stage}><i>{i < 2 ? "✓" : i + 1}</i><b>{stage}</b><small>{i < 2 ? "CLEARED" : i === 2 ? "NEXT" : "LOCKED"}</small></div>)}</div><Panel title="Run condition" eyebrow="HULL PERSISTS"><div className="hull-display"><span>84</span><Progress value={84} tone="red" /><small>16 Hull lost across 2 stages</small></div><p>Shield, Armor and encounter statuses reset. Hull remains until the expedition ends.</p></Panel><Panel title="Unbanked salvage" eyebrow="AT RISK"><div className="reward-row"><Resource icon="⬡" name="Ore" amount="11" /><Resource icon="✦" name="Mastery" amount="4" accent="plant" /></div><p className="muted-copy">Defeat loses part of unbanked salvage. Completed production cycles remain recorded.</p><Button onClick={() => navigate("home")}>RETREAT TO HOME</Button></Panel></div>
    </ScreenFrame>
  );
}

function TradeScreen({ emit, navigate }: ScreenProps) {
  return (
    <ScreenFrame title="Verdant Trade Exchange" eyebrow="PLANT LICENSE · ACTIVE" right={<div className="resource-strip"><Resource icon="▰" name="Alloy" amount="52" /><Resource icon="✦" name="Verdant Credits" amount="120" accent="plant" /></div>}>
      <div className="trade-layout"><Panel title="Export manifest" eyebrow="STONE → PLANT"><div className="trade-route"><div><b>▰</b><span>STONE ALLOY<small>Home inventory</small></span></div><i>→</i><div><b>✦</b><span>VERDANT CREDITS<small>Local currency</small></span></div></div><div className="exchange-rate"><span>RATE</span><strong>30 Alloy</strong><i>for</i><strong>100 Credits</strong></div><div className="quantity"><span>SHIPMENTS</span><button>−</button><b>1</b><button>+</button></div><Button tone="primary" onClick={() => emit("REQUEST_EXPORT · 30 Alloy → 100 Verdant Credits")}>CONFIRM EXPORT</Button></Panel><Panel title="Market services" eyebrow="PLANT MASTERY II"><button className="market-item" onClick={() => navigate("booster")}><b>▣</b><span>Plant Booster<small>5 cards · Basic pool</small></span><strong>100 ✦</strong></button><button className="market-item" disabled><b>◆</b><span>Targeted Research<small>Unlocks at Mastery III</small></span><strong>LOCKED</strong></button><button className="market-item"><b>↻</b><span>Pack Reroll<small>Spend Plant Knowledge</small></span><strong>25 K</strong></button></Panel><Panel title="License" eyebrow="BOSS REWARD"><div className="license-card"><span>AUTHORIZED</span><b>PLANT</b><small>Trade · Local market · Booster pool</small></div><p className="muted-copy">Defeat Mycelial Queen to permanently authorize exchange with the Verdant Reach.</p></Panel></div>
    </ScreenFrame>
  );
}

function BoosterScreen({ emit, navigate }: ScreenProps) {
  const [opened, setOpened] = useState(false);
  return (
    <ScreenFrame title="Verdant Booster" eyebrow="PLANT BASIC POOL · 5 CARDS" right={<Resource icon="✦" name="Verdant Credits" amount={opened ? "20" : "120"} accent="plant" />}>
      <div className={`booster-layout ${opened ? "is-opened" : ""}`}><div className="pack-stage"><div className="pack-shell"><span>PLANT</span><b>VERDANT<br />ARCHIVE</b><i>5 CARDS</i></div>{opened && <div className="reveal-cards">{cardData.slice(1).map((card, i) => <div key={card.name} className={i === 2 ? "is-rare" : ""}><GameCard card={card} compact /><span>{i === 2 ? "NEW" : i === 3 ? "+3 KNOWLEDGE" : "OWNED"}</span></div>)}</div>}</div><Panel title={opened ? "Archive updated" : "Open booster"} eyebrow={opened ? "RESULT COMMITTED" : "PURCHASE PREVIEW"}>{opened ? <><div className="summary-grid"><Stat icon="▣" label="NEW CARDS" value="1" /><Stat icon="↻" label="DUPLICATES" value="3" /><Stat icon="K" label="KNOWLEDGE" value="+9" /><Stat icon="✦" label="MASTERY" value="+1" /></div><Button tone="primary" onClick={() => navigate("deck-builder")}>BUILD HYBRID DECK</Button><Button onClick={() => setOpened(false)}>OPEN AGAIN</Button></> : <><div className="pack-price"><strong>100</strong><span>Verdant Credits</span></div><p>Mostly Common cards. Uncommon pool visible. Rare pool unlocks with higher Mastery.</p><Button tone="primary" onClick={() => { setOpened(true); emit("REQUEST_OPEN_PACK · result prepared"); }}>PURCHASE & OPEN</Button><small className="muted-copy">Animation can be skipped. Reward result does not change.</small></>}</Panel></div>
    </ScreenFrame>
  );
}

function MasteryScreen({ navigate }: ScreenProps) {
  const tiers = [{ n: "I", name: "Basic Packs", done: true }, { n: "II", name: "Advanced Trade", done: true }, { n: "III", name: "Rare Pool", done: false }, { n: "IV", name: "Planet Relic", done: false }, { n: "V", name: "Legendary Trial", done: false }];
  return (
    <ScreenFrame title="Plant Mastery" eyebrow="VERDANT REACH · 46 POINTS" right={<span className="status-chip status-chip--green">TIER II</span>}>
      <div className="mastery-layout"><div className="mastery-hero"><div className="mastery-ring"><span>46</span><small>/ 75</small></div><div><span className="kicker">NEXT TIER</span><h2>Rare card pool</h2><p>Collect unique cards, complete challenges and defeat elites to increase mastery.</p><Progress value={61} tone="green" /></div></div><div className="tier-track">{tiers.map((tier) => <div className={tier.done ? "is-done" : ""} key={tier.n}><i>{tier.done ? "✓" : tier.n}</i><b>{tier.name}</b><small>{tier.done ? "UNLOCKED" : "LOCKED"}</small></div>)}</div><Panel title="Mastery sources" eyebrow="PROGRESS BREAKDOWN"><div className="source-grid"><Stat icon="♛" label="BOSS" value="+20" /><Stat icon="▣" label="UNIQUE CARDS" value="+15" /><Stat icon="◇" label="PACKS" value="+6" /><Stat icon="⚔" label="CHALLENGES" value="+5" /></div></Panel><Panel title="Hybrid strategy unlocked" eyebrow="STONE + PLANT"><p>Combine Stone setup and armor with Plant Poison, sustain and summons.</p><span className="tag-row"><b>FRACTURE</b><b>POISON</b><b>MODULE</b><b>SUSTAIN</b></span><Button tone="primary" onClick={() => navigate("deck-builder")}>OPEN DECK BUILDER</Button></Panel></div>
    </ScreenFrame>
  );
}

const SCREEN_COMPONENTS: Record<ScreenId, React.ComponentType<ScreenProps>> = {
  start: StartScreen,
  overview: OverviewScreen,
  combat: CombatScreen,
  "combat-result": CombatResultScreen,
  "deck-builder": DeckBuilderScreen,
  collection: CollectionScreen,
  home: HomeScreen,
  production: ProductionScreen,
  shipyard: ShipyardScreen,
  research: ResearchScreen,
  "world-map": WorldMapScreen,
  "planet-intel": PlanetIntelScreen,
  expedition: ExpeditionScreen,
  trade: TradeScreen,
  booster: BoosterScreen,
  mastery: MasteryScreen,
};

function QuickNavigator({ open, current, onClose, navigate }: { open: boolean; current: ScreenId; onClose: () => void; navigate: (id: ScreenId) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setQuery(""); window.setTimeout(() => inputRef.current?.focus(), 20); } }, [open]);
  const results = SCREENS.filter((screen) => `${screen.title} ${screen.group} ${screen.description}`.toLowerCase().includes(query.toLowerCase()));
  if (!open) return null;
  return (
    <div className="quick-nav-backdrop debug-layer" role="presentation" onMouseDown={onClose}>
      <section className="quick-nav" role="dialog" aria-modal="true" aria-label="Quick screen navigator" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><span>QUICK NAVIGATOR</span><h2>Jump to any wireframe</h2></div><button type="button" onClick={onClose} aria-label="Close navigator">ESC</button></header>
        <label className="quick-search"><span>⌕</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search screens, flows, modules…" onKeyDown={(event) => { if (event.key === "Enter" && results[0]) navigate(results[0].id); }} /></label>
        <div className="quick-results">{results.map((screen) => <button type="button" className={screen.id === current ? "is-current" : ""} key={screen.id} onClick={() => navigate(screen.id)}><span>{screen.shortcut}</span><div><small>{screen.group}</small><strong>{screen.title}</strong><p>{screen.description}</p></div><b>{screen.id === current ? "CURRENT" : "↗"}</b></button>)}</div>
        <footer><span><kbd>↵</kbd> open first result</span><span><kbd>esc</kbd> close</span><span><kbd>⌘ K</kbd> toggle</span></footer>
      </section>
    </div>
  );
}

export default function Home() {
  const initialRoute = typeof window === "undefined" ? "start" : window.location.hash.replace("#/", "");
  const initial = initialRoute as ScreenId;
  const [screenId, setScreenId] = useState<ScreenId>(screenById[initial] ? initial : "start");
  const [toolOpen, setToolOpen] = useState(initialRoute === "tools/card-builder" || initialRoute === "card-builder");
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [toast, setToast] = useState("UI LAB READY");

  const navigate = useCallback((id: ScreenId) => {
    setToolOpen(false);
    setScreenId(id);
    window.location.hash = `#/${id}`;
    setNavigatorOpen(false);
  }, []);

  const emit = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast("UI LAB READY"), 2600);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const route = window.location.hash.replace("#/", "");
      if (route === "tools/card-builder" || route === "card-builder") {
        setToolOpen(true);
        if (route === "card-builder") window.history.replaceState(null, "", "#/tools/card-builder");
        return;
      }
      const next = route as ScreenId;
      if (screenById[next]) { setToolOpen(false); setScreenId(next); }
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setNavigatorOpen((value) => !value); }
      if (event.key === "Escape") setNavigatorOpen(false);
    };
    if (window.location.hash === "#/card-builder") window.history.replaceState(null, "", "#/tools/card-builder");
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onKey);
    if (!window.location.hash) window.location.hash = "#/start";
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("keydown", onKey); };
  }, []);

  const ScreenComponent = SCREEN_COMPONENTS[screenId];
  const currentIndex = SCREENS.findIndex((screen) => screen.id === screenId);
  const current = screenById[screenId];
  const grouped = useMemo(() => Array.from(new Set(SCREENS.map((screen) => screen.group))), []);

  if (toolOpen) {
    return <main className="card-builder-tool"><CardBuilderScreen emit={emit} onExit={() => navigate(screenId)} /></main>;
  }

  return (
    <main className="preview-app">
      <header className="preview-bar debug-layer">
        <button type="button" className="brand" onClick={() => navigate("start")}><b>PΔ</b><span>PLANET DECKBUILDER<small>HTML WIREFRAME LAB</small></span></button>
        <div className="preview-context"><span>{current.group}</span><b>/</b><strong>{current.title}</strong><i>{current.shortcut} / {SCREENS.length}</i></div>
        <div className="preview-tools"><button type="button" className="tool-trigger" onClick={() => { setToolOpen(true); window.location.hash = "#/tools/card-builder"; }}>CARD BUILDER ↗</button><label>VIEW <select value={scale} onChange={(event) => setScale(Number(event.target.value))}><option value={0.5}>50%</option><option value={0.75}>75%</option><option value={1}>100%</option></select></label><button type="button" onClick={() => setNavigatorOpen(true)} className="nav-trigger"><span>⌕</span> QUICK NAV <kbd>⌘ K</kbd></button></div>
      </header>
      <div className="screen-rail debug-layer" aria-label="Screen groups">{grouped.map((group) => <div key={group}><span>{group}</span>{SCREENS.filter((screen) => screen.group === group).map((screen) => <button type="button" aria-label={screen.title} title={screen.title} className={screen.id === screenId ? "active" : ""} onClick={() => navigate(screen.id)} key={screen.id}><b>{screen.shortcut}</b><small>{screen.title}</small></button>)}</div>)}</div>
      <section className="preview-workspace">
        <div className="canvas-meta debug-layer"><div><span className="live-dot" /> GAME VIEWPORT · {GAME_VIEWPORT.width} × {GAME_VIEWPORT.height} · {GAME_VIEWPORT.ratio}</div><div><button type="button" disabled={currentIndex === 0} onClick={() => navigate(SCREENS[currentIndex - 1].id)}>← PREV</button><span>{current.eyebrow}</span><button type="button" disabled={currentIndex === SCREENS.length - 1} onClick={() => navigate(SCREENS[currentIndex + 1].id)}>NEXT →</button></div></div>
        <div className="stage-scroller"><div className="stage-wrap" style={{ width: GAME_VIEWPORT.width * scale, height: GAME_VIEWPORT.height * scale }}><div className="game-viewport" data-reference-resolution={`${GAME_VIEWPORT.width}x${GAME_VIEWPORT.height}`} style={{ transform: `scale(${scale})` }}><ScreenComponent navigate={navigate} emit={emit} /></div></div></div>
        <div className="intent-toast debug-layer"><span className="live-dot" /><b>EVENT</b>{toast}</div>
      </section>
      <button type="button" className="floating-nav debug-layer" onClick={() => setNavigatorOpen(true)} aria-label="Open quick navigator">⌘ K</button>
      <QuickNavigator open={navigatorOpen} current={screenId} onClose={() => setNavigatorOpen(false)} navigate={navigate} />
    </main>
  );
}
