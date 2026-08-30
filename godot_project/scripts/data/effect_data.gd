class_name EffectData
extends Resource

@export var effect_type: StringName
@export var base_value: int = 0
@export var status_id: StringName
@export var stacks: int = 0
@export var target_override: StringName
@export var raw_payload: Dictionary = {}

static func from_dictionary(source: Dictionary) -> EffectData:
	var result := EffectData.new()
	result.effect_type = StringName(str(source.get("type", "")))
	result.base_value = int(source.get("base", source.get("value", 0)))
	result.status_id = StringName(str(source.get("status_id", "")))
	result.stacks = int(source.get("stacks", 0))
	result.target_override = StringName(str(source.get("target", "")))
	result.raw_payload = source.duplicate(true)
	return result

