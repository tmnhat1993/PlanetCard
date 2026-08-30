class_name ShipUpgradeData
extends Resource

@export var id: StringName
@export var display_name: String
@export var stat: StringName
@export var level: int
@export var value: int
@export var costs: Dictionary = {}
@export var prerequisite_ids: Array[StringName] = []

