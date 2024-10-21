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

scene("game", (levelIdx) => {
	
	const SPEED = 320

	const caracteres = {
		a: {
			sprite: "bag",
			msg: "Use as chaves para acessar as dungeons",
		},

		b: {
			sprite: "ghosty",
			msg: "Vá rapido para a porta",
		},

		v: {
			sprite: "peixe",
			msg: "Seja bravo bean",
		}
	}

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

		wildcardTile(ch){
			const char = caracteres[ch]
			if(char){
				return [
					sprite(char.sprite),
					body({isStatic: true}),
					area(),
					anchor("center"),
					{msg: char.msg}
				]
			}
		}
	})
})

go("game", 0)