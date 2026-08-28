import { CARD_BUILDER_STORAGE_KEY, type CardDraft, type SavedCard } from "./model";

export function loadCardLibrary(): SavedCard[] {
  try {
    const value = window.localStorage.getItem(CARD_BUILDER_STORAGE_KEY);
    const cards: SavedCard[] = value ? JSON.parse(value) : [];
    return cards.map((card) => {
      let inferredBase = 0;
      try { inferredBase = Number(JSON.parse(card.effects_json)?.[0]?.base ?? 0); } catch { inferredBase = 0; }
      return {
        ...card,
        outcome_kind: card.outcome_kind ?? "DAMAGE",
        base_value: card.base_value ?? inferredBase,
        amplification_coefficient: card.amplification_coefficient ?? 4,
        stars: card.stars ?? (card.rarity === "LEGENDARY" ? 5 : card.rarity === "RARE" ? 4 : card.rarity === "UNCOMMON" ? 3 : 1),
        retention_policy: card.retention_policy ?? (card.type === "PASSIVE" ? "RETAIN_IN_HAND" : "DISCARD_END_TURN"),
        occupies_draw_slot: card.occupies_draw_slot ?? card.type === "PASSIVE",
      };
    });
  } catch {
    return [];
  }
}

export function saveCardDraft(draft: CardDraft): SavedCard[] {
  const library = loadCardLibrary();
  const previous = library.find((card) => card.id === draft.id);
  const saved: SavedCard = {
    ...draft,
    updated_at: new Date().toISOString(),
    revision: (previous?.revision ?? 0) + 1,
  };
  const next = [saved, ...library.filter((card) => card.id !== draft.id)];
  window.localStorage.setItem(CARD_BUILDER_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteSavedCard(id: string): SavedCard[] {
  const next = loadCardLibrary().filter((card) => card.id !== id);
  window.localStorage.setItem(CARD_BUILDER_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function fileToCardArt(file: File): Promise<string> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = source;
  });
  const maxWidth = 720;
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/webp", 0.86);
}

export function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadCardArt(filename: string, dataUrl: string) {
  if (!dataUrl) return;
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

type RenderCardInput = {
  id: string;
  name: string;
  system: string;
  type: "ACTION" | "MAGIC" | "PASSIVE";
  stars: number;
  rules: string;
  art: string;
  icons: string[];
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export async function renderStarterCardPng(card: RenderCardInput) {
  const [art, star, ...iconImages] = await Promise.all([loadImage(card.art), loadImage("/assets/cards/ui/rarity_star_v01.png"), ...card.icons.map(loadImage)]);
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 900;
  const context = canvas.getContext("2d")!;
  const palette = {
    ACTION: { outer: "#17110d", frame: "#a95c31", inner: "#3d2119", accent: "#ffb35c" },
    MAGIC: { outer: "#0c111c", frame: "#7055b7", inner: "#252044", accent: "#c4a8ff" },
    PASSIVE: { outer: "#0b1716", frame: "#4f9d8b", inner: "#173a35", accent: "#8ce8d4" },
  }[card.type];

  context.fillStyle = "#06090c";
  context.fillRect(0, 0, 600, 900);
  context.beginPath();
  context.roundRect(12, 12, 576, 876, 30);
  context.fillStyle = palette.outer;
  context.fill();
  context.lineWidth = 12;
  context.strokeStyle = palette.frame;
  context.stroke();
  context.beginPath();
  context.roundRect(30, 30, 540, 840, 22);
  context.fillStyle = palette.inner;
  context.fill();
  context.lineWidth = 4;
  context.strokeStyle = palette.accent;
  context.stroke();

  context.save();
  context.beginPath();
  context.roundRect(30, 30, 540, 495, 16);
  context.clip();
  const sourceRatio = art.width / art.height;
  const targetRatio = 540 / 495;
  let sx = 0, sy = 0, sw = art.width, sh = art.height;
  if (sourceRatio > targetRatio) { sw = art.height * targetRatio; sx = (art.width - sw) / 2; }
  else { sh = art.width / targetRatio; sy = (art.height - sh) / 2; }
  context.drawImage(art, sx, sy, sw, sh, 30, 30, 540, 495);
  context.restore();
  context.strokeStyle = palette.accent;
  context.lineWidth = 4;
  context.strokeRect(30, 30, 540, 495);

  const iconY = 570;
  const iconStart = 300 - ((card.icons.length - 1) * 36);
  iconImages.forEach((icon, index) => {
    const x = iconStart + index * 72;
    context.beginPath();
    context.arc(x, iconY, 27, 0, Math.PI * 2);
    context.fillStyle = palette.outer;
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = palette.accent;
    context.stroke();
    context.drawImage(icon, x - 24, iconY - 24, 48, 48);
  });

  context.textAlign = "center";
  context.fillStyle = palette.accent;
  context.font = "bold 18px monospace";
  context.fillText(`${card.system} · ${card.type}`, 300, 628);
  context.fillStyle = "#fff6df";
  context.font = "bold 34px monospace";
  context.fillText(card.name, 300, 682, 500);

  const starSize = 42;
  const starsWidth = card.stars * starSize;
  for (let index = 0; index < card.stars; index += 1) context.drawImage(star, 300 - starsWidth / 2 + index * starSize, 708, starSize, starSize);
  context.fillStyle = "#d5d7d0";
  context.font = "20px monospace";
  context.fillText(card.rules, 300, 790, 500);
  context.fillStyle = "#7f918f";
  context.font = "14px monospace";
  context.fillText(card.id.toUpperCase(), 300, 842);

  const laminate = context.createLinearGradient(80, 60, 520, 840);
  laminate.addColorStop(0, "rgba(255,255,255,.24)");
  laminate.addColorStop(.18, "rgba(255,255,255,0)");
  laminate.addColorStop(.58, "rgba(115,240,255,.09)");
  laminate.addColorStop(.78, "rgba(255,255,255,0)");
  laminate.addColorStop(1, "rgba(255,220,120,.12)");
  context.beginPath();
  context.roundRect(18, 18, 564, 864, 28);
  context.fillStyle = laminate;
  context.fill();

  const anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = `${card.id}_complete.png`;
  anchor.click();
}
