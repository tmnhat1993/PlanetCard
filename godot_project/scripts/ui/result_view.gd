extends Control

signal home_requested
signal map_requested

func setup(result: Dictionary, application: Dictionary, profile: PlayerProfileState) -> void:
	UiFactory.texture(self, "res://art/approved/combat/overgrown_basin_bg_v01.png", Vector2.ZERO, Vector2(960, 540))
	var shade := ColorRect.new()
	shade.color = Color(0.01, 0.03, 0.04, 0.78)
	shade.position = Vector2.ZERO
	shade.size = Vector2(960, 540)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)
	var victory := str(result.outcome) == "VICTORY"
	var panel := UiFactory.panel(self, Vector2(205, 70), Vector2(550, 400), Color("121c25f5"), Color("6fb36d" if victory else "d85b52"))
	UiFactory.label(panel, "STAGE 01 %s" % ("CLEAR" if victory else "FAILED"), Vector2(40, 20), Vector2(470, 22), 12, Color("e0b85c"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(panel, "VICTORY" if victory else "DEFEAT", Vector2(40, 43), Vector2(470, 52), 34, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(panel, "%d TURNS · HULL REMAINING %d" % [result.turn_count, result.remaining_hull], Vector2(40, 94), Vector2(470, 25), 13, Color("aebac3"), HORIZONTAL_ALIGNMENT_CENTER)

	UiFactory.panel(panel, Vector2(30, 140), Vector2(490, 72), Color("1b2633"), Color("263646"))
	UiFactory.label(panel, "ENEMIES DEFEATED", Vector2(48, 150), Vector2(260, 24), 14, Color("f2ead3"))
	UiFactory.label(panel, str(result.defeated_enemy_ids.size()), Vector2(405, 150), Vector2(90, 42), 28, Color("f2ead3"), HORIZONTAL_ALIGNMENT_RIGHT)
	UiFactory.label(panel, "RESOURCES ACQUIRED", Vector2(30, 230), Vector2(490, 24), 13, Color("f2ead3"))
	var reward := int(result.reward_bundle.resources.biomass)
	UiFactory.panel(panel, Vector2(30, 258), Vector2(490, 62), Color("1b2633"), Color("263646"))
	UiFactory.label(panel, "BIOMASS", Vector2(50, 266), Vector2(180, 22), 12, Color("8fdc82"))
	UiFactory.label(panel, "+%d" % reward if victory else "+0", Vector2(50, 286), Vector2(180, 26), 19, Color("f2ead3"))
	UiFactory.label(panel, "BIO FARM READY", Vector2(250, 274), Vector2(245, 28), 13, Color("8fdc82" if profile.mine_ready else "aebac3"), HORIZONTAL_ALIGNMENT_RIGHT)
	if application.get("already_applied", false):
		UiFactory.label(panel, "REWARD ALREADY APPLIED", Vector2(30, 325), Vector2(490, 20), 10, Color("aebac3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.button(panel, "RETURN HOME", Vector2(80, 350), Vector2(185, 38), func() -> void: home_requested.emit())
	UiFactory.button(panel, "RETURN TO MAP", Vector2(285, 350), Vector2(185, 38), func() -> void: map_requested.emit())

