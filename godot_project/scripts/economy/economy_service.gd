class_name EconomyService
extends RefCounted

const BASE_UPGRADE_COST := 25

func harvest_mine(profile: PlayerProfileState) -> Dictionary:
	if not profile.mine_ready:
		return {"success": false, "error": "MINE_NOT_READY", "amount": 0}
	var amount := profile.mine_yield
	profile.biomass += amount
	profile.mine_ready = false
	return {"success": true, "amount": amount, "balance": profile.biomass}

func current_upgrade_cost(profile: PlayerProfileState) -> int:
	return BASE_UPGRADE_COST * profile.base_level

func upgrade_hq(profile: PlayerProfileState) -> Dictionary:
	var cost := current_upgrade_cost(profile)
	if profile.biomass < cost:
		return {"success": false, "error": "INSUFFICIENT_BIOMASS", "cost": cost}
	profile.biomass -= cost
	profile.base_level += 1
	profile.mine_yield += 5
	return {
		"success": true,
		"cost": cost,
		"base_level": profile.base_level,
		"mine_yield": profile.mine_yield,
	}

func advance_production(profile: PlayerProfileState, source_id: String) -> Dictionary:
	if profile.applied_production_ids.has(source_id):
		return {"success": true, "already_applied": true}
	profile.applied_production_ids.append(source_id)
	profile.production_cycle += 1
	profile.mine_ready = true
	return {"success": true, "already_applied": false, "mine_ready": true}

