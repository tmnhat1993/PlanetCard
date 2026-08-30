class_name StatusData
extends Resource

@export var id: StringName
@export var display_name: String
@export var stack_mode: StringName
@export var max_stacks: int = -1
@export var duration_type: StringName
@export var tick_timing: StringName
@export var persists_between_encounters: bool

static func from_dictionary(source: Dictionary) -> StatusData:
	var result := StatusData.new()
	result.id = StringName(str(source.get("id", "")))
	result.display_name = str(source.get("name", result.id))
	result.stack_mode = StringName(str(source.get("stack_mode", "")))
	result.max_stacks = int(source.get("max_stacks", -1)) if source.get("max_stacks") != null else -1
	result.duration_type = StringName(str(source.get("duration_type", "")))
	result.tick_timing = StringName(str(source.get("tick_timing", "NONE")))
	result.persists_between_encounters = bool(source.get("persists_between_encounters", false))
	return result

