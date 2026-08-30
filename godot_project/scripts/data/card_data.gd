class_name CardData
extends Resource

@export var id: StringName
@export var display_name: String
@export var faction: StringName
@export var rarity: StringName
@export var card_type: StringName
@export var mass: int
@export var energy_cost: int
@export var target_rule: StringName
@export var art_path: String
@export var tags: Array[StringName] = []
@export var effects: Array[EffectData] = []

static func from_dictionary(source: Dictionary) -> CardData:
	var result := CardData.new()
	result.id = StringName(str(source.get("id", "")))
	result.display_name = str(source.get("name", result.id))
	result.faction = StringName(str(source.get("faction", "")))
	result.rarity = StringName(str(source.get("rarity", "")))
	result.card_type = StringName(str(source.get("type", "")))
	result.mass = int(source.get("mass", 0))
	result.energy_cost = int(source.get("energy_cost", 0))
	result.target_rule = StringName(str(source.get("target", "")))
	result.art_path = str(source.get("art_path", ""))
	for tag_value: Variant in source.get("tags", []):
		result.tags.append(StringName(str(tag_value)))
	for effect_value: Variant in source.get("effects", []):
		if effect_value is Dictionary:
			result.effects.append(EffectData.from_dictionary(effect_value))
	return result
