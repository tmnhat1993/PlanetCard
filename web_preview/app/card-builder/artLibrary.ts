export type ArtTier = "BASIC" | "ADVANCED" | "RARE";

export type ArtLibraryItem = {
  id: string;
  name: string;
  system: "PLANT" | "STONE";
  tier: ArtTier;
  suggestedStars: "1–2★" | "3★" | "4★";
  tags: string[];
  path: string;
  summary: string;
};

type SourceItem = [id: string, name: string, tags: string[], summary: string];

const source: Record<"PLANT" | "STONE", Record<ArtTier, SourceItem[]>> = {
  PLANT: {
    BASIC: [
      ["plant_needle_sprout", "Needle Sprout", ["damage", "projectile"], "Mầm gai bắn thẳng, dùng cho sát thương đơn."],
      ["plant_sap_orb", "Sap Orb", ["drain", "heal"], "Cầu nhựa cây hút sinh lực và hồi Hull."],
      ["plant_mending_frond", "Mending Frond", ["heal", "repair"], "Lá non khép lại, biểu tượng hồi phục trực tiếp."],
      ["plant_seed_aegis", "Seed Aegis", ["defend", "shield"], "Hạt giống nằm trong khiên, dùng cho Defend."],
      ["plant_growth_orbit", "Growth Orbit", ["regen", "duration"], "Vòng tăng trưởng tuần hoàn cho hiệu ứng theo lượt."],
      ["plant_solar_leaf", "Solar Leaf", ["energy", "gain"], "Lá hấp thụ ánh sáng, dùng cho tạo Energy."],
      ["plant_spore_pulse", "Spore Pulse", ["poison", "area"], "Xung bào tử lan tỏa, dùng cho Poison hoặc AoE."],
      ["plant_vine_snare", "Vine Snare", ["control", "root"], "Dây leo khóa mục tiêu, dùng cho Root hoặc giảm tốc."],
    ],
    ADVANCED: [
      ["plant_briar_cascade", "Briar Cascade", ["damage", "area"], "Dòng gai quét nhiều mục tiêu."],
      ["plant_crimson_graft", "Crimson Graft", ["damage", "lifesteal"], "Đòn gai đỏ nối sát thương với hồi phục."],
      ["plant_purifying_mycelium", "Purifying Mycelium", ["heal", "cleanse"], "Mạng nấm tách độc và tái tạo Hull."],
      ["plant_canopy_citadel", "Canopy Citadel", ["defend", "duration"], "Nhiều tầng tán lá tạo thành thành lũy."],
      ["plant_perpetual_spring", "Perpetual Spring", ["regen", "duration"], "Nguồn sống tuần hoàn cho hồi phục dài lượt."],
      ["plant_heliotropic_engine", "Heliotropic Engine", ["energy", "duration"], "Cụm lá xoay theo mặt trời, tạo Energy liên tục."],
      ["plant_symbiotic_lattice", "Symbiotic Lattice", ["passive", "heal-trigger"], "Mạng cộng sinh biến hồi phục thành phòng thủ."],
      ["plant_venom_orchid", "Venom Orchid", ["poison", "burst"], "Lan độc phóng một nhịp bào tử mạnh."],
    ],
    RARE: [
      ["plant_starbloom_tempest", "Starbloom Tempest", ["damage", "poison", "area"], "Bão hoa sao gây sát thương và Poison diện rộng."],
      ["plant_phoenix_seed", "Phoenix Seed", ["heal", "emergency"], "Hạt tái sinh bùng sáng khi Hull nguy cấp."],
      ["plant_worldroot_embrace", "Worldroot Embrace", ["heal", "defend", "duration"], "Rễ thế giới vừa chữa lành vừa bảo vệ."],
      ["plant_genesis_cycle", "Genesis Cycle", ["heal", "energy", "duration"], "Chu kỳ sinh trưởng kết hợp hồi phục và Energy."],
      ["plant_solar_apotheosis", "Solar Apotheosis", ["energy", "draw"], "Hoa mặt trời tích trữ năng lượng và mở lựa chọn."],
      ["plant_thorn_crown_covenant", "Thorn Crown Covenant", ["passive", "heal-trigger", "area"], "Giao ước chuyển hồi phục thành phản kích gai."],
      ["plant_verdant_singularity", "Verdant Singularity", ["summon", "core"], "Lõi xanh cô đặc dùng cho triệu hồi thực thể hỗ trợ."],
      ["plant_eclipse_orchid", "Eclipse Orchid", ["poison", "control", "rare"], "Lan nhật thực cho hiệu ứng độc và kiểm soát hiếm."],
    ],
  },
  STONE: {
    BASIC: [
      ["stone_falling_shard", "Falling Shard", ["damage", "projectile"], "Mảnh đá rơi thẳng, dùng cho sát thương đơn."],
      ["stone_plain_bulwark", "Plain Bulwark", ["defend", "shield"], "Phiến đá chắn trực diện, biểu tượng Defend cơ bản."],
      ["stone_orbit_pebbles", "Orbit Pebbles", ["defend", "duration"], "Đá nhỏ quay quanh lõi, phòng thủ theo lượt."],
      ["stone_heat_core", "Heat Core", ["energy", "gain"], "Lõi địa nhiệt phát Energy."],
      ["stone_fault_hammer", "Fault Hammer", ["damage", "fracture"], "Búa đá tạo vết nứt trên mục tiêu."],
      ["stone_locking_plates", "Locking Plates", ["defend", "buff"], "Các phiến khóa vào nhau để tăng giáp."],
      ["stone_rising_wall", "Rising Wall", ["defend", "reaction"], "Tường đá mọc lên chặn một đòn."],
      ["stone_gravity_sling", "Gravity Sling", ["damage", "control"], "Quỹ đạo đá cong biểu thị lực kéo và va chạm."],
    ],
    ADVANCED: [
      ["stone_comet_hammer", "Comet Hammer", ["damage", "heavy"], "Búa thiên thạch cho một đòn sát thương nặng."],
      ["stone_fault_barrage", "Fault Barrage", ["damage", "multi-hit", "fracture"], "Ba đợt va đập liên tiếp gây Fracture."],
      ["stone_mirror_bastion", "Mirror Bastion", ["damage", "defend"], "Khiên phản lực biến va chạm thành phòng thủ."],
      ["stone_mountain_stance", "Mountain Stance", ["defend", "duration"], "Các tầng núi khóa thành thế phòng thủ dài lượt."],
      ["stone_tectonic_pulse", "Tectonic Pulse", ["defend", "duration"], "Xung địa tầng tạo Defend mỗi lượt."],
      ["stone_furnace_reserve", "Furnace Reserve", ["energy", "defend"], "Lò lõi trữ nhiệt cho Energy và Defend."],
      ["stone_adamant_watch", "Adamant Watch", ["passive", "defend"], "Khối độc thạch canh giữ, tăng phòng thủ khi giữ trên tay."],
      ["stone_gravity_maul", "Gravity Maul", ["damage", "control"], "Chùy trọng lực kéo mảnh vỡ vào điểm va chạm."],
    ],
    RARE: [
      ["stone_extinction_array", "Extinction Array", ["damage", "area"], "Trận địa thiên thạch tấn công toàn bộ mục tiêu."],
      ["stone_planetary_anvil", "Planetary Anvil", ["damage", "fracture", "heavy"], "Đe hành tinh ép vỡ lõi mục tiêu."],
      ["stone_citadel_convergence", "Citadel Convergence", ["defend", "duration"], "Năm lớp thành lũy hội tụ thành đại khiên."],
      ["stone_eventide_armor", "Eventide Armor", ["defend", "counter"], "Giáp hoàng hôn phản hồi một phần đòn đánh."],
      ["stone_mantle_reactor", "Mantle Reactor", ["defend", "energy", "duration"], "Lõi lớp phủ cấp Energy và Defend qua nhiều lượt."],
      ["stone_immutable_law", "Immutable Law", ["passive", "damage-cap"], "Luật bất biến giới hạn sát thương nhận mỗi hit."],
      ["stone_crystal_colossus", "Crystal Colossus", ["summon", "defend"], "Cấu trúc pha lê lớn dành cho summon phòng thủ."],
      ["stone_singularity_core", "Singularity Core", ["control", "gravity", "rare"], "Lõi trọng lực hiếm kéo mọi mảnh vỡ vào tâm."],
    ],
  },
};

const tierPath: Record<ArtTier, string> = { BASIC: "basic", ADVANCED: "advanced", RARE: "rare" };
const suggestedStars: Record<ArtTier, ArtLibraryItem["suggestedStars"]> = { BASIC: "1–2★", ADVANCED: "3★", RARE: "4★" };

export const ART_LIBRARY: ArtLibraryItem[] = (Object.keys(source) as Array<keyof typeof source>).flatMap((system) =>
  (Object.keys(source[system]) as ArtTier[]).flatMap((tier) =>
    source[system][tier].map(([id, name, tags, summary]) => ({
      id,
      name,
      system,
      tier,
      suggestedStars: suggestedStars[tier],
      tags,
      path: `/assets/cards/art_library/${system.toLowerCase()}/${tierPath[tier]}/${id}_v01.png`,
      summary,
    })),
  ),
);
