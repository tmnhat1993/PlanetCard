extends SceneTree

var _failures: Array[String] = []
var _checks: int = 0

func _initialize() -> void:
	print("[PHASE 0] Running foundation verification")
	_test_valid_content()
	_test_invalid_content_fails_loudly()
	_test_named_rng_determinism()
	_test_initial_state_determinism()
	_test_runtime_ids_and_structured_log()
	if _failures.is_empty():
		print("[PHASE 0] PASS — %d checks" % _checks)
		quit(0)
	else:
		for failure: String in _failures:
			printerr("[PHASE 0] FAIL — %s" % failure)
		printerr("[PHASE 0] FAILED — %d check(s), %d failure(s)" % [_checks, _failures.size()])
		quit(1)

func _test_valid_content() -> void:
	var registry := ContentRegistry.new()
	var report := registry.load_all()
	_expect(report.is_valid(), "Valid fixture bundle should pass: %s" % report.summary())
	var counts := registry.counts()
	_expect(counts.cards == 5, "Fixture bundle should contain 5 Phase 1 cards")
	_expect(counts.enemies == 3, "Fixture bundle should contain 3 enemies")
	_expect(counts.statuses == 2, "Fixture bundle should contain 2 statuses")
	_expect(counts.encounters == 1, "Fixture bundle should contain 1 encounter")
	_expect(registry.get_card(&"plant_thorn_snap") is CardData, "JSON card should convert to typed CardData")
	_expect(registry.get_enemy(&"plant_vine_guard") is EnemyData, "JSON enemy should convert to typed EnemyData")

func _test_invalid_content_fails_loudly() -> void:
	var registry := ContentRegistry.new()
	var report := registry.load_all({
		"cards": "res://tests/fixtures/invalid_cards.json",
		"encounters": "res://tests/fixtures/invalid_encounters.json",
	})
	_expect(not report.is_valid(), "Invalid fixture bundle must fail")
	_expect(_contains_code(report.errors, "DUPLICATE_ID"), "Duplicate ID must be reported")
	_expect(_contains_code(report.errors, "MISSING_REFERENCE"), "Missing reference must be reported")

func _test_named_rng_determinism() -> void:
	var first := NamedRng.new(42821)
	var second := NamedRng.new(42821)
	var first_samples := [
		first.sample_int(&"DECK", 0, 99999),
		first.sample_int(&"ENEMY", 0, 99999),
		first.sample_int(&"EFFECT", 0, 99999),
		first.sample_int(&"REWARD", 0, 99999),
	]
	var second_samples := [
		second.sample_int(&"DECK", 0, 99999),
		second.sample_int(&"ENEMY", 0, 99999),
		second.sample_int(&"EFFECT", 0, 99999),
		second.sample_int(&"REWARD", 0, 99999),
	]
	_expect(first_samples == second_samples, "Same master seed must produce identical named stream samples")

	var isolated_a := NamedRng.new(17)
	var isolated_b := NamedRng.new(17)
	isolated_a.sample_int(&"DECK", 0, 9)
	isolated_a.sample_int(&"DECK", 0, 9)
	_expect(isolated_a.sample_int(&"ENEMY", 0, 999) == isolated_b.sample_int(&"ENEMY", 0, 999), "Consuming DECK must not advance ENEMY")

func _test_initial_state_determinism() -> void:
	var registry := ContentRegistry.new()
	registry.load_all()
	var first := CombatState.create_fixture(registry, 991)
	var second := CombatState.create_fixture(registry, 991)
	_expect(first.snapshot() == second.snapshot(), "Same seed and content must create the same initial state")
	_expect(first.draw_pile.size() == 5, "Initial fixture state should reference all fixture cards")

func _test_runtime_ids_and_structured_log() -> void:
	var ids := RuntimeIdFactory.new("test")
	_expect(ids.next_id(&"card") == &"test:card:000001", "Runtime ID sequence should start at one")
	_expect(ids.next_id(&"card") == &"test:card:000002", "Runtime ID sequence should be monotonic")
	var log := StructuredLog.new()
	var event := log.append(&"TEST_EVENT", {"value": 7})
	_expect(event.sequence == 1 and event.type == "TEST_EVENT", "Structured log should stamp sequence and type")
	_expect(log.to_json().contains("TEST_EVENT"), "Structured log should serialize to JSON")

func _contains_code(errors: Array[String], code: String) -> bool:
	for message: String in errors:
		if message.begins_with(code + ":"):
			return true
	return false

func _expect(condition: bool, message: String) -> void:
	_checks += 1
	if condition:
		print("  PASS  %s" % message)
	else:
		_failures.append(message)
