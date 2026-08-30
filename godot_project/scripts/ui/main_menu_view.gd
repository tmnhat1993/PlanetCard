extends Control

signal new_game_requested
signal continue_requested
signal exit_requested

func setup(has_save: bool) -> void:
	UiFactory.texture(self, "res://art/approved/start/start_space_flyby_bg_v01.png", Vector2.ZERO, Vector2(960, 540))
	var shade := ColorRect.new()
	shade.color = Color(0.01, 0.025, 0.04, 0.42)
	shade.position = Vector2.ZERO
	shade.size = Vector2(960, 540)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)
	UiFactory.label(self, "EXPLORE · BUILD · CONQUER", Vector2(300, 18), Vector2(360, 22), 11, Color("aebac3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.texture(self, "res://art/approved/start/start_title_logo_v01.png", Vector2(330, 45), Vector2(300, 150), TextureRect.EXPAND_IGNORE_SIZE, TextureRect.STRETCH_KEEP_ASPECT_CENTERED)
	UiFactory.label(self, "A deckbuilding voyage across living worlds.", Vector2(260, 190), Vector2(440, 28), 15, Color("f2ead3"), HORIZONTAL_ALIGNMENT_CENTER)
	UiFactory.panel(self, Vector2(315, 252), Vector2(330, 208), Color("172331e8"), Color("3f566a"))
	UiFactory.button(self, "01   NEW GAME                                      →", Vector2(335, 274), Vector2(290, 48), func() -> void: new_game_requested.emit())
	UiFactory.button(self, "02   CONTINUE                                      →", Vector2(335, 332), Vector2(290, 48), func() -> void: continue_requested.emit(), not has_save)
	UiFactory.button(self, "03   EXIT                                             ×", Vector2(335, 390), Vector2(290, 48), func() -> void: exit_requested.emit())
	UiFactory.label(self, "BUILD 0.2 · PHASE 1", Vector2(18, 505), Vector2(230, 22), 10, Color("aebac3"))
	UiFactory.label(self, "PLANT FIRST PLAYABLE SLICE", Vector2(680, 505), Vector2(260, 22), 10, Color("aebac3"), HORIZONTAL_ALIGNMENT_RIGHT)

