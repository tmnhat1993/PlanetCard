class_name UiThemeFactory
extends RefCounted

static func create(tokens: UiTokenStore) -> Theme:
	var result := Theme.new()
	var font_path := "res://art/approved/fonts/PixelifySans-Variable.ttf"
	if ResourceLoader.exists(font_path):
		result.default_font = load(font_path) as Font
	result.default_font_size = tokens.font_size("body", 14)
	result.set_color("font_color", "Label", tokens.color("text_primary"))
	result.set_color("font_color", "Button", tokens.color("text_primary"))
	result.set_color("font_hover_color", "Button", tokens.color("background"))
	result.set_color("font_pressed_color", "Button", tokens.color("background"))
	result.set_font_size("font_size", "Button", tokens.font_size("label", 12))
	result.set_constant("separation", "VBoxContainer", tokens.spacing("md", 12))
	result.set_constant("separation", "HBoxContainer", tokens.spacing("md", 12))
	result.set_stylebox("normal", "Button", _box(tokens.color("panel_alt"), tokens.color("accent"), 1, 6))
	result.set_stylebox("hover", "Button", _box(tokens.color("accent"), tokens.color("focus"), 1, 6))
	result.set_stylebox("pressed", "Button", _box(tokens.color("focus"), tokens.color("focus"), 1, 6))
	result.set_stylebox("focus", "Button", _box(Color.TRANSPARENT, tokens.color("focus"), 2, 6))
	result.set_stylebox("panel", "PanelContainer", _box(tokens.color("panel"), tokens.color("panel_alt"), 1, 8))
	return result

static func _box(background: Color, border: Color, border_width: int, radius: int) -> StyleBoxFlat:
	var box := StyleBoxFlat.new()
	box.bg_color = background
	box.border_color = border
	box.set_border_width_all(border_width)
	box.set_corner_radius_all(radius)
	box.content_margin_left = 16
	box.content_margin_right = 16
	box.content_margin_top = 10
	box.content_margin_bottom = 10
	return box
