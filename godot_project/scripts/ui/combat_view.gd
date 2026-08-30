extends Control

signal retreat_requested

var _controller: CombatController
var _registry: ContentRegistry
var _selected_card_id: StringName = &""
var _message: String = "SELECT A CARD"

func setup(controller: CombatController, registry: ContentRegistry) -> void:
	_controller = controller
	_registry = registry
	_controller.state_changed.connect(_render)
	_render()

func _render() -> void:
	UiFactory.clear(self)
	UiFactory.texture(self, "res://art/approved/combat/overgrown_basin_bg_v01.png", Vector2.ZERO, Vector2(960, 540))
	var shade := ColorRect.new()
	shade.color = Color(0.01, 0.04, 0.045, 0.34)
	shade.position = Vector2.ZERO
	shade.size = Vector2(960, 540)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)
	var state := _controller.state
	UiFactory.label(self, "PLANT · STAGE 01 · TURN %d" % state.turn, Vector2(315, 10), Vector2(330, 20), 11, Color("e0b85c"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "OVERGROWN BASIN", Vector2(300, 30), Vector2(360, 38), 25, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "♥ %d / %d    ◇ %d SHIELD    ☣ %d" % [state.player_hull, state.max_hull, state.player_shield, state.player_poison], Vector2(640, 18), Vector2(290, 28), 15, Color("f2ead3"), HORIZONTAL_ALIGNMENT_RIGHT)

	var enemy_positions := [Vector2(120, 115), Vector2(310, 94), Vector2(500, 115)]
	for index: int in range(state.enemies.size()):
		var enemy := state.enemies[index]
		var position: Vector2 = enemy_positions[index]
		if enemy.is_defeated():
			UiFactory.label(self, "DEFEATED", position + Vector2(0, 70), Vector2(150, 30), 12, Color("64717c"), HORIZONTAL_ALIGNMENT_CENTER)
			continue
		var enemy_button := Button.new()
		enemy_button.position = position
		enemy_button.size = Vector2(150, 170)
		enemy_button.text = ""
		enemy_button.tooltip_text = "Target %s" % enemy.display_name
		enemy_button.pressed.connect(_on_enemy_pressed.bind(enemy.runtime_id))
		add_child(enemy_button)
		UiFactory.texture(enemy_button, "res://art/approved/combat/plant_dummy_enemy_v01.png", Vector2(20, 12), Vector2(110, 100), TextureRect.EXPAND_IGNORE_SIZE, TextureRect.STRETCH_KEEP_ASPECT_CENTERED)
		UiFactory.label(enemy_button, str(enemy.intent.get("label", "?")), Vector2(6, 2), Vector2(138, 24), 11, Color("f4e38b"), HORIZONTAL_ALIGNMENT_CENTER)
		UiFactory.label(enemy_button, enemy.display_name, Vector2(4, 115), Vector2(142, 24), 14, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)
		UiFactory.label(enemy_button, "♥ %d / %d" % [enemy.hp, enemy.max_hp], Vector2(4, 139), Vector2(142, 23), 13, Color("d85b52"), HORIZONTAL_ALIGNMENT_CENTER)

	UiFactory.texture(self, "res://art/approved/combat/stone_battleship_v01.png", Vector2(655, 95), Vector2(270, 180), TextureRect.EXPAND_IGNORE_SIZE, TextureRect.STRETCH_KEEP_ASPECT_CENTERED)
	UiFactory.panel(self, Vector2(18, 464), Vector2(110, 58), Color("172331dd"), Color("e0b85c"))
	UiFactory.label(self, "ENERGY", Vector2(18, 467), Vector2(110, 18), 10, Color("e0b85c"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "%d / %d" % [state.energy, state.reactor], Vector2(18, 484), Vector2(110, 34), 22, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)

	var hand_x := 144.0
	for card_instance: CardInstanceState in state.hand:
		var card := _registry.get_card(card_instance.card_id)
		var selected := card_instance.instance_id == _selected_card_id
		var card_button := Button.new()
		card_button.position = Vector2(hand_x, 350 if not selected else 336)
		card_button.size = Vector2(118, 174)
		card_button.disabled = state.energy < card.energy_cost
		card_button.pressed.connect(_on_card_pressed.bind(card_instance.instance_id))
		add_child(card_button)
		var border := ColorRect.new()
		border.color = Color("e0b85c" if selected else "263646")
		border.position = Vector2(4, 4)
		border.size = Vector2(110, 166)
		border.mouse_filter = Control.MOUSE_FILTER_IGNORE
		card_button.add_child(border)
		UiFactory.texture(card_button, card.art_path, Vector2(7, 7), Vector2(104, 101), TextureRect.EXPAND_IGNORE_SIZE, TextureRect.STRETCH_KEEP_ASPECT_COVERED)
		UiFactory.label(card_button, str(card.energy_cost), Vector2(7, 7), Vector2(24, 24), 15, Color("f4e38b"), HORIZONTAL_ALIGNMENT_CENTER)
		UiFactory.label(card_button, card.display_name, Vector2(8, 111), Vector2(102, 40), 13, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)
		UiFactory.label(card_button, "TARGET" if card.target_rule == &"SINGLE_ENEMY" else "SELF", Vector2(8, 148), Vector2(102, 18), 9, Color("aebac3"), HORIZONTAL_ALIGNMENT_CENTER)
		hand_x += 124.0

	UiFactory.button(self, "END TURN", Vector2(824, 464), Vector2(118, 58), _on_end_turn)
	UiFactory.label(self, _message, Vector2(650, 316), Vector2(280, 24), 11, Color("f4e38b"), HORIZONTAL_ALIGNMENT_RIGHT)
	UiFactory.button(self, "RETREAT", Vector2(18, 18), Vector2(90, 30), func() -> void: retreat_requested.emit())

func _on_card_pressed(instance_id: StringName) -> void:
	var instance := _controller.state.hand.filter(func(card: CardInstanceState) -> bool: return card.instance_id == instance_id)[0] as CardInstanceState
	var data := _registry.get_card(instance.card_id)
	if data.target_rule == &"SELF":
		var result := _controller.play_card(instance_id)
		_message = "CARD PLAYED" if result.success else str(result.error)
		_selected_card_id = &""
	else:
		_selected_card_id = instance_id
		_message = "SELECT AN ENEMY TARGET"
		_render()

func _on_enemy_pressed(runtime_id: StringName) -> void:
	if _selected_card_id == &"":
		_message = "SELECT A CARD FIRST"
		_render()
		return
	var result := _controller.play_card(_selected_card_id, runtime_id)
	_message = "CARD PLAYED" if result.success else str(result.error)
	_selected_card_id = &""

func _on_end_turn() -> void:
	_selected_card_id = &""
	_message = "ENEMY ACTIONS RESOLVED"
	_controller.end_turn()

