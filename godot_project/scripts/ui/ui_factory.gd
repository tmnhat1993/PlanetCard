class_name UiFactory
extends RefCounted

static func label(parent: Node, text_value: String, position: Vector2, size: Vector2, font_size: int = 14, color: Color = Color.WHITE, alignment: HorizontalAlignment = HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var result := Label.new()
	result.text = text_value
	result.position = position
	result.size = size
	result.add_theme_font_size_override("font_size", font_size)
	result.add_theme_color_override("font_color", color)
	result.horizontal_alignment = alignment
	result.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	parent.add_child(result)
	return result

static func button(parent: Node, text_value: String, position: Vector2, size: Vector2, callback: Callable, disabled: bool = false) -> Button:
	var result := Button.new()
	result.text = text_value
	result.position = position
	result.size = size
	result.disabled = disabled
	result.pressed.connect(callback)
	parent.add_child(result)
	return result

static func panel(parent: Node, position: Vector2, size: Vector2, color: Color, border_color: Color = Color.TRANSPARENT) -> Panel:
	var result := Panel.new()
	result.position = position
	result.size = size
	var style := StyleBoxFlat.new()
	style.bg_color = color
	style.border_color = border_color
	style.set_border_width_all(1 if border_color.a > 0.0 else 0)
	style.set_corner_radius_all(6)
	result.add_theme_stylebox_override("panel", style)
	parent.add_child(result)
	return result

static func texture(parent: Node, path: String, position: Vector2, size: Vector2, expand_mode: TextureRect.ExpandMode = TextureRect.EXPAND_IGNORE_SIZE, stretch_mode: TextureRect.StretchMode = TextureRect.STRETCH_KEEP_ASPECT_COVERED) -> TextureRect:
	var result := TextureRect.new()
	result.position = position
	result.size = size
	result.expand_mode = expand_mode
	result.stretch_mode = stretch_mode
	result.mouse_filter = Control.MOUSE_FILTER_IGNORE
	if ResourceLoader.exists(path):
		result.texture = load(path) as Texture2D
	parent.add_child(result)
	return result

static func clear(parent: Node) -> void:
	for child: Node in parent.get_children():
		child.queue_free()

