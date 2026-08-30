extends SceneTree

const TEST_SAVE := "user://phase1_ui_flow_save.json"

var _failures: Array[String] = []
var _checks: int = 0
var _session: GameSession

func _initialize() -> void:
	_run.call_deferred()

func _run() -> void:
	_cleanup()
	_session = get_root().get_node("Session") as GameSession
	_session.save_service = SaveService.new(TEST_SAVE)
	var root: Control = load("res://scenes/boot/game_root.tscn").instantiate() as Control
	get_root().add_child(root)
	await process_frame
	_expect(root.get_child(0).name == "MainMenu", "Game starts on Main Menu")
	root.call("_on_new_game")
	await process_frame
	_expect(root.get_child(0).name == "Home", "New Game enters PLANT Home")
	root.call("_on_harvest")
	await process_frame
	root.call("_on_upgrade")
	await process_frame
	_expect(_session.profile.base_level == 2, "Home UI commands complete harvest and upgrade")
	root.call("show_planet_select")
	await process_frame
	_expect(root.get_child(0).name == "PlanetSelect", "Home opens Planet Select")
	root.call("_on_launch", &"plant_foundation_encounter")
	await process_frame
	_expect(root.get_child(0).name == "Combat", "Launch opens Combat")
	var result := {
		"expedition_id": _session.active_combat.state.expedition_id,
		"encounter_id": "plant_foundation_encounter",
		"stage": 1,
		"outcome": "VICTORY",
		"remaining_hull": 84,
		"turn_count": 5,
		"defeated_enemy_ids": ["plant_sporeling", "plant_vine_guard", "plant_thornmaw"],
		"reward_bundle": {"resources": {"biomass": 5}},
	}
	root.call("_on_combat_finished", result)
	await process_frame
	_expect(root.get_child(0).name == "Result", "Combat result opens Result screen")
	root.call("_on_result_home")
	await process_frame
	_expect(root.get_child(0).name == "Home", "Result returns to Home")
	_expect(_session.profile.mine_ready, "Returned Home shows production ready")
	_cleanup()
	if _failures.is_empty():
		print("[PHASE 1 UI] PASS — %d checks" % _checks)
		quit(0)
	else:
		for failure: String in _failures:
			printerr("[PHASE 1 UI] FAIL — %s" % failure)
		quit(1)

func _cleanup() -> void:
	for path: String in [TEST_SAVE, TEST_SAVE + ".tmp", TEST_SAVE + ".bak"]:
		if FileAccess.file_exists(path):
			DirAccess.remove_absolute(path)

func _expect(condition: bool, message: String) -> void:
	_checks += 1
	if condition:
		print("  PASS  %s" % message)
	else:
		_failures.append(message)
