extends SceneTree

func _initialize() -> void:
	var root := Control.new()
	root.size = Vector2(960, 540)
	var tokens := UiTokenStore.new()
	tokens.load_tokens()
	root.theme = UiThemeFactory.create(tokens)
	get_root().add_child(root)
	var screen_name := OS.get_environment("PHASE1_CAPTURE_SCREEN")
	match screen_name:
		"home":
			var view: Control = load("res://scenes/home/home.tscn").instantiate() as Control
			root.add_child(view)
			view.setup(PlayerProfileState.new_game(), EconomyService.new(), "READY FOR EXPEDITION")
		"planet_select":
			var view: Control = load("res://scenes/planet_select/planet_select.tscn").instantiate() as Control
			root.add_child(view)
			view.setup(PlayerProfileState.new_game())
		"combat":
			var registry := ContentRegistry.new()
			registry.load_all()
			var controller := CombatController.new()
			controller.start(registry, &"plant_foundation_encounter", 42821, 84)
			var view: Control = load("res://scenes/combat/combat.tscn").instantiate() as Control
			root.add_child(view)
			view.setup(controller, registry)
		"result":
			var profile := PlayerProfileState.new_game()
			profile.mine_ready = true
			var result := {
				"outcome": "VICTORY",
				"turn_count": 5,
				"remaining_hull": 84,
				"defeated_enemy_ids": ["plant_sporeling", "plant_vine_guard", "plant_thornmaw"],
				"reward_bundle": {"resources": {"biomass": 5}},
			}
			var view: Control = load("res://scenes/result/result.tscn").instantiate() as Control
			root.add_child(view)
			view.setup(result, {"already_applied": false}, profile)
		_:
			push_error("Unknown PHASE1_CAPTURE_SCREEN: %s" % screen_name)
