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
					"character",
					{msg: char.msg}
				]
			}
		},
	})

	const player = level.get("player")[0]

	const SPEED = 320

	function addDialog(){
		const h = 160
		const pad = 16

		const bg = add([
			pos(0, height() - h),
			rect(width(), h),
			color(0, 0, 0),
			z(100),
		])

		const txt = add([
			text("", {
				width: width(),
			}),

			pos(0 + pad, height() - h + pad),
			z(100)
		])

		bg.hidden = true
		txt.hidden = true

		return{
			say(t){
				txt.text = t
				bg.hidden = false
				txt.hidden = false
			},

			active(){
				return !bg.hidden
			},

			dismiss(){
				if(!this.active()){
					return
				}

				txt.text = ""
				bg.hidden = true
				txt.hidden = true
			},

			destroy(){
				bg.destroy()
				txt.destroy()
			}
		}
	}

	const dialog =  addDialog()


	player.onCollide("character", (ch) => {
		dialog.say(ch.msg)
	})

	const dirs = {
		"left": LEFT,
		"right": RIGHT,
		"up": UP,
		"down": DOWN,
	}

	for(const dir in dirs){
		onKeyPress(() => {
			dialog.dismiss()
		})

		onKeyDown(dir, () => {
			player.move(dirs[dir].scale(SPEED))
		})
	}
})

go("game", 0)