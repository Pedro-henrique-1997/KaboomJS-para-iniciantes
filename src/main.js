import kaboom from "kaboom"
// Start game
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("portal", "/sprites/portal.png")
loadSound("bell", "/sounds/bell.mp3")
loadSound("cano", "/sounds/mario-entrando-no-cano.mp3")
loadSound("up", "/sounds/levelupL.mp3")


setGravity(2400)

const LEVELS = [
	[
		"@  > $$$$$$  #",
		"==============",
	],

	[
		"@  $  $  #",
		"=  =  =  =",
	],

	[
		"@ > $$$$ > #",
		"=== = = = ==",
	],
]

scene("game", ({levelIdx, score}) => {

	const level = addLevel(LEVELS[levelIdx || 0], {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(420, 200),

		tiles: {
			"@": () => [
				sprite("bean"),
				area(),
				body(),
				anchor("bot"),
				"player",
			],

			"=": () => [
				sprite("grass"),
				body({isStatic: true}),
				anchor("bot"),
				area(),
				"chao",
			],
			
			"$": () => [
				sprite("coin"),
				area(),
				anchor("bot"),
				"coin",
			],

			"#": () => [
				sprite("portal"),
				area(),
				anchor("bot"),
				"portal",
			],

			">": () => [
				sprite("spike"),
				area(),
				anchor("bot"),
                "spike",
			],
		}

	})

	function start() {
		go("game",  {
           levelIdx: 0,
		   score: 0,
		})
	}
})

start()