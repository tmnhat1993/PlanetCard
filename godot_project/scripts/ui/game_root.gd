extends Control

const MAIN_MENU_SCENE := preload("res://scenes/main_menu/main_menu.tscn")
const HOME_SCENE := preload("res://scenes/home/home.tscn")
const PLANET_SELECT_SCENE := preload("res://scenes/planet_select/planet_select.tscn")
const COMBAT_SCENE := preload("res://scenes/combat/combat.tscn")
const RESULT_SCENE := preload("res://scenes/result/result.tscn")

var _current_screen: Control
var _tokens := UiTokenStore.new()

func _ready() -> void:
	_tokens.load_tokens()
	theme = UiThemeFactory.create(_tokens)
	show_main_menu()

func show_main_menu() -> void:
	var screen := _swap(MAIN_MENU_SCENE)
	screen.setup(Session.has_save())
	screen.connect("new_game_requested", _on_new_game)
	screen.connect("continue_requested", _on_continue)
	screen.connect("exit_requested", _on_exit)

func show_home(message: String = "") -> void:
	var screen := _swap(HOME_SCENE)
	screen.setup(Session.profile, Session.economy, message)
	screen.connect("harvest_requested", _on_harvest)
	screen.connect("upgrade_requested", _on_upgrade)
	screen.connect("planet_select_requested", show_planet_select)
	screen.connect("menu_requested", show_main_menu)

func show_planet_select() -> void:
	var screen := _swap(PLANET_SELECT_SCENE)
	screen.setup(Session.profile)
	screen.connect("launch_requested", _on_launch)
	screen.connect("home_requested", show_home)

func _on_new_game() -> void:
	Session.start_new_game()
	show_home("WELCOME TO VERDANT HAVEN")

func _on_continue() -> void:
	if Session.continue_game():
		show_home("PROFILE RESTORED")
	else:
		show_main_menu()

func _on_exit() -> void:
	get_tree().quit()

func _on_harvest() -> void:
	var result := Session.harvest()
	show_home("HARVESTED +%d BIOMASS" % result.amount if result.success else "BIO FARM IS NOT READY")

func _on_upgrade() -> void:
	var result := Session.upgrade_hq()
	show_home("HQ UPGRADED TO LEVEL %d" % result.base_level if result.success else "NOT ENOUGH BIOMASS")

func _on_launch(encounter_id: StringName) -> void:
	Session.begin_combat(encounter_id)
	Session.active_combat.combat_finished.connect(_on_combat_finished)
	var screen := _swap(COMBAT_SCENE)
	screen.setup(Session.active_combat, Session.registry)
	screen.connect("retreat_requested", show_planet_select)

func _on_combat_finished(result: Dictionary) -> void:
	var application := Session.commit_combat_result(result)
	var screen := _swap(RESULT_SCENE)
	screen.setup(result, application, Session.profile)
	screen.connect("home_requested", _on_result_home)
	screen.connect("map_requested", show_planet_select)

func _on_result_home() -> void:
	show_home("EXPEDITION REWARD APPLIED")

func _swap(scene: PackedScene) -> Control:
	if _current_screen != null:
		_current_screen.queue_free()
	_current_screen = scene.instantiate() as Control
	add_child(_current_screen)
	return _current_screen

