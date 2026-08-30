class_name CombatState
extends RefCounted

var seed: int
var encounter_id: StringName
var expedition_id: String
var player_hull: int = 100
var max_hull: int = 100
var player_shield: int = 0
var player_poison: int = 0
var reactor: int = 3
var energy: int = 3
var turn: int = 1
var phase: StringName = &"PLAYER_ACTION"
var draw_pile: Array[CardInstanceState] = []
var hand: Array[CardInstanceState] = []
var discard_pile: Array[CardInstanceState] = []
var enemies: Array[CombatEntityState] = []
var outcome: StringName = &""

static func create_fixture(registry: ContentRegistry, seed_value: int) -> CombatState:
	var result := CombatState.new()
	result.seed = seed_value
	result.expedition_id = "fixture_%d" % seed_value
	var factory := RuntimeIdFactory.new(result.expedition_id)
	var card_ids: Array = registry.cards.keys()
	card_ids.sort()
	for card_id: StringName in card_ids:
		result.draw_pile.append(CardInstanceState.new(factory.next_id(&"card"), card_id))
	var enemy_ids: Array = registry.enemies.keys()
	enemy_ids.sort()
	for enemy_id: StringName in enemy_ids:
		var data := registry.get_enemy(enemy_id)
		var enemy := CombatEntityState.new()
		enemy.runtime_id = factory.next_id(&"enemy")
		enemy.data_id = data.id
		enemy.display_name = data.display_name
		enemy.max_hp = data.max_hp
		enemy.hp = data.max_hp
		result.enemies.append(enemy)
	return result

func living_enemies() -> Array[CombatEntityState]:
	var result: Array[CombatEntityState] = []
	for enemy: CombatEntityState in enemies:
		if not enemy.is_defeated():
			result.append(enemy)
	return result

func snapshot() -> Dictionary:
	return {
		"seed": seed,
		"encounter_id": str(encounter_id),
		"expedition_id": expedition_id,
		"player_hull": player_hull,
		"max_hull": max_hull,
		"player_shield": player_shield,
		"player_poison": player_poison,
		"reactor": reactor,
		"energy": energy,
		"turn": turn,
		"phase": str(phase),
		"draw_pile": draw_pile.map(func(card: CardInstanceState) -> Dictionary: return card.snapshot()),
		"hand": hand.map(func(card: CardInstanceState) -> Dictionary: return card.snapshot()),
		"discard_pile": discard_pile.map(func(card: CardInstanceState) -> Dictionary: return card.snapshot()),
		"enemies": enemies.map(func(enemy: CombatEntityState) -> Dictionary: return enemy.snapshot()),
		"outcome": str(outcome),
	}

