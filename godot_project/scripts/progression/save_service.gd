class_name SaveService
extends RefCounted

const DEFAULT_SAVE_PATH := "user://planet_deckbuilder_save.json"

var save_path: String
var last_error: String = ""

func _init(path: String = DEFAULT_SAVE_PATH) -> void:
	save_path = path

func has_save() -> bool:
	return FileAccess.file_exists(save_path)

func save_profile(profile: PlayerProfileState) -> bool:
	last_error = ""
	var temporary_path := save_path + ".tmp"
	var file := FileAccess.open(temporary_path, FileAccess.WRITE)
	if file == null:
		last_error = "Unable to open temporary save file"
		return false
	file.store_string(JSON.stringify(profile.to_dictionary(), "  "))
	file.close()
	var verification: Variant = JSON.parse_string(FileAccess.get_file_as_string(temporary_path))
	if not verification is Dictionary:
		last_error = "Temporary save failed verification"
		return false
	if FileAccess.file_exists(save_path):
		var backup_path := save_path + ".bak"
		if FileAccess.file_exists(backup_path):
			DirAccess.remove_absolute(backup_path)
		DirAccess.rename_absolute(save_path, backup_path)
	var rename_error := DirAccess.rename_absolute(temporary_path, save_path)
	if rename_error != OK:
		last_error = "Unable to commit save file: %s" % error_string(rename_error)
		return false
	return true

func load_profile() -> PlayerProfileState:
	last_error = ""
	if not has_save():
		last_error = "Save file does not exist"
		return null
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(save_path))
	if not parsed is Dictionary:
		last_error = "Save file is invalid JSON"
		return _load_backup()
	if int(parsed.get("save_version", -1)) != PlayerProfileState.SAVE_VERSION:
		last_error = "Unsupported save version"
		return null
	return PlayerProfileState.from_dictionary(parsed)

func _load_backup() -> PlayerProfileState:
	var backup_path := save_path + ".bak"
	if not FileAccess.file_exists(backup_path):
		return null
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(backup_path))
	if parsed is Dictionary and int(parsed.get("save_version", -1)) == PlayerProfileState.SAVE_VERSION:
		return PlayerProfileState.from_dictionary(parsed)
	return null

