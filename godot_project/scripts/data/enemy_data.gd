class_name EnemyData
extends Resource

@export var id: StringName
@export var display_name: String
@export var role: StringName
@export var faction: StringName
@export var max_hp: int
@export var actions: Array[EnemyActionData] = []

static func from_dictionary(source: Dictionary) -> EnemyData:
	var result := EnemyData.new()
	result.id = StringName(str(source.get("id", "")))
	result.display_name = str(source.get("name", result.id))
	result.role = StringName(str(source.get("role", "")))
	result.faction = StringName(str(source.get("faction", "")))
	result.max_hp = int(source.get("max_hp", 0))
	for action_value: Variant in source.get("actions", []):
		if action_value is Dictionary:
			result.actions.append(EnemyActionData.from_dictionary(action_value))
	return result

