extends SceneTree

const TEST_SAVE := "user://phase1_test_save.json"

var _failures: Array[String] = []
var _checks: int = 0

func _initialize() -> void:
	print("[PHASE 1] Running basic playable-slice verification")
	_cleanup_save()
	_test_base_loop()
	_test_save_round_trip()
	_test_combat_determinism_and_effects()
	_test_complete_journey_and_idempotency()
	_cleanup_save()
	if _failures.is_empty():
		print("[PHASE 1] PASS — %d checks" % _checks)
		quit(0)
	else:
		for failure: String in _failures:
			printerr("[PHASE 1] FAIL — %s" % failure)
		printerr("[PHASE 1] FAILED — %d check(s), %d failure(s)" % [_checks, _failures.size()])
		quit(1)

func _test_base_loop() -> void:
	var profile := PlayerProfileState.new_game()
	var economy := EconomyService.new()
	var harvest := economy.harvest_mine(profile)
	_expect(harvest.success and harvest.amount == 10, "Ready Bio Farm should harvest 10 Biomass")
	_expect(profile.biomass == 30 and not profile.mine_ready, "Harvest should update balance and consume ready state")
	var duplicate_harvest := economy.harvest_mine(profile)
	_expect(not duplicate_harvest.success and duplicate_harvest.error == "MINE_NOT_READY", "Empty Bio Farm should reject repeat harvest")
	var upgrade := economy.upgrade_hq(profile)
	_expect(upgrade.success and profile.base_level == 2, "30 Biomass should purchase the first HQ upgrade")
	_expect(profile.biomass == 5 and profile.mine_yield == 15, "HQ upgrade should spend 25 and improve yield by 5")

func _test_save_round_trip() -> void:
	var service := SaveService.new(TEST_SAVE)
	var profile := PlayerProfileState.new_game()
	profile.biomass = 47
	profile.base_level = 3
	profile.mine_ready = false
	_expect(service.save_profile(profile), "Profile should save through temporary verification and commit")
	var loaded := service.load_profile()
	_expect(loaded != null, "Saved profile should load")
	_expect(loaded.biomass == 47 and loaded.base_level == 3 and not loaded.mine_ready, "Save round trip should preserve Base state")

func _test_combat_determinism_and_effects() -> void:
	var registry := ContentRegistry.new()
	var report := registry.load_all()
	_expect(report.is_valid(), "Phase 1 content should validate")
	var first := CombatController.new()
	var second := CombatController.new()
	first.start(registry, &"plant_foundation_encounter", 42821, 100)
	second.start(registry, &"plant_foundation_encounter", 42821, 100)
	_expect(first.state.snapshot() == second.state.snapshot(), "Same request and seed should create identical combat state")

	var damage_card := _move_card_to_hand(first, &"plant_thorn_snap")
	var target := first.state.living_enemies()[0]
	var hp_before := target.hp
	var damage_result := first.play_card(damage_card.instance_id, target.runtime_id)
	_expect(damage_result.success and target.hp == hp_before - 7, "Thorn Snap should spend Energy and deal 7 damage")

	var shield_card := _move_card_to_hand(first, &"plant_barkskin")
	first.state.energy = 3
	var shield_result := first.play_card(shield_card.instance_id)
	_expect(shield_result.success and first.state.player_shield == 7, "Barkskin should gain 7 Shield")

	first.state.player_hull = 80
	var heal_card := _move_card_to_hand(first, &"plant_bloom_mend")
	first.state.energy = 3
	first.play_card(heal_card.instance_id)
	_expect(first.state.player_hull == 85, "Bloom Mend should restore 5 Hull")

	var draw_card := _move_card_to_hand(first, &"plant_regrowth_cycle")
	first.state.energy = 3
	var hand_before_draw := first.state.hand.size()
	first.play_card(draw_card.instance_id)
	_expect(first.state.hand.size() == hand_before_draw + 1, "Regrowth Cycle should draw two then discard itself")
	_expect(not first.state.enemies[0].intent.is_empty(), "Every living enemy should expose its next intent")

	var defeat := CombatController.new()
	defeat.start(registry, &"plant_foundation_encounter", 42821, 1)
	defeat.end_turn()
	_expect(defeat.state.outcome == &"DEFEAT", "Enemy phase should produce a deterministic defeat when Hull reaches zero")

func _test_complete_journey_and_idempotency() -> void:
	var profile := PlayerProfileState.new_game()
	var economy := EconomyService.new()
	economy.harvest_mine(profile)
	economy.upgrade_hq(profile)
	_expect(profile.base_level == 2, "Journey should allow harvest then HQ upgrade")

	var registry := ContentRegistry.new()
	registry.load_all()
	var combat := CombatController.new()
	combat.start(registry, &"plant_foundation_encounter", 42821, 100)
	var guard := 0
	while combat.state.outcome == &"" and guard < 30:
		guard += 1
		_play_automatic_turn(combat, registry)
	_expect(combat.state.outcome == &"VICTORY", "Starter deck should defeat the Phase 1 encounter")
	var result := _result_from_combat(combat)
	var progression := ProgressionService.new()
	var before_reward := profile.biomass
	var first_apply := progression.apply_combat_result(profile, result)
	_expect(first_apply.success and not first_apply.already_applied, "Victory reward should apply once")
	_expect(profile.biomass == before_reward + 5, "Victory should grant 5 Biomass")
	_expect(profile.mine_ready and profile.production_cycle == 2, "Victory should advance production and ready the Bio Farm")
	var balance_after_first := profile.biomass
	var second_apply := progression.apply_combat_result(profile, result)
	_expect(second_apply.already_applied and profile.biomass == balance_after_first, "Retrying the same result must not duplicate reward")

func _play_automatic_turn(combat: CombatController, registry: ContentRegistry) -> void:
	while combat.state.energy > 0 and combat.state.outcome == &"":
		var playable: CardInstanceState
		for card_instance: CardInstanceState in combat.state.hand:
			var data := registry.get_card(card_instance.card_id)
			if data.energy_cost <= combat.state.energy and (data.card_type == &"ATTACK" or data.id == &"plant_barkskin"):
				playable = card_instance
				break
		if playable == null:
			break
		var card := registry.get_card(playable.card_id)
		if card.target_rule == &"SINGLE_ENEMY":
			var target := combat.state.living_enemies()[0]
			combat.play_card(playable.instance_id, target.runtime_id)
		else:
			combat.play_card(playable.instance_id)
	if combat.state.outcome == &"":
		combat.end_turn()

func _move_card_to_hand(combat: CombatController, card_id: StringName) -> CardInstanceState:
	for card: CardInstanceState in combat.state.hand:
		if card.card_id == card_id:
			return card
	for card: CardInstanceState in combat.state.draw_pile:
		if card.card_id == card_id:
			combat.state.draw_pile.erase(card)
			combat.state.hand.append(card)
			return card
	for card: CardInstanceState in combat.state.discard_pile:
		if card.card_id == card_id:
			combat.state.discard_pile.erase(card)
			combat.state.hand.append(card)
			return card
	return null

func _result_from_combat(combat: CombatController) -> Dictionary:
	return {
		"result_version": 1,
		"expedition_id": combat.state.expedition_id,
		"encounter_id": str(combat.state.encounter_id),
		"stage": 1,
		"outcome": str(combat.state.outcome),
		"remaining_hull": combat.state.player_hull,
		"turn_count": combat.state.turn,
		"expedition_steps": 1,
		"defeated_enemy_ids": combat.state.enemies.map(func(enemy: CombatEntityState) -> String: return str(enemy.data_id)),
		"reward_bundle": {"resources": {"biomass": 5}},
	}

func _cleanup_save() -> void:
	for path: String in [TEST_SAVE, TEST_SAVE + ".tmp", TEST_SAVE + ".bak"]:
		if FileAccess.file_exists(path):
			DirAccess.remove_absolute(path)

func _expect(condition: bool, message: String) -> void:
	_checks += 1
	if condition:
		print("  PASS  %s" % message)
	else:
		_failures.append(message)
