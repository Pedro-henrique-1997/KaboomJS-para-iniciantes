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

// 1 - Criando as fases
const LEVELS = [
	[
		"@  ^ $$ >",
		"=========",
	],
	[
		"@   $   >",
		"=   =   =",
	],

	[
		"@  ^ $$$$$$$$$ >",
		"== = ============",
	]
]

// Define a scene called "game". The callback will be run when we go() to the scene
// Scenes can accept argument from go()
scene("game", ({ levelIdx, score }) => {

	// Use the level passed, or first level
	const level = addLevel(LEVELS[levelIdx || 0], {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(100, 200),
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
				area(),
				body({ isStatic: true }),
				anchor("bot"),
			],
			"$": () => [
				sprite("coin"),
				area(),
				anchor("bot"),
				"coin",
			],
			"^": () => [
				sprite("spike"),
				area(),
				body({isStatic: true}),
				anchor("bot"),
				"danger",
			],
			">": () => [
				sprite("portal"),
				area(),
				anchor("bot"),
				"portal",
			],
		},
	})

	const jogador = level.get("player")[0]

	function pular(){
		if(jogador.isGrounded){
			jogador.jump()
		}
	}

	onKeyPress("space", pular)

	onKeyDown("right", () => {
		jogador.move(SPEED, 0)
	})

	onKeyDown("left", () => {
		jogador.move(-SPEED, 0)
	})

	const scoreLabel = add([
		text(0),
		pos(12),
	])

	jogador.onCollide("coin", (coin) => {
        coin.destroy()
		score++;
		scoreLabel.text = score;
		play("bell")
	})

	jogador.onCollide("danger", () => {
		jogador.pos = level.tile2Pos(0,0)
		go("lose")
	})

	jogador.onCollide("portal", () => {
		play("cano")

		if(levelIdx < LEVELS.length -1){
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

	jogador.onUpdate(() => {
		if(jogador.pos.y >= 480){
			go("lose")
		}
	})

	scene("lose", () => {
		add([
			text("Voce Perdeu"),
			pos(12),
		])
		
		onKeyPress(start)
	})

	scene("win", () => {
		play("up")
		add([
			text("Voce Pegou " + score),
			pos(23, 23),
		])
		

		onKeyPress(start)
	})
	
})

// 2:1 - Função que vai começar o jogo
function start() {
	// Start with the "game" scene, with initial parameters
	go("game", {
		levelIdx: 0,
		score: 0,
	})
}

// 2:2 Chamando a primeira fase
start()
