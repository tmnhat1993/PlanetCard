export const CARD_BUILDER_STORAGE_KEY = "planet-deckbuilder.card-builder.v1";

export const FACTIONS = ["STONE", "PLANT", "HYBRID", "NEUTRAL"] as const;
export const RARITIES = ["COMMON", "UNCOMMON", "RARE", "LEGENDARY"] as const;
export const CARD_TYPES = ["ACTION", "BUFF", "PASSIVE", "ATTACK", "TACTIC", "SUMMON", "MODULE"] as const;
export const OUTCOME_KINDS = ["DAMAGE", "HEAL_HULL", "GAIN_SHIELD", "GAIN_ARMOR", "GAIN_DEFEND", "POISON", "SUMMON_HP", "ENERGY"] as const;
export const RETENTION_POLICIES = ["DISCARD_END_TURN", "RETAIN_IN_HAND"] as const;

export const ICON_ASSET_CATALOG = [
  { id: "system_stone", label: "STONE", group: "SYSTEM", path: "/assets/cards/icons/system_stone_v01.png" },
  { id: "system_plant", label: "PLANT", group: "SYSTEM", path: "/assets/cards/icons/system_plant_v01.png" },
  { id: "system_hybrid", label: "HYBRID", group: "SYSTEM", path: "/assets/cards/icons/system_hybrid_v01.png" },
  { id: "system_neutral", label: "NEUTRAL", group: "SYSTEM", path: "/assets/cards/icons/system_neutral_v01.png" },
  { id: "type_action", label: "ACTION", group: "TYPE", path: "/assets/cards/icons/type_action_v01.png" },
  { id: "type_magic", label: "MAGIC", group: "TYPE", path: "/assets/cards/icons/type_magic_v01.png" },
  { id: "type_passive", label: "PASSIVE", group: "TYPE", path: "/assets/cards/icons/type_passive_v01.png" },
  { id: "type_summon", label: "SUMMON", group: "TYPE", path: "/assets/cards/icons/type_summon_v01.png" },
  { id: "type_module", label: "MODULE", group: "TYPE", path: "/assets/cards/icons/type_module_v01.png" },
] as const;

export const STAMP_CATALOG = [
  { id: "faction_stone", label: "STONE", group: "FACTION", iconPath: "/assets/cards/icons/system_stone_v01.png" },
  { id: "faction_plant", label: "PLANT", group: "FACTION", iconPath: "/assets/cards/icons/system_plant_v01.png" },
  { id: "faction_hybrid", label: "HYBRID", group: "FACTION", iconPath: "/assets/cards/icons/system_hybrid_v01.png" },
  { id: "faction_neutral", label: "NEUTRAL", group: "FACTION", iconPath: "/assets/cards/icons/system_neutral_v01.png" },
  { id: "type_action", label: "ACTION", group: "TYPE", iconPath: "/assets/cards/icons/type_action_v01.png" },
  { id: "type_magic", label: "MAGIC", group: "TYPE", iconPath: "/assets/cards/icons/type_magic_v01.png" },
  { id: "type_passive", label: "PASSIVE", group: "TYPE", iconPath: "/assets/cards/icons/type_passive_v01.png" },
  { id: "mechanic_summon", label: "SUMMON", group: "TYPE", iconPath: "/assets/cards/icons/type_summon_v01.png" },
  { id: "mechanic_module", label: "MODULE", group: "TYPE", iconPath: "/assets/cards/icons/type_module_v01.png" },
  { id: "damage_physical", label: "PHYSICAL", group: "DAMAGE", iconPath: "/assets/cards/icons/type_action_v01.png" },
  { id: "mechanic_poison", label: "POISON", group: "MECHANIC", iconPath: "/assets/cards/icons/system_plant_v01.png" },
  { id: "mechanic_shield", label: "SHIELD", group: "MECHANIC", iconPath: "/assets/cards/icons/type_passive_v01.png" },
  { id: "keyword_heavy", label: "HEAVY", group: "KEYWORD", iconPath: "/assets/cards/icons/system_stone_v01.png" },
  { id: "keyword_sustain", label: "SUSTAIN", group: "KEYWORD", iconPath: "/assets/cards/icons/system_hybrid_v01.png" },
] as const;

export type CardDraft = {
  id: string;
  name: string;
  faction: typeof FACTIONS[number];
  rarity: typeof RARITIES[number];
  type: typeof CARD_TYPES[number];
  energy_cost: number;
  mass: number;
  stars: number;
  outcome_kind: typeof OUTCOME_KINDS[number];
  base_value: number;
  amplification_coefficient: number;
  target: string;
  rules_text: string;
  tags: string[];
  stamps: string[];
  effects_json: string;
  retention_policy: typeof RETENTION_POLICIES[number];
  occupies_draw_slot: boolean;
  art_name: string;
  art_data_url: string;
  updated_at: string;
};

export type SavedCard = CardDraft & { revision: number };

export const EMPTY_CARD: CardDraft = {
  id: "plant_new_card",
  name: "New Card",
  faction: "PLANT",
  rarity: "COMMON",
  type: "ATTACK",
  energy_cost: 1,
  mass: 1,
  stars: 1,
  outcome_kind: "DAMAGE",
  base_value: 7,
  amplification_coefficient: 4,
  target: "SINGLE_ENEMY",
  rules_text: "Deal 7 damage.",
  tags: ["PLANT", "ATTACK"],
  stamps: ["faction_plant", "damage_physical"],
  effects_json: '[{"type":"DAMAGE","base":7}]',
  retention_policy: "DISCARD_END_TURN",
  occupies_draw_slot: false,
  art_name: "",
  art_data_url: "",
  updated_at: "",
};

export function slugifyCardId(value: string, faction: string) {
  const slug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const prefix = faction.toLowerCase();
  return slug.startsWith(`${prefix}_`) ? slug : `${prefix}_${slug || "new_card"}`;
}

export function validateCardDraft(draft: CardDraft): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9_]+$/.test(draft.id)) errors.push("ID chỉ dùng a-z, 0-9 và underscore.");
  if (!draft.name.trim()) errors.push("Tên thẻ không được trống.");
  if (draft.energy_cost < 0 || draft.energy_cost > 9) errors.push("Energy phải nằm trong 0–9.");
  if (draft.mass < 0 || draft.mass > 9) errors.push("Mass phải nằm trong 0–9.");
  if (draft.stars < 1 || draft.stars > 5) errors.push("Số sao phải nằm trong 1–5.");
  if (draft.base_value < 0) errors.push("Base outcome không thể âm.");
  if (draft.amplification_coefficient < 0) errors.push("Hệ số phóng đại không thể âm.");
  if (!draft.rules_text.trim()) errors.push("Rules text không được trống.");
  try {
    const effects = JSON.parse(draft.effects_json);
    if (!Array.isArray(effects)) errors.push("Effects JSON phải là một array.");
  } catch {
    errors.push("Effects JSON không hợp lệ.");
  }
  for (const stamp of draft.stamps) {
    if (!STAMP_CATALOG.some((item) => item.id === stamp)) errors.push(`Stamp không tồn tại: ${stamp}`);
  }
  return errors;
}

export function toExportRecord(draft: SavedCard) {
  return {
    id: draft.id,
    name: draft.name,
    faction: draft.faction,
    rarity: draft.rarity,
    type: draft.type,
    mass: draft.mass,
    stars: draft.stars,
    energy_cost: draft.energy_cost,
    target: draft.target,
    tags: draft.tags,
    rules_text: draft.rules_text,
    primary_outcome: {
      kind: draft.outcome_kind,
      base: draft.base_value,
      compatible_system: draft.faction,
      amplification_coefficient: draft.amplification_coefficient,
      rounding: "FLOOR"
    },
    effects: JSON.parse(draft.effects_json),
    hand_policy: {
      discard_at_turn_end: draft.retention_policy === "DISCARD_END_TURN",
      player_may_discard: true,
      occupies_draw_slot: draft.occupies_draw_slot,
    },
    art: {
      source: draft.art_name ? `assets/cards/source/${draft.id}/${draft.art_name}` : "",
      runtime: draft.art_name ? `assets/cards/runtime/${draft.id}/art.webp` : "",
      focus: { x: 0.5, y: 0.5 },
      version: draft.revision,
    },
    stamps: draft.stamps.map((id) => {
      const stamp = STAMP_CATALOG.find((item) => item.id === id)!;
      return { id: stamp.id, group: stamp.group, icon_path: stamp.iconPath.replace(/^\//, "") };
    }),
  };
}
