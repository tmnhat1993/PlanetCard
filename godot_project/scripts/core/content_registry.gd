class_name ContentRegistry
extends RefCounted

const DEFAULT_PATHS := {
	"cards": "res://data/fixtures/cards.json",
	"enemies": "res://data/fixtures/enemies.json",
	"statuses": "res://data/fixtures/statuses.json",
	"encounters": "res://data/fixtures/encounters.json",
}

var cards: Dictionary = {}
var enemies: Dictionary = {}
var statuses: Dictionary = {}
var encounters: Dictionary = {}
var report := ContentValidationReport.new()

func load_all(path_overrides: Dictionary = {}) -> ContentValidationReport:
	cards.clear()
	enemies.clear()
	statuses.clear()
	encounters.clear()
	report = ContentValidationReport.new()
	var paths := DEFAULT_PATHS.duplicate()
	paths.merge(path_overrides, true)
	_load_category("cards", str(paths.cards), cards)
	_load_category("enemies", str(paths.enemies), enemies)
	_load_category("statuses", str(paths.statuses), statuses)
	_load_category("encounters", str(paths.encounters), encounters)
	_validate_cross_references()
	return report

func counts() -> Dictionary:
	return {
		"cards": cards.size(),
		"enemies": enemies.size(),
		"statuses": statuses.size(),
		"encounters": encounters.size(),
	}

func get_card(id: StringName) -> CardData:
	return cards.get(id) as CardData

func get_enemy(id: StringName) -> EnemyData:
	return enemies.get(id) as EnemyData

func get_status(id: StringName) -> StatusData:
	return statuses.get(id) as StatusData

func get_encounter(id: StringName) -> EncounterData:
	return encounters.get(id) as EncounterData

func _load_category(category: String, path: String, destination: Dictionary) -> void:
	if not FileAccess.file_exists(path):
		report.add_error("MISSING_FILE", "%s fixture not found at %s" % [category, path])
		return
	var source_text := FileAccess.get_file_as_string(path)
	var parsed: Variant = JSON.parse_string(source_text)
	if not parsed is Array:
		report.add_error("INVALID_JSON_ROOT", "%s must contain a JSON array" % path)
		return
	for index: int in range(parsed.size()):
		var raw_value: Variant = parsed[index]
		if not raw_value is Dictionary:
			report.add_error("INVALID_ENTRY", "%s[%d] must be an object" % [category, index])
			continue
		var raw: Dictionary = raw_value
		var id := StringName(str(raw.get("id", "")))
		_validate_identifier(id, "%s[%d]" % [category, index])
		if id == &"":
			continue
		if destination.has(id):
			report.add_error("DUPLICATE_ID", "%s contains duplicate id '%s'" % [category, id])
			continue
		var resource: Resource = _convert_resource(category, raw)
		if resource == null:
			report.add_error("UNSUPPORTED_CATEGORY", "No converter for %s" % category)
			continue
		destination[id] = resource
		_validate_resource(category, resource)

func _convert_resource(category: String, raw: Dictionary) -> Resource:
	match category:
		"cards":
			return CardData.from_dictionary(raw)
		"enemies":
			return EnemyData.from_dictionary(raw)
		"statuses":
			return StatusData.from_dictionary(raw)
		"encounters":
			return EncounterData.from_dictionary(raw)
		_:
			return null

func _validate_identifier(id: StringName, location: String) -> void:
	if id == &"":
		report.add_error("MISSING_ID", "%s has no id" % location)
		return
	var expression := RegEx.new()
	expression.compile("^[a-z][a-z0-9_]*$")
	if expression.search(str(id)) == null:
		report.add_error("INVALID_ID", "%s id '%s' must be lowercase_snake_case" % [location, id])

func _validate_resource(category: String, resource: Resource) -> void:
	match category:
		"cards":
			var card := resource as CardData
			if card.mass < 0:
				report.add_error("NEGATIVE_MASS", "Card '%s' has negative mass" % card.id)
			if card.energy_cost < 0:
				report.add_error("NEGATIVE_COST", "Card '%s' has negative energy cost" % card.id)
			if card.effects.is_empty():
				report.add_error("EMPTY_EFFECTS", "Card '%s' has no effects" % card.id)
		"enemies":
			var enemy := resource as EnemyData
			if enemy.max_hp <= 0:
				report.add_error("INVALID_MAX_HP", "Enemy '%s' max_hp must be positive" % enemy.id)
			if enemy.actions.is_empty():
				report.add_error("EMPTY_ACTIONS", "Enemy '%s' has no actions" % enemy.id)
		"encounters":
			var encounter := resource as EncounterData
			if encounter.stage <= 0:
				report.add_error("INVALID_STAGE", "Encounter '%s' stage must be positive" % encounter.id)
			if encounter.enemy_slots.is_empty():
				report.add_error("EMPTY_FORMATION", "Encounter '%s' has no enemies" % encounter.id)

func _validate_cross_references() -> void:
	for card_value: Variant in cards.values():
		var card := card_value as CardData
		_validate_effect_statuses(card.effects, "card '%s'" % card.id)
	for enemy_value: Variant in enemies.values():
		var enemy := enemy_value as EnemyData
		for action: EnemyActionData in enemy.actions:
			_validate_effect_statuses(action.effects, "enemy action '%s.%s'" % [enemy.id, action.id])
	for encounter_value: Variant in encounters.values():
		var encounter := encounter_value as EncounterData
		var used_slots: Dictionary = {}
		for slot: Dictionary in encounter.enemy_slots:
			var slot_index := int(slot.get("slot", -1))
			var enemy_id := StringName(str(slot.get("enemy_id", "")))
			if used_slots.has(slot_index):
				report.add_error("DUPLICATE_SLOT", "Encounter '%s' repeats slot %d" % [encounter.id, slot_index])
			used_slots[slot_index] = true
			if not enemies.has(enemy_id):
				report.add_error("MISSING_REFERENCE", "Encounter '%s' references enemy '%s'" % [encounter.id, enemy_id])

func _validate_effect_statuses(effects: Array[EffectData], owner: String) -> void:
	for effect: EffectData in effects:
		if effect.effect_type == &"":
			report.add_error("MISSING_EFFECT_TYPE", "%s contains an effect without type" % owner)
		if effect.effect_type == &"APPLY_STATUS" and not statuses.has(effect.status_id):
			report.add_error("MISSING_REFERENCE", "%s references status '%s'" % [owner, effect.status_id])

