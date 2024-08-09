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
loadSound("cano", "/sounds/cano.mp3")
loadSound("up", "/sounds/levelup.mp3")


setGravity(2400)

const SPEED = 480

const LEVELS = [
	[
		"@ > $$$$$$ #",
		"============",
	],

	[
		"@ > $ $ $ $ #",
		"====== = = ===",
	],

	[
		"@  $  #",
		"=  =  ="
	]
]

scene("game", ({levelIdx, score}) => {
     
	const level = addLevel(LEVELS[levelIdx || 0], {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(200, 200),

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
				area(),
				anchor("bot"),
				"grass",
			],

			"$": () => [
				sprite("coin"),
				area(),
				anchor("bot"),
				"moeda",
			],

			">": () => [
				sprite("spike"),
				area(),
				anchor("bot"),
				"espinho",
			],

			"#": () => [
				sprite("portal"),
				area(),
				anchor("bot"),
				"portal",
			],
		}
	})

	const player = level.get("player")[0]

	function pular(){
		if(player.isGrounded()){
			player.jump()
		}
	}

	onKeyPress("space", pular)

	onKeyDown("right", () => {
		player.move(SPEED, 0)
	})

	onKeyDown("left", () => {
		player.move(-SPEED, 0)
	})

	var scoreLabel = add([
		text(score),
		pos(12, 12),
	])

	player.onCollide("espinho", (espinho) => {
		go("loose")
	})

	player.onCollide("portal", () => {
		play("cano")
		if(levelIdx < LEVELS.length - 1){
			go("game", {
				score: score,
				levelIdx: levelIdx + 1,
			})
		}else{
			go("win", {
				score: score,
			})
		}
	})

	player.onCollide("moeda", (moeda) => {
		destroy(moeda),
		score++;
		scoreLabel.text = score;
		play("bell")
	})

	player.onUpdate(() => {
		if(player.pos.y >= 480){
		go("loose")
		}
	})

	scene("loose", () => {
		add([
			text("Perdeu"),
			pos(12, 12),
		])
	})

	scene("win", ({score}) => {
		play("up")
		add([
			text(`Voçe pegou ${score} moedas`),
			pos(12, 12)
		])

		onKeyPress(start)

	})

	
})

function start(){
	go("game", {
		levelIdx: 0,
		score: 0,
	})
	
}

start()