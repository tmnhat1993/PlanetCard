"use client";

import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { CARD_TYPES, EMPTY_CARD, FACTIONS, ICON_ASSET_CATALOG, OUTCOME_KINDS, RARITIES, RETENTION_POLICIES, STAMP_CATALOG, slugifyCardId, toExportRecord, validateCardDraft, type CardDraft, type SavedCard } from "./model";
import { calculateCardOutcome } from "./outcome";
import { CARD_PRESETS, presetToDraft, type CardPreset } from "./presets";
import { ART_LIBRARY, type ArtLibraryItem, type ArtTier } from "./artLibrary";
import { deleteSavedCard, downloadCardArt, downloadJson, fileToCardArt, loadCardLibrary, renderStarterCardPng, saveCardDraft } from "./repository";

type Props = { emit: (message: string) => void; onExit?: () => void };
type CardSystemFilter = "ALL" | CardDraft["faction"];
type CardTypeFilter = "ALL" | CardPreset["type"];

const LIBRARY_PAGE_SIZE = 5;
const CATALOG_PAGE_SIZE = 8;
const ART_PAGE_SIZE = 12;

function updateCardTilt(event: ReactPointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
  card.style.setProperty("--tilt-x", `${(-vertical * 7).toFixed(2)}deg`);
  card.style.setProperty("--tilt-y", `${(horizontal * 7).toFixed(2)}deg`);
  card.style.setProperty("--tilt-light-x", `${((horizontal + 0.5) * 100).toFixed(1)}%`);
  card.style.setProperty("--tilt-light-y", `${((vertical + 0.5) * 100).toFixed(1)}%`);
}

function resetCardTilt(event: ReactPointerEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--tilt-light-x", "50%");
  card.style.setProperty("--tilt-light-y", "50%");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="cb-field"><span>{label}</span>{children}</label>;
}

function Pagination({ page, pages, onChange, label }: { page: number; pages: number; onChange: (page: number) => void; label: string }) {
  return <nav className="cb-pagination" aria-label={label}><button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>← PREV</button><span>PAGE <b>{page}</b> / {pages}</span><button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>NEXT →</button></nav>;
}

export default function CardBuilderScreen({ emit, onExit }: Props) {
  const [draft, setDraft] = useState<CardDraft>(EMPTY_CARD);
  const [library, setLibrary] = useState<SavedCard[]>([]);
  const [shipAmplification, setShipAmplification] = useState(5);
  const [systemCompatible, setSystemCompatible] = useState(true);
  const [message, setMessage] = useState("Draft chưa lưu");
  const [cardQuery, setCardQuery] = useState("");
  const [cardSystem, setCardSystem] = useState<CardSystemFilter>("ALL");
  const [cardStars, setCardStars] = useState("ALL");
  const [cardType, setCardType] = useState<CardTypeFilter>("ALL");
  const [libraryPage, setLibraryPage] = useState(1);
  const [catalogPage, setCatalogPage] = useState(1);
  const [artQuery, setArtQuery] = useState("");
  const [artSystem, setArtSystem] = useState<"ALL" | "PLANT" | "STONE">("ALL");
  const [artTier, setArtTier] = useState<"ALL" | ArtTier>("ALL");
  const [artPage, setArtPage] = useState(1);
  const errors = useMemo(() => validateCardDraft(draft), [draft]);
  const outcome = useMemo(() => calculateCardOutcome({ base: draft.base_value, shipAmplification, cardCoefficient: draft.amplification_coefficient, compatible: systemCompatible }), [draft.base_value, draft.amplification_coefficient, shipAmplification, systemCompatible]);
  const normalizedQuery = cardQuery.trim().toLowerCase();
  const filterCard = (card: { id: string; name: string; system: CardDraft["faction"]; stars: number; type: CardPreset["type"] }) => (!normalizedQuery || `${card.name} ${card.id}`.toLowerCase().includes(normalizedQuery))
    && (cardSystem === "ALL" || card.system === cardSystem)
    && (cardStars === "ALL" || card.stars === Number(cardStars))
    && (cardType === "ALL" || card.type === cardType);
  const filteredCatalog = useMemo(() => CARD_PRESETS
    .filter(filterCard)
    .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name)), [normalizedQuery, cardSystem, cardStars, cardType]);
  const filteredLibrary = useMemo(() => library
    .map((card) => ({ card, filterType: card.type === "PASSIVE" || card.type === "MODULE" ? "PASSIVE" as const : card.type === "BUFF" || card.type === "TACTIC" ? "MAGIC" as const : "ACTION" as const }))
    .filter(({ card, filterType }) => filterCard({ id: card.id, name: card.name, system: card.faction, stars: card.stars, type: filterType }))
    .map(({ card }) => card)
    .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name)), [library, normalizedQuery, cardSystem, cardStars, cardType]);
  const libraryPages = Math.max(1, Math.ceil(filteredLibrary.length / LIBRARY_PAGE_SIZE));
  const catalogPages = Math.max(1, Math.ceil(filteredCatalog.length / CATALOG_PAGE_SIZE));
  const visibleLibrary = filteredLibrary.slice((libraryPage - 1) * LIBRARY_PAGE_SIZE, libraryPage * LIBRARY_PAGE_SIZE);
  const visibleCatalog = filteredCatalog.slice((catalogPage - 1) * CATALOG_PAGE_SIZE, catalogPage * CATALOG_PAGE_SIZE);
  const normalizedArtQuery = artQuery.trim().toLowerCase();
  const artTierOrder: Record<ArtTier, number> = { BASIC: 0, ADVANCED: 1, RARE: 2 };
  const filteredArt = useMemo(() => ART_LIBRARY
    .filter((item) => !normalizedArtQuery || `${item.name} ${item.id} ${item.tags.join(" ")} ${item.summary}`.toLowerCase().includes(normalizedArtQuery))
    .filter((item) => artSystem === "ALL" || item.system === artSystem)
    .filter((item) => artTier === "ALL" || item.tier === artTier)
    .sort((a, b) => artTierOrder[a.tier] - artTierOrder[b.tier] || a.system.localeCompare(b.system) || a.name.localeCompare(b.name)), [normalizedArtQuery, artSystem, artTier]);
  const artPages = Math.max(1, Math.ceil(filteredArt.length / ART_PAGE_SIZE));
  const visibleArt = filteredArt.slice((artPage - 1) * ART_PAGE_SIZE, artPage * ART_PAGE_SIZE);

  useEffect(() => { setLibraryPage(1); setCatalogPage(1); }, [normalizedQuery, cardSystem, cardStars, cardType]);
  useEffect(() => { if (libraryPage > libraryPages) setLibraryPage(libraryPages); }, [libraryPage, libraryPages]);
  useEffect(() => { if (catalogPage > catalogPages) setCatalogPage(catalogPages); }, [catalogPage, catalogPages]);
  useEffect(() => { setArtPage(1); }, [normalizedArtQuery, artSystem, artTier]);
  useEffect(() => { if (artPage > artPages) setArtPage(artPages); }, [artPage, artPages]);

  useEffect(() => {
    let next = loadCardLibrary();
    const missing = CARD_PRESETS.filter((starter) => !next.some((card) => card.id === starter.id));
    for (const starter of [...missing].reverse()) next = saveCardDraft(presetToDraft(starter));
    const upgradedArtwork = CARD_PRESETS
      .filter((preset) => preset.set !== "FOUNDATION")
      .filter((preset) => next.some((card) => card.id === preset.id
        && card.art_data_url !== preset.art
        && card.art_data_url.startsWith("/assets/cards/sets/")
        && /_art_v0[12]\.png$/.test(card.art_data_url)));
    for (const preset of [...upgradedArtwork].reverse()) {
      const saved = next.find((card) => card.id === preset.id)!;
      next = saveCardDraft({ ...saved, art_data_url: preset.art, art_name: preset.art.split("/").pop() ?? `${preset.id}_art.png` });
    }
    setLibrary(next);
  }, []);
  const update = <K extends keyof CardDraft>(key: K, value: CardDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const save = () => {
    if (errors.length) return setMessage(errors[0]);
    try {
      const next = saveCardDraft(draft);
      setLibrary(next);
      const saved = next[0];
      setDraft(saved);
      setMessage(`Đã lưu revision ${saved.revision}`);
      emit(`CARD_SAVED · ${saved.id} · REV ${saved.revision}`);
    } catch {
      setMessage("Không đủ browser storage. Hãy export hoặc dùng art nhỏ hơn.");
    }
  };

  const chooseArt = async (file?: File) => {
    if (!file) return;
    try {
      update("art_data_url", await fileToCardArt(file));
      const cleanBase = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      update("art_name", `${cleanBase || "art"}.webp`);
      setMessage("Art đã nạp; nhấn Save để lưu vào library.");
    } catch {
      setMessage("Không thể đọc file art này.");
    }
  };

  const toggleStamp = (id: string) => update("stamps", draft.stamps.includes(id) ? draft.stamps.filter((stamp) => stamp !== id) : [...draft.stamps, id]);
  const selectedStamps = STAMP_CATALOG.filter((stamp) => draft.stamps.includes(stamp.id));
  const previewType = draft.type === "PASSIVE" || draft.type === "MODULE" ? "passive" : draft.type === "BUFF" || draft.type === "TACTIC" ? "magic" : "action";
  const coreIconPaths = [
    ICON_ASSET_CATALOG.find((item) => item.id === `system_${draft.faction.toLowerCase()}`)?.path,
    ICON_ASSET_CATALOG.find((item) => item.id === `type_${previewType}`)?.path,
  ].filter(Boolean) as string[];
  const previewAttributeIcons = Array.from(new Set([...coreIconPaths, ...selectedStamps.map((stamp) => stamp.iconPath)])).slice(0, 5);
  const loadStarter = (card: CardPreset) => {
    setDraft(presetToDraft(card));
    setMessage(`Đã nạp template ${card.name}; nhấn Save để thêm vào library.`);
    document.querySelector(".cb-layout")?.scrollIntoView({ behavior: "smooth" });
  };
  const useLibraryArt = (item: ArtLibraryItem) => {
    setDraft((current) => ({
      ...current,
      faction: item.system,
      art_data_url: item.path,
      art_name: item.path.split("/").pop() ?? `${item.id}_v01.png`,
      tags: Array.from(new Set([...current.tags, item.system, item.tier, ...item.tags])),
    }));
    setMessage(`Đã gắn artwork ${item.name}; preview và laminate đã cập nhật.`);
    document.querySelector(".cb-layout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="card-builder-screen">
      <header className="cb-toolbar">
        <div><span>CARD BUILDER UTILS · LOCAL AUTHORING</span><h2>Card Workshop</h2></div>
        <div>{onExit && <button type="button" onClick={onExit}>← UI LAB</button>}<button type="button" onClick={() => document.getElementById("starter-card-set")?.scrollIntoView({ behavior: "smooth" })}>CARD SETS ↓</button><button type="button" onClick={() => { setDraft({ ...EMPTY_CARD }); setMessage("Draft mới"); }}>NEW</button><button type="button" onClick={() => library.length && downloadJson("card_library.json", library.map(toExportRecord))}>EXPORT LIBRARY</button><button type="button" className="is-primary" disabled={Boolean(errors.length)} onClick={save}>SAVE CARD</button></div>
      </header>
      <section className="cb-catalog-controls" aria-label="Card filters">
        <label><span>SEARCH</span><input aria-label="Search cards" value={cardQuery} placeholder="Name or card ID…" onChange={(event) => setCardQuery(event.target.value)} /></label>
        <label><span>SYSTEM</span><select aria-label="Filter by system" value={cardSystem} onChange={(event) => setCardSystem(event.target.value as CardSystemFilter)}><option value="ALL">ALL SYSTEMS</option>{FACTIONS.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label><span>STARS</span><select aria-label="Filter by stars" value={cardStars} onChange={(event) => setCardStars(event.target.value)}><option value="ALL">ALL STARS</option>{[5, 4, 3, 2, 1].map((stars) => <option value={stars} key={stars}>{stars}★</option>)}</select></label>
        <label><span>TYPE</span><select aria-label="Filter by type" value={cardType} onChange={(event) => setCardType(event.target.value as CardTypeFilter)}><option value="ALL">ALL TYPES</option><option value="ACTION">ACTION</option><option value="MAGIC">MAGIC</option><option value="PASSIVE">PASSIVE</option></select></label>
        <button type="button" onClick={() => { setCardQuery(""); setCardSystem("ALL"); setCardStars("ALL"); setCardType("ALL"); }}>RESET</button>
        <div><b>RARITY SORT</b><span>5★ → 1★</span><small>{filteredCatalog.length} / {CARD_PRESETS.length} CARDS</small></div>
      </section>
      <div className="cb-layout">
        <section className="cb-editor">
          <div className="cb-section-title"><b>01</b><span>IDENTITY & RULES</span></div>
          <div className="cb-form-grid">
            <Field label="NAME"><input value={draft.name} onChange={(event) => { update("name", event.target.value); update("id", slugifyCardId(event.target.value, draft.faction)); }} /></Field>
            <Field label="ID"><input value={draft.id} onChange={(event) => update("id", event.target.value)} /></Field>
            <Field label="FACTION"><select value={draft.faction} onChange={(event) => update("faction", event.target.value as CardDraft["faction"])}>{FACTIONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="RARITY"><select value={draft.rarity} onChange={(event) => update("rarity", event.target.value as CardDraft["rarity"])}>{RARITIES.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="TYPE"><select value={draft.type} onChange={(event) => update("type", event.target.value as CardDraft["type"])}>{CARD_TYPES.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="STARS"><input type="number" min="1" max="5" value={draft.stars} onChange={(event) => update("stars", Number(event.target.value))} /></Field>
            <Field label="TARGET"><input value={draft.target} onChange={(event) => update("target", event.target.value.toUpperCase())} /></Field>
            <Field label="ENERGY"><input type="number" min="0" max="9" value={draft.energy_cost} onChange={(event) => update("energy_cost", Number(event.target.value))} /></Field>
            <Field label="MASS"><input type="number" min="0" max="9" value={draft.mass} onChange={(event) => update("mass", Number(event.target.value))} /></Field>
            <Field label="HAND POLICY"><select value={draft.retention_policy} onChange={(event) => update("retention_policy", event.target.value as CardDraft["retention_policy"])}>{RETENTION_POLICIES.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="OCCUPIES DRAW SLOT"><select value={draft.occupies_draw_slot ? "YES" : "NO"} onChange={(event) => update("occupies_draw_slot", event.target.value === "YES")}><option>YES</option><option>NO</option></select></Field>
          </div>
          <Field label="RULES TEXT"><textarea rows={2} value={draft.rules_text} onChange={(event) => update("rules_text", event.target.value)} /></Field>
          <Field label="EFFECTS JSON"><textarea rows={2} value={draft.effects_json} onChange={(event) => update("effects_json", event.target.value)} /></Field>
          <div className="cb-section-title"><b>02</b><span>OUTCOME AMPLIFICATION</span></div>
          <div className="cb-outcome-grid"><Field label="OUTCOME"><select value={draft.outcome_kind} onChange={(event) => update("outcome_kind", event.target.value as CardDraft["outcome_kind"])}>{OUTCOME_KINDS.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="BASE"><input type="number" min="0" value={draft.base_value} onChange={(event) => update("base_value", Number(event.target.value))} /></Field><Field label="CARD COEFFICIENT"><input type="number" min="0" value={draft.amplification_coefficient} onChange={(event) => update("amplification_coefficient", Number(event.target.value))} /></Field><Field label="SHIP AMPLIFICATION"><input type="number" min="0" value={shipAmplification} onChange={(event) => setShipAmplification(Number(event.target.value))} /></Field><Field label="SYSTEM COMPATIBLE"><select value={systemCompatible ? "YES" : "NO"} onChange={(event) => setSystemCompatible(event.target.value === "YES")}><option>YES</option><option>NO</option></select></Field></div>
          <div className="cb-outcome-equation"><span>{draft.base_value} + floor({draft.base_value} × ({outcome.effectiveShipAmplification} × {draft.amplification_coefficient})%)</span><b>{outcome.base} + {outcome.bonusValue} = {outcome.total}</b><small>{outcome.bonusPercent}% BONUS · {systemCompatible ? `${draft.faction} COMPATIBLE` : "INCOMPATIBLE → BASE ONLY"} · FLOOR</small></div>
          <div className="cb-section-title"><b>03</b><span>ATTRIBUTE STAMPS</span></div>
          <div className="cb-stamp-picker">{STAMP_CATALOG.map((stamp) => <button type="button" className={draft.stamps.includes(stamp.id) ? "active" : ""} onClick={() => toggleStamp(stamp.id)} key={stamp.id}><img src={stamp.iconPath} alt="" />{stamp.label}<small>{stamp.group}</small></button>)}</div>
        </section>

        <section className="cb-preview-column">
          <div className={`live-card live-card--${previewType} live-card--${draft.faction.toLowerCase()}`} onPointerMove={updateCardTilt} onPointerLeave={resetCardTilt}>
            <label className="live-card__art">
              {draft.art_data_url ? <img src={draft.art_data_url} alt="Card art preview" /> : <span><b>＋</b>DROP / CHOOSE ART<small>PNG · JPG · WEBP</small></span>}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => chooseArt(event.target.files?.[0])} />
            </label>
            <div className="live-card__icon-bridge">{previewAttributeIcons.map((path) => <span key={path}><img src={path} alt="" /></span>)}</div>
            <div className="live-card__content">
              <h3>{draft.name || "UNTITLED"}</h3>
              <div className="live-card__stars">{Array.from({ length: draft.stars }, (_, index) => <img src="/assets/cards/ui/rarity_star_v01.png" alt="" key={index} />)}</div>
            </div>
            <span className={`live-card__laminate laminate--${draft.stars}`} aria-hidden="true" />
          </div>
          <div className={`cb-validation ${errors.length ? "has-errors" : "is-valid"}`}><b>{errors.length ? `${errors.length} ISSUE` : "READY TO SAVE"}</b><span>{errors[0] ?? message}</span></div>
        </section>

        <aside className="cb-library">
          <div className="cb-section-title"><b>04</b><span>SAVED LIBRARY · {filteredLibrary.length} / {library.length}</span></div>
          <div className="cb-library-list">{filteredLibrary.length === 0 ? <div className="cb-empty">Không có card phù hợp.<br />Hãy thay đổi bộ lọc.</div> : visibleLibrary.map((card) => <article key={card.id}>
            <button type="button" className="cb-library-open" onClick={() => { setDraft(card); setMessage(`Loaded revision ${card.revision}`); }}>
              <span>{card.art_data_url ? <img src={card.art_data_url} alt="" /> : card.energy_cost}</span><div><b>{card.name}</b><small>{card.faction} · {card.type} · REV {card.revision}</small></div><em>OPEN</em>
            </button>
            <div><button type="button" onClick={() => downloadJson(`${card.id}.json`, toExportRecord(card))}>JSON</button><button type="button" disabled={!card.art_data_url} onClick={() => downloadCardArt(`${card.id}_art.webp`, card.art_data_url)}>ART</button><button type="button" onClick={() => { setDraft({ ...card, id: `${card.id}_copy`, name: `${card.name} Copy`, updated_at: "" }); setMessage("Duplicate draft; chưa lưu"); }}>DUPLICATE</button><button type="button" onClick={() => { setLibrary(deleteSavedCard(card.id)); setMessage(`Đã xóa ${card.id}`); }}>DELETE</button></div>
          </article>)}</div>
          <Pagination page={libraryPage} pages={libraryPages} onChange={setLibraryPage} label="Saved library pages" />
          <div className="cb-storage-note"><b>LOCAL STORAGE V1</b><span>Art được resize tối đa 720px và lưu trên trình duyệt này. Dùng Export JSON để đưa record vào project/Godot.</span></div>
        </aside>
      </div>
      <section className="cb-starter-set" id="starter-card-set">
        <header><span>PRODUCTION CARD SETS · {String(CARD_PRESETS.length).padStart(2, "0")} COMPLETE CARDS</span><h2>Plant · Stone progression</h2><p>Độ phức tạp tăng theo sao: 1★ học một hành động, 2★ mở sustain và điều kiện, 3★ kết hợp hai hiệu ứng liên quan, 4★ thêm AoE, phản đòn, trigger và summon. Plant thiên hồi phục; Stone thiên damage/Defend và không hồi Hull.</p></header>
        <div className="cb-icon-library"><div className="cb-icon-library__title"><span>ICON ASSET CATALOG</span><b>04 SYSTEMS · 05 CARD TYPES</b></div><div>{ICON_ASSET_CATALOG.map((icon) => <article key={icon.id}><img src={icon.path} alt={`${icon.label} icon`} /><b>{icon.label}</b><small>{icon.group} · {icon.id}</small></article>)}</div></div>
        <section className="cb-art-pack" aria-label="Artwork pack library">
          <header><div><span>ARTWORK PACK · {ART_LIBRARY.length} ASSETS</span><h3>Plant + Stone ability art</h3><p>Artwork-only, tỷ lệ dọc 2:3, không bake khung hoặc laminate. Chọn một hình để gắn trực tiếp vào live preview.</p></div><a href="/docs/card-art-guideline.md" target="_blank" rel="noreferrer">ART GUIDELINE ↗</a></header>
          <div className="cb-art-filters">
            <label><span>SEARCH ART</span><input aria-label="Search artwork" value={artQuery} placeholder="Ability, tag or asset ID…" onChange={(event) => setArtQuery(event.target.value)} /></label>
            <label><span>SYSTEM</span><select aria-label="Filter artwork system" value={artSystem} onChange={(event) => setArtSystem(event.target.value as typeof artSystem)}><option value="ALL">ALL SYSTEMS</option><option value="PLANT">PLANT</option><option value="STONE">STONE</option></select></label>
            <label><span>COMPLEXITY</span><select aria-label="Filter artwork tier" value={artTier} onChange={(event) => setArtTier(event.target.value as typeof artTier)}><option value="ALL">BASIC → RARE</option><option value="BASIC">BASIC · 1–2★</option><option value="ADVANCED">ADVANCED · 3★</option><option value="RARE">RARE · 4★</option></select></label>
            <button type="button" onClick={() => { setArtQuery(""); setArtSystem("ALL"); setArtTier("ALL"); }}>RESET</button>
            <div><b>{filteredArt.length} / {ART_LIBRARY.length}</b><span>ASSETS</span></div>
          </div>
          <div className="cb-art-grid">{visibleArt.map((item) => <article key={item.id}>
            <div className="cb-art-image"><img src={item.path} alt={`${item.name} artwork`} /></div>
            <div className="cb-art-meta"><div><span className={`is-${item.system.toLowerCase()}`}>{item.system}</span><span>{item.tier}</span><span>{item.suggestedStars}</span></div><h4>{item.name}</h4><p>{item.summary}</p><small>{item.tags.join(" · ")}</small><button type="button" onClick={() => useLibraryArt(item)}>USE IN BUILDER ↑</button></div>
          </article>)}</div>
          <Pagination page={artPage} pages={artPages} onChange={setArtPage} label="Artwork library pages" />
        </section>
        <div className="cb-set-summary"><span>PLANT 1★ · 7 CARDS</span><span>PLANT 2★ · 7 CARDS</span><span>PLANT 3★ · 7 CARDS</span><span>PLANT 4★ · 7 CARDS</span><span>STONE 1★ · 7 CARDS</span><span>STONE 2★ · 7 CARDS</span><span>STONE 3★ · 7 CARDS</span><span>STONE 4★ · 7 CARDS</span><span>FOUNDATION · 3 CARDS</span></div>
        <div className="cb-catalog-result"><span>SHOWING {visibleCatalog.length} OF {filteredCatalog.length} · SORTED 5★ → 1★</span><Pagination page={catalogPage} pages={catalogPages} onChange={setCatalogPage} label="Production card pages" /></div>
        <div className="asset-card-gallery">{visibleCatalog.map((card) => <article className="asset-card-entry" data-set={card.set} key={card.id}>
          <div className={`asset-card asset-card--${card.type.toLowerCase()}`} onPointerMove={updateCardTilt} onPointerLeave={resetCardTilt}>
            <div className="asset-card__art"><img src={card.art} alt={`${card.name} artwork`} /></div>
            <div className="asset-card__icons">{card.icons.map((icon) => <span key={icon}><img src={icon} alt="" /></span>)}</div>
            <div className="asset-card__content"><h3>{card.name}</h3><div className="asset-card__stars">{Array.from({ length: card.stars }, (_, index) => <img src="/assets/cards/ui/rarity_star_v01.png" alt="" key={index} />)}</div></div>
            <span className={`asset-card__laminate laminate--${card.stars}`} aria-hidden="true" />
          </div>
          <footer><button type="button" onClick={() => loadStarter(card)}>LOAD IN BUILDER</button><button type="button" onClick={() => renderStarterCardPng(card)}>EXPORT PNG</button></footer>
        </article>)}</div>
        <div className="cb-catalog-result cb-catalog-result--bottom"><span>{filteredCatalog.length} MATCHING CARDS</span><Pagination page={catalogPage} pages={catalogPages} onChange={setCatalogPage} label="Production card pages bottom" /></div>
      </section>
    </div>
  );
}
