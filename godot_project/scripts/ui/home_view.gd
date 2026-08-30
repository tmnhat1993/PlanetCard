extends Control

signal harvest_requested
signal upgrade_requested
signal planet_select_requested
signal menu_requested

var _profile: PlayerProfileState
var _economy: EconomyService

func setup(profile: PlayerProfileState, economy: EconomyService, message: String = "") -> void:
	_profile = profile
	_economy = economy
	UiFactory.texture(self, "res://art/approved/home/home_plant_base_v01.png", Vector2.ZERO, Vector2(960, 540))
	var shade := ColorRect.new()
	shade.color = Color(0.02, 0.06, 0.06, 0.32)
	shade.position = Vector2.ZERO
	shade.size = Vector2(960, 540)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)

	UiFactory.label(self, "HOME BASE · GROWTH CYCLE %02d" % profile.production_cycle, Vector2(300, 18), Vector2(360, 20), 11, Color("aebac3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "VERDANT HAVEN", Vector2(300, 37), Vector2(360, 42), 28, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.panel(self, Vector2(22, 20), Vector2(110, 42), Color("173d2a"), Color("6fb36d"))
	UiFactory.label(self, "PLANT", Vector2(22, 20), Vector2(110, 42), 15, Color("8fdc82"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "BIOMASS", Vector2(708, 18), Vector2(92, 18), 10, Color("aebac3"), HORIZONTAL_ALIGNMENT_RIGHT)
	UiFactory.label(self, str(profile.biomass), Vector2(708, 36), Vector2(92, 30), 22, Color("f2ead3"), HORIZONTAL_ALIGNMENT_RIGHT)
	UiFactory.button(self, "UNIVERSE MAP  ↗", Vector2(812, 20), Vector2(130, 46), func() -> void: planet_select_requested.emit())

	var farm_panel := UiFactory.panel(self, Vector2(80, 326), Vector2(250, 108), Color("14231ddd"), Color("6fb36d" if profile.mine_ready else "3f566a"))
	UiFactory.label(farm_panel, "01   BIO FARM", Vector2(12, 8), Vector2(220, 26), 18, Color("f2ead3"))
	UiFactory.label(farm_panel, "Yield: %d Biomass" % profile.mine_yield, Vector2(12, 35), Vector2(220, 22), 12, Color("aebac3"))
	UiFactory.label(farm_panel, "READY TO HARVEST" if profile.mine_ready else "ADVANCE BY WINNING COMBAT", Vector2(12, 56), Vector2(220, 20), 11, Color("8fdc82" if profile.mine_ready else "aebac3"))
	UiFactory.button(farm_panel, "HARVEST +%d" % profile.mine_yield if profile.mine_ready else "EMPTY", Vector2(12, 78), Vector2(220, 24), func() -> void: harvest_requested.emit(), not profile.mine_ready)

	var hq_panel := UiFactory.panel(self, Vector2(352, 230), Vector2(256, 128), Color("172331ee"), Color("e0b85c"))
	UiFactory.label(hq_panel, "VERDANT HQ · LEVEL %02d" % profile.base_level, Vector2(12, 8), Vector2(232, 30), 18, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(hq_panel, "Next: Bio Farm yield +5", Vector2(12, 39), Vector2(232, 22), 12, Color("aebac3"), HORIZONTAL_ALIGNMENT_CENTER)
	var cost := economy.current_upgrade_cost(profile)
	UiFactory.label(hq_panel, "COST %d BIOMASS" % cost, Vector2(12, 61), Vector2(232, 22), 12, Color("e0b85c"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.button(hq_panel, "UPGRADE HQ", Vector2(42, 88), Vector2(172, 30), func() -> void: upgrade_requested.emit(), profile.biomass < cost)

	UiFactory.panel(self, Vector2(685, 326), Vector2(195, 82), Color("14231ddd"), Color("3f566a"))
	UiFactory.label(self, "SHIPYARD", Vector2(702, 338), Vector2(160, 22), 16, Color("aebac3"))
	UiFactory.label(self, "Management locked for Phase 1", Vector2(702, 362), Vector2(160, 32), 10, Color("7d8b96"))
	UiFactory.button(self, "MAIN MENU", Vector2(22, 482), Vector2(112, 36), func() -> void: menu_requested.emit())
	if not message.is_empty():
		UiFactory.label(self, message, Vector2(250, 487), Vector2(460, 30), 13, Color("f4e38b"), HORIZONTAL_ALIGNMENT_CENTER)

