class_name RuntimeIdFactory
extends RefCounted

var _namespace: String
var _counter: int = 0

func _init(namespace_value: String = "runtime") -> void:
	_namespace = namespace_value.to_snake_case()

func next_id(kind: StringName) -> StringName:
	_counter += 1
	return StringName("%s:%s:%06d" % [_namespace, kind, _counter])

func reset() -> void:
	_counter = 0

