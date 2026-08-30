class_name GameSession
extends Node

signal profile_changed

var registry := ContentRegistry.new()
var save_service := SaveService.new()
var economy := EconomyService.new()
var progression := ProgressionService.new()
var profile: PlayerProfileState
var active_combat: CombatController
var last_combat_result: Dictionary = {}

func _ready() -> void:
	var report := registry.load_all()
	if not report.is_valid():
		push_error("Content validation failed: %s" % " | ".join(report.errors))

func start_new_game() -> void:
	profile = PlayerProfileState.new_game()
	last_combat_result.clear()
	save()
	profile_changed.emit()

func continue_game() -> bool:
	profile = save_service.load_profile()
	if profile == null:
		return false
	profile_changed.emit()
	return true

func has_save() -> bool:
	return save_service.has_save()

func save() -> bool:
	return profile != null and save_service.save_profile(profile)

func harvest() -> Dictionary:
	var result := economy.harvest_mine(profile)
	if result.success:
		save()
		profile_changed.emit()
	return result

func upgrade_hq() -> Dictionary:
	var result := economy.upgrade_hq(profile)
	if result.success:
		save()
		profile_changed.emit()
	return result

func begin_combat(encounter_id: StringName = &"plant_foundation_encounter") -> void:
	active_combat = CombatController.new()
	active_combat.start(registry, encounter_id, 42821, 100)

func commit_combat_result(result: Dictionary) -> Dictionary:
	last_combat_result = result.duplicate(true)
	var applied := progression.apply_combat_result(profile, result)
	save()
	profile_changed.emit()
	return applied

