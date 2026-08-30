class_name StructuredLog
extends RefCounted

var events: Array[Dictionary] = []
var _sequence: int = 0

func append(event_type: StringName, payload: Dictionary = {}) -> Dictionary:
	_sequence += 1
	var event := {
		"sequence": _sequence,
		"type": str(event_type),
		"payload": payload.duplicate(true),
	}
	events.append(event)
	return event

func clear() -> void:
	events.clear()
	_sequence = 0

func to_json() -> String:
	return JSON.stringify(events, "  ")

