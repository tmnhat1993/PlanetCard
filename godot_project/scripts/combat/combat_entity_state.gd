class_name CombatEntityState
extends RefCounted

var runtime_id: StringName
var data_id: StringName
var display_name: String
var hp: int
var max_hp: int
var shield: int = 0
var statuses: Dictionary = {}
var intent: Dictionary = {}

func is_defeated() -> bool:
	return hp <= 0

func snapshot() -> Dictionary:
	return {
		"runtime_id": str(runtime_id),
		"data_id": str(data_id),
		"display_name": display_name,
		"hp": hp,
		"max_hp": max_hp,
		"shield": shield,
		"statuses": statuses.duplicate(true),
		"intent": intent.duplicate(true),
		"defeated": is_defeated(),
	}

