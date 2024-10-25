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
	
	const caracteres = {
		"a": {
			sprite: "bag",
			msg: "Pegue a chave e passe pela porta",
		},

		"b": {
			sprite:"ghosty",
			msg: "Somente com a chave que podera ir a outras fases",
		},

		"v": {
			sprite: "peixe",
			msg: "Rapido! Pegue a chave",
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
		// any() is a special function that gets called everytime there's a
		// symbole not defined above and is supposed to return what that symbol
		// means
		
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
		},
	})
})

go("game", 0)