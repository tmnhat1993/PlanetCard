extends Control

signal launch_requested(encounter_id: StringName)
signal home_requested

func setup(profile: PlayerProfileState) -> void:
	UiFactory.texture(self, "res://art/approved/home/overview_plant_space_bg_v03.png", Vector2.ZERO, Vector2(960, 540))
	var shade := ColorRect.new()
	shade.color = Color(0.02, 0.04, 0.07, 0.48)
	shade.position = Vector2.ZERO
	shade.size = Vector2(960, 540)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)
	UiFactory.label(self, "WORLD MAP · SECTOR 01", Vector2(22, 16), Vector2(320, 20), 11, Color("e0b85c"))
	UiFactory.label(self, "Known Planetary Chain", Vector2(22, 37), Vector2(480, 42), 27, Color("f2ead3"))
	UiFactory.button(self, "← HOME BASE", Vector2(808, 20), Vector2(130, 38), func() -> void: home_requested.emit())

	UiFactory.texture(self, "res://art/approved/home/overview_plant_planet_fg_v03.png", Vector2(105, 130), Vector2(310, 310), TextureRect.EXPAND_IGNORE_SIZE, TextureRect.STRETCH_KEEP_ASPECT_CENTERED)
	UiFactory.panel(self, Vector2(80, 105), Vector2(360, 365), Color("10182044"), Color("6fb36d"))
	UiFactory.label(self, "PLANT", Vector2(165, 376), Vector2(190, 38), 28, Color("8fdc82"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "VERDANT PRIME · SELECTED", Vector2(145, 411), Vector2(230, 24), 12, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)

	var intel := UiFactory.panel(self, Vector2(530, 105), Vector2(385, 365), Color("172331ee"), Color("3f566a"))
	UiFactory.label(intel, "PLANT EXPEDITION", Vector2(18, 14), Vector2(340, 22), 11, Color("e0b85c"))
	UiFactory.label(intel, "Overgrown Basin", Vector2(18, 38), Vector2(340, 38), 24, Color("f2ead3"))
	UiFactory.label(intel, "STAGE 01 · THREAT MODERATE", Vector2(18, 80), Vector2(340, 24), 12, Color("aebac3"))
	UiFactory.label(intel, "Formation", Vector2(18, 122), Vector2(160, 22), 13, Color("f2ead3"))
	UiFactory.label(intel, "Sporeling · Vine Guard · Thornmaw", Vector2(18, 147), Vector2(340, 22), 13, Color("aebac3"))
	UiFactory.label(intel, "INTEL", Vector2(18, 190), Vector2(100, 22), 11, Color("e0b85c"))
	UiFactory.label(intel, "Visible intent · Poison pressure · Target priority", Vector2(18, 214), Vector2(340, 44), 13, Color("f2ead3"))
	UiFactory.label(intel, "REWARD", Vector2(18, 264), Vector2(100, 22), 11, Color("e0b85c"))
	UiFactory.label(intel, "+5 Biomass · Bio Farm advances 1 cycle", Vector2(18, 288), Vector2(340, 24), 13, Color("8fdc82"))
	UiFactory.button(intel, "LAUNCH EXPEDITION  →", Vector2(42, 321), Vector2(300, 34), func() -> void: launch_requested.emit(&"plant_foundation_encounter"))

	UiFactory.panel(self, Vector2(455, 208), Vector2(50, 50), Color("151a20bb"), Color("3f566a"))
	UiFactory.label(self, "×", Vector2(455, 208), Vector2(50, 50), 24, Color("64717c"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "LOCKED", Vector2(434, 260), Vector2(92, 20), 10, Color("64717c"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.label(self, "CLEARED %02d" % profile.highest_cleared_stage, Vector2(25, 492), Vector2(180, 26), 12, Color("aebac3"))

