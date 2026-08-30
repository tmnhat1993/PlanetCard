class_name CardInstanceState
extends RefCounted

var instance_id: StringName
var card_id: StringName

func _init(instance_id_value: StringName, card_id_value: StringName) -> void:
	instance_id = instance_id_value
	card_id = card_id_value

func snapshot() -> Dictionary:
	return {"instance_id": str(instance_id), "card_id": str(card_id)}

