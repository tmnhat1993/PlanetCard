class_name ProgressionService
extends RefCounted

var economy := EconomyService.new()

func apply_combat_result(profile: PlayerProfileState, result: Dictionary) -> Dictionary:
	var result_id := "%s:%s" % [result.get("expedition_id", ""), result.get("encounter_id", "")]
	if profile.applied_result_ids.has(result_id):
		return {"success": true, "already_applied": true}
	if str(result.get("outcome", "")) != "VICTORY":
		profile.applied_result_ids.append(result_id)
		return {"success": true, "already_applied": false, "reward": 0}
	var reward_bundle: Dictionary = result.get("reward_bundle", {})
	var resources: Dictionary = reward_bundle.get("resources", {})
	var biomass_reward := int(resources.get("biomass", 0))
	profile.biomass += biomass_reward
	profile.highest_cleared_stage = maxi(profile.highest_cleared_stage, int(result.get("stage", 1)))
	profile.applied_result_ids.append(result_id)
	economy.advance_production(profile, result_id)
	return {"success": true, "already_applied": false, "reward": biomass_reward}

