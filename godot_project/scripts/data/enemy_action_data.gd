class_name EnemyActionData
extends Resource

@export var id: StringName
@export var weight: int = 1
@export var effects: Array[EffectData] = []

static func from_dictionary(source: Dictionary) -> EnemyActionData:
	var result := EnemyActionData.new()
	result.id = StringName(str(source.get("id", "")))
	result.weight = int(source.get("weight", 1))
	for effect_value: Variant in source.get("effects", []):
		if effect_value is Dictionary:
			result.effects.append(EffectData.from_dictionary(effect_value))
	return result

