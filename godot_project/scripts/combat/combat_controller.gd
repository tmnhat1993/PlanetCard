class_name CombatController
extends RefCounted

signal state_changed
signal combat_finished(result: Dictionary)

const STARTER_DECK: Array[StringName] = [
	&"plant_thorn_snap", &"plant_thorn_snap", &"plant_thorn_snap",
	&"plant_barkskin", &"plant_barkskin",
	&"plant_bloom_mend", &"plant_bloom_mend",
	&"plant_regrowth_cycle",
	&"plant_sap_leech", &"plant_sap_leech",
]

var registry: ContentRegistry
var state: CombatState
var events := StructuredLog.new()
var rng: NamedRng
var _ids: RuntimeIdFactory

func start(content: ContentRegistry, encounter_id: StringName, seed_value: int, starting_hull: int) -> void:
	registry = content
	rng = NamedRng.new(seed_value)
	state = CombatState.new()
	state.seed = seed_value
	state.encounter_id = encounter_id
	state.expedition_id = "plant_run_%d" % seed_value
	state.player_hull = starting_hull
	state.max_hull = 100
	_ids = RuntimeIdFactory.new(state.expedition_id)
	for card_id: StringName in STARTER_DECK:
		state.draw_pile.append(CardInstanceState.new(_ids.next_id(&"card"), card_id))
	_shuffle(state.draw_pile)
	_build_enemies(registry.get_encounter(encounter_id))
	_plan_enemy_intents()
	_draw_to(5)
	events.append(&"COMBAT_STARTED", state.snapshot())
	state_changed.emit()

func play_card(card_instance_id: StringName, target_runtime_id: StringName = &"") -> Dictionary:
	if state.phase != &"PLAYER_ACTION" or state.outcome != &"":
		return {"success": false, "error": "INVALID_PHASE"}
	var card_instance := _find_hand_card(card_instance_id)
	if card_instance == null:
		return {"success": false, "error": "CARD_NOT_IN_HAND"}
	var card := registry.get_card(card_instance.card_id)
	if state.energy < card.energy_cost:
		return {"success": false, "error": "INSUFFICIENT_ENERGY"}
	var target: CombatEntityState
	if card.target_rule == &"SINGLE_ENEMY":
		target = _find_enemy(target_runtime_id)
		if target == null or target.is_defeated():
			return {"success": false, "error": "INVALID_TARGET"}
	state.energy -= card.energy_cost
	events.append(&"CARD_PLAY_STARTED", {"card": str(card.id), "target": str(target_runtime_id)})
	for effect: EffectData in card.effects:
		_resolve_effect(effect, target)
		if _check_end_state():
			break
	state.hand.erase(card_instance)
	state.discard_pile.append(card_instance)
	events.append(&"CARD_PLAY_COMPLETED", {"card": str(card.id)})
	state_changed.emit()
	return {"success": true}

func end_turn() -> Dictionary:
	if state.phase != &"PLAYER_ACTION" or state.outcome != &"":
		return {"success": false, "error": "INVALID_PHASE"}
	state.phase = &"ENEMY_ACTION"
	if state.player_poison > 0:
		_damage_player(state.player_poison, true)
	for card: CardInstanceState in state.hand.duplicate():
		state.hand.erase(card)
		state.discard_pile.append(card)
	for enemy: CombatEntityState in state.enemies:
		if enemy.is_defeated() or _check_end_state():
			continue
		_resolve_enemy_intent(enemy)
	if _check_end_state():
		state_changed.emit()
		return {"success": true}
	state.turn += 1
	state.energy = state.reactor
	state.phase = &"PLAYER_ACTION"
	_plan_enemy_intents()
	_draw_to(5)
	events.append(&"TURN_STARTED", {"turn": state.turn})
	state_changed.emit()
	return {"success": true}

func _build_enemies(encounter: EncounterData) -> void:
	for slot: Dictionary in encounter.enemy_slots:
		var data := registry.get_enemy(StringName(str(slot.enemy_id)))
		var enemy := CombatEntityState.new()
		enemy.runtime_id = _ids.next_id(&"enemy")
		enemy.data_id = data.id
		enemy.display_name = data.display_name
		enemy.max_hp = data.max_hp
		enemy.hp = data.max_hp
		state.enemies.append(enemy)

func _plan_enemy_intents() -> void:
	for enemy: CombatEntityState in state.enemies:
		if enemy.is_defeated():
			continue
		var data := registry.get_enemy(enemy.data_id)
		var action := data.actions[0]
		var effect := action.effects[0]
		if effect.effect_type == &"DAMAGE":
			enemy.intent = {"type": "ATTACK", "label": "ATTACK %d" % effect.base_value, "value": effect.base_value}
		elif effect.effect_type == &"APPLY_STATUS":
			enemy.intent = {"type": "STATUS", "label": "POISON %d" % effect.stacks, "value": effect.stacks}
		else:
			enemy.intent = {"type": "UNKNOWN", "label": str(action.id), "value": 0}

func _resolve_enemy_intent(enemy: CombatEntityState) -> void:
	match str(enemy.intent.get("type", "")):
		"ATTACK":
			_damage_player(int(enemy.intent.value), false)
		"STATUS":
			state.player_poison += int(enemy.intent.value)
	events.append(&"ENEMY_ACTION_RESOLVED", {"enemy": str(enemy.data_id), "intent": enemy.intent.duplicate()})

func _resolve_effect(effect: EffectData, target: CombatEntityState) -> void:
	match effect.effect_type:
		&"DAMAGE":
			if target != null:
				_damage_enemy(target, effect.base_value)
		&"GAIN_SHIELD":
			state.player_shield += effect.base_value
		&"HEAL_HULL":
			state.player_hull = mini(state.max_hull, state.player_hull + effect.base_value)
		&"DRAW":
			_draw_cards(effect.base_value)
		&"APPLY_STATUS":
			if target != null:
				target.statuses[str(effect.status_id)] = int(target.statuses.get(str(effect.status_id), 0)) + effect.stacks
	events.append(&"EFFECT_RESOLVED", {"type": str(effect.effect_type), "base": effect.base_value})

func _damage_enemy(target: CombatEntityState, amount: int) -> void:
	var remaining := amount
	var shield_damage := mini(target.shield, remaining)
	target.shield -= shield_damage
	remaining -= shield_damage
	target.hp = maxi(0, target.hp - remaining)

func _damage_player(amount: int, direct: bool) -> void:
	var remaining := amount
	if not direct:
		var shield_damage := mini(state.player_shield, remaining)
		state.player_shield -= shield_damage
		remaining -= shield_damage
	state.player_hull = maxi(0, state.player_hull - remaining)

func _draw_to(target_size: int) -> void:
	_draw_cards(maxi(0, target_size - state.hand.size()))

func _draw_cards(amount: int) -> void:
	for unused: int in range(amount):
		if state.hand.size() >= 10:
			break
		if state.draw_pile.is_empty():
			if state.discard_pile.is_empty():
				break
			state.draw_pile.assign(state.discard_pile)
			state.discard_pile.clear()
			_shuffle(state.draw_pile)
		state.hand.append(state.draw_pile.pop_back())

func _shuffle(cards: Array[CardInstanceState]) -> void:
	for index: int in range(cards.size() - 1, 0, -1):
		var swap_index := rng.sample_int(&"DECK", 0, index)
		var temporary := cards[index]
		cards[index] = cards[swap_index]
		cards[swap_index] = temporary

func _find_hand_card(instance_id: StringName) -> CardInstanceState:
	for card: CardInstanceState in state.hand:
		if card.instance_id == instance_id:
			return card
	return null

func _find_enemy(runtime_id: StringName) -> CombatEntityState:
	for enemy: CombatEntityState in state.enemies:
		if enemy.runtime_id == runtime_id:
			return enemy
	return null

func _check_end_state() -> bool:
	if state.living_enemies().is_empty():
		_finish(&"VICTORY")
		return true
	if state.player_hull <= 0:
		_finish(&"DEFEAT")
		return true
	return false

func _finish(outcome: StringName) -> void:
	if state.outcome != &"":
		return
	state.outcome = outcome
	state.phase = &"FINISHED"
	var result := {
		"result_version": 1,
		"expedition_id": state.expedition_id,
		"encounter_id": str(state.encounter_id),
		"stage": 1,
		"outcome": str(outcome),
		"remaining_hull": state.player_hull,
		"turn_count": state.turn,
		"expedition_steps": 1 if outcome == &"VICTORY" else 0,
		"defeated_enemy_ids": state.enemies.filter(func(enemy: CombatEntityState) -> bool: return enemy.is_defeated()).map(func(enemy: CombatEntityState) -> String: return str(enemy.data_id)),
		"reward_bundle": {"resources": {"biomass": 5 if outcome == &"VICTORY" else 0}},
	}
	events.append(&"COMBAT_FINISHED", result)
	combat_finished.emit(result)

