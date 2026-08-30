class_name PlayerProfileState
extends RefCounted

const SAVE_VERSION := 1

var profile_id: String = "plant_pioneer"
var biomass: int = 20
var base_level: int = 1
var mine_yield: int = 10
var mine_ready: bool = true
var production_cycle: int = 1
var highest_cleared_stage: int = 0
var applied_result_ids: Array[String] = []
var applied_production_ids: Array[String] = []

static func new_game() -> PlayerProfileState:
	return PlayerProfileState.new()

static func from_dictionary(source: Dictionary) -> PlayerProfileState:
	var result := PlayerProfileState.new()
	result.profile_id = str(source.get("profile_id", result.profile_id))
	var economy: Dictionary = source.get("economy", {})
	result.biomass = int(economy.get("biomass", result.biomass))
	result.base_level = int(economy.get("base_level", result.base_level))
	result.mine_yield = int(economy.get("mine_yield", result.mine_yield))
	result.mine_ready = bool(economy.get("mine_ready", result.mine_ready))
	result.production_cycle = int(economy.get("production_cycle", result.production_cycle))
	var planets: Dictionary = source.get("planets", {})
	var plant: Dictionary = planets.get("plant", {})
	result.highest_cleared_stage = int(plant.get("highest_cleared_stage", 0))
	result.applied_result_ids.assign(source.get("applied_result_ids", []))
	result.applied_production_ids.assign(source.get("applied_production_ids", []))
	return result

func to_dictionary() -> Dictionary:
	return {
		"save_version": SAVE_VERSION,
		"profile_id": profile_id,
		"economy": {
			"biomass": biomass,
			"base_level": base_level,
			"mine_yield": mine_yield,
			"mine_ready": mine_ready,
			"production_cycle": production_cycle,
		},
		"planets": {
			"plant": {"highest_cleared_stage": highest_cleared_stage},
		},
		"applied_result_ids": applied_result_ids.duplicate(),
		"applied_production_ids": applied_production_ids.duplicate(),
	}

