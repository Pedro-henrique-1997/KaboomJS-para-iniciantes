import kaboom from "kaboom"

kaboom({
	background: [74, 48, 82],
})


loadSprite("bag", "/sprites/bag.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("steel", "/sprites/steel.png")
loadSprite("door", "/sprites/door.png")
loadSprite("key", "/sprites/key.png")
loadSprite("bean", "/sprites/bean.png")
loadSprite("snow", "/sprites/snow.png")
loadSprite("peixe", "/sprites/bobo.png")

scene("main", (levelIdx) => {

	const SPEED = 320

	// character dialog data
	const characters = {
		"a": {
			sprite: "bag",
			msg: "Hi Bean! You should get that key!",
		},
		"b": {
			sprite: "ghosty",
			msg: "Who are you? You can see me??",
		},

		"v": {
			sprite: "peixe",
			msg: "Use a chave para acessar as dungeons",
		}
	}

	// level layouts
	const levels = [
		[
			"===|====",
			"=      =",
			"= $    =",
			"=    a =",
			"=      =",
			"=   @  =",
			"========",
		],
		[
			"--------",
			"-      -",
			"-   $  -",
			"|      -",
			"-    b -",
			"-  @   -",
			"--------",
		],

		[
			"++++++++++++++",
			"+            +",
			"|   $        +",
			"+            +",
			"+   @        +",
			"+            +",
			"+        v   +",
			"++++++++++++++",
		]
	]

	const level = addLevel(levels[levelIdx], {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(420, 100),
		tiles: {
			"=": () => [
				sprite("grass"),
				area(),
				body({ isStatic: true }),
				anchor("center"),
			],
			"-": () => [
				sprite("steel"),
				area(),
				body({ isStatic: true }),
				anchor("center"),
			],
			"$": () => [
				sprite("key"),
				area(),
				anchor("center"),
				"key",
			],
			"@": () => [
				sprite("bean"),
				area(),
				body(),
				anchor("center"),
				"player",
			],
			"|": () => [
				sprite("door"),
				area(),
				body({ isStatic: true }),
				anchor("center"),
				"door",
			],

			"+": () => [
				sprite("snow"),
				area(),
				body({isStatic: true}),
				anchor("center"),
			],
		},
		// any() is a special function that gets called everytime there's a
		// symbole not defined above and is supposed to return what that symbol
		// means
		wildcardTile(ch) {
			const char = characters[ch]
			if (char) {
				return [
					sprite(char.sprite),
					area(),
					body({ isStatic: true }),
					anchor("center"),
					"character",
					{ msg: char.msg },
				]
			}
		},
	})

	// get the player game obj by tag
	const player = level.get("player")[0]

	function addDialog(){
		const pad = 16
		const h = 160

		const bg = add([
			rect(width(), h),
			color(0,0,0),
			pos(0, height() - h),
			z(100),
		])

		const txt = add([
			text("", {
				width: width()
			}),
			z(100),
			pos(0 + pad, height())
		])

		bg.hidden = true
		txt.hidden = true
		return {
			//3.1 Exibe o texto no parametro t
			say(t) {
				txt.text = t
				bg.hidden = false
				txt.hidden = false
			},
			//3.2 Limpa o texto e limpa o background
			dismiss() {
				if (!this.active()) {
					return
				}
				txt.text = ""
				bg.hidden = true
				txt.hidden = true
			},
			//3.3 Retorna true se o diálogo estiver visível, verificando se o fundo está escondido ou não.
			active() {
				return !bg.hidden
			},
			//3.4 Remove completamente o fundo e o texto da cena, destruindo os elementos.
			destroy() {
				bg.destroy()
				txt.destroy()
			},
		}
	}

	const dirs = {
		"left":LEFT,
		"right":RIGHT,
		"up": UP,
		"down": DOWN
	}

	for(const dir in dirs){
		
		onKeyDown(dir, () => {
			player.move(dirs[dir].scale(SPEED))
		})
	}

})

scene("win", () => {
	add([
		text("You Win!"),
		pos(width() / 2, height() / 2),
		anchor("center"),
	])
})

go("main", 0)
