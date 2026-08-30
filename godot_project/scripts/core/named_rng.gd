class_name NamedRng
extends RefCounted

const STREAM_NAMES: Array[StringName] = [&"DECK", &"ENEMY", &"EFFECT", &"REWARD"]

var master_seed: int
var _streams: Dictionary = {}

func _init(seed_value: int) -> void:
	master_seed = seed_value

func stream(stream_name: StringName) -> RandomNumberGenerator:
	assert(STREAM_NAMES.has(stream_name), "Unknown gameplay RNG stream: %s" % stream_name)
	if not _streams.has(stream_name):
		var generator := RandomNumberGenerator.new()
		generator.seed = derive_seed(master_seed, stream_name)
		_streams[stream_name] = generator
	return _streams[stream_name] as RandomNumberGenerator

func sample_int(stream_name: StringName, minimum: int, maximum: int) -> int:
	return stream(stream_name).randi_range(minimum, maximum)

static func derive_seed(root_seed: int, stream_name: StringName) -> int:
	var value := root_seed & 0x7fffffff
	for byte: int in str(stream_name).to_utf8_buffer():
		value = ((value * 31) + byte) & 0x7fffffff
	return value

