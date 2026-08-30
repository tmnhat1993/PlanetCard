extends Control

var _tokens := UiTokenStore.new()
var _registry := ContentRegistry.new()
var _event_log := StructuredLog.new()
var _details_label: Label

func _ready() -> void:
	_tokens.load_tokens()
	theme = UiThemeFactory.create(_tokens)
	_build_background()
	_build_fixture_gallery()

func _build_background() -> void:
	var background := ColorRect.new()
	background.color = _tokens.color("background", Color("10151d"))
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(background)
	move_child(background, 0)

func _build_fixture_gallery() -> void:
	var safe_margin := _tokens.spacing("lg", 16)
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", safe_margin)
	margin.add_theme_constant_override("margin_top", safe_margin)
	margin.add_theme_constant_override("margin_right", safe_margin)
	margin.add_theme_constant_override("margin_bottom", safe_margin)
	add_child(margin)

	var page := VBoxContainer.new()
	margin.add_child(page)

	var header := HBoxContainer.new()
	page.add_child(header)
	var title_stack := VBoxContainer.new()
	title_stack.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(title_stack)
	title_stack.add_child(_label("PHASE 0 · FOUNDATION", "caption", _tokens.color("accent")))
	title_stack.add_child(_label("Godot Fixture Gallery", "display"))
	var dev_badge := _label("DEV BUILD", "label", _tokens.color("focus"))
	header.add_child(dev_badge)

	var body := HBoxContainer.new()
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	page.add_child(body)
	body.add_child(_build_validation_panel())
	body.add_child(_build_component_panel())

	var footer := _label("Reference viewport 960×540 · UI spec revision 1 · production renderer: Godot", "caption", _tokens.color("text_secondary"))
	page.add_child(footer)

func _build_validation_panel() -> Control:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var content := VBoxContainer.new()
	panel.add_child(content)
	content.add_child(_label("FOUNDATION STATUS", "heading"))

	var report := _registry.load_all()
	var counts := _registry.counts()
	_event_log.append(&"CONTENT_VALIDATED", {"valid": report.is_valid(), "counts": counts})
	var status_color := _tokens.color("success") if report.is_valid() else _tokens.color("danger")
	content.add_child(_label("● %s" % ("VALID" if report.is_valid() else "INVALID"), "number", status_color))
	content.add_child(_label("%d cards · %d enemies · %d statuses · %d encounter" % [counts.cards, counts.enemies, counts.statuses, counts.encounters], "body"))

	var rng := NamedRng.new(42821)
	var samples := [
		rng.sample_int(&"DECK", 0, 999),
		rng.sample_int(&"ENEMY", 0, 999),
		rng.sample_int(&"EFFECT", 0, 999),
		rng.sample_int(&"REWARD", 0, 999),
	]
	_event_log.append(&"RNG_SAMPLED", {"seed": 42821, "samples": samples})
	content.add_child(_label("SEED 42821", "label", _tokens.color("text_secondary")))
	content.add_child(_label("Named streams  %s" % str(samples), "body"))

	_details_label = _label("Structured events: %d" % _event_log.events.size(), "body", _tokens.color("text_secondary"))
	_details_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(_details_label)
	if not report.is_valid():
		_details_label.text = "\n".join(report.errors)
	return panel

func _build_component_panel() -> Control:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var content := VBoxContainer.new()
	panel.add_child(content)
	content.add_child(_label("UI TOKEN SMOKE TEST", "heading"))
	content.add_child(_label("Reusable primitives begin here. Gameplay views will consume read-only projections.", "body", _tokens.color("text_secondary")))

	var resource_row := HBoxContainer.new()
	content.add_child(resource_row)
	resource_row.add_child(_label("BIOMASS", "label", _tokens.color("success")))
	resource_row.add_child(_label("86", "number"))
	var status_chip := _label("READY", "label", _tokens.color("focus"))
	resource_row.add_child(status_chip)

	var progress := ProgressBar.new()
	progress.value = 64
	progress.show_percentage = true
	progress.custom_minimum_size.y = 22
	content.add_child(progress)

	var buttons := HBoxContainer.new()
	content.add_child(buttons)
	var primary := Button.new()
	primary.text = "RUN FIXTURE"
	primary.custom_minimum_size.y = 32
	primary.pressed.connect(_on_run_fixture_pressed)
	buttons.add_child(primary)
	var disabled := Button.new()
	disabled.text = "LOCKED"
	disabled.disabled = true
	disabled.custom_minimum_size.y = 32
	buttons.add_child(disabled)
	return panel

func _label(text_value: String, role: String, color_value: Color = Color.WHITE) -> Label:
	var result := Label.new()
	result.text = text_value
	result.add_theme_color_override("font_color", color_value)
	result.add_theme_font_size_override("font_size", _tokens.font_size(role, 14))
	return result

func _on_run_fixture_pressed() -> void:
	var factory := RuntimeIdFactory.new("phase0")
	var state := CombatState.create_fixture(_registry, 42821)
	_event_log.append(&"FIXTURE_STATE_CREATED", {
		"runtime_id": str(factory.next_id(&"combat")),
		"state": state.snapshot(),
	})
	_details_label.text = "Fixture created · %d structured events · deterministic seed %d" % [_event_log.events.size(), state.seed]

