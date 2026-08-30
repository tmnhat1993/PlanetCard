class_name UiTokenStore
extends RefCounted

const DEFAULT_PATH := "res://data/ui/tokens.json"

var values: Dictionary = {}
var errors: Array[String] = []

func load_tokens(path: String = DEFAULT_PATH) -> bool:
	errors.clear()
	if not FileAccess.file_exists(path):
		errors.append("UI token file not found: %s" % path)
		return false
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(path))
	if not parsed is Dictionary:
		errors.append("UI token root must be an object: %s" % path)
		return false
	values = parsed
	return true

func color(token_name: String, fallback: Color = Color.WHITE) -> Color:
	var colors: Dictionary = values.get("color", {})
	var raw_value := str(colors.get(token_name, ""))
	return Color.from_string(raw_value, fallback)

func spacing(token_name: String, fallback: int = 0) -> int:
	var spacings: Dictionary = values.get("spacing", {})
	return int(spacings.get(token_name, fallback))

func font_size(token_name: String, fallback: int = 14) -> int:
	var typography: Dictionary = values.get("typography", {})
	return int(typography.get(token_name, fallback))

