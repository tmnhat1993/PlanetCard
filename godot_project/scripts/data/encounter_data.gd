class_name EncounterData
extends Resource

@export var id: StringName
@export var planet_id: StringName
@export var stage: int
@export var enemy_slots: Array[Dictionary] = []
@export var intel_tags: Array[StringName] = []

static func from_dictionary(source: Dictionary) -> EncounterData:
	var result := EncounterData.new()
	result.id = StringName(str(source.get("id", "")))
	result.planet_id = StringName(str(source.get("planet_id", "")))
	result.stage = int(source.get("stage", 0))
	for slot_value: Variant in source.get("enemy_slots", []):
		if slot_value is Dictionary:
			result.enemy_slots.append(slot_value.duplicate(true))
	for tag_value: Variant in source.get("intel_tags", []):
		result.intel_tags.append(StringName(str(tag_value)))
	return result

