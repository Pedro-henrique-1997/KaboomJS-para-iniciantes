import kaboom from "kaboom"

kaboom()

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

const FASES = [
	[
		"@ > $$$$$$$$ %",
		"==============",
	],

	[
		"@ > $ $ $ $ %",
		"= = = = = = =",
	],

	[
		"@ $ $ $ $  $",
		"======== == ",
		">> ======== %",
		"=============",
	],
]

scene("game", ({levelIdx, score}) => {
	const fase = addLevel(FASES[levelIdx || 0], {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(420, 200),

		tiles: {
			"@": () => [
				sprite("bean"),
				area(),
				body(),
				anchor("bot"),
				"avatar",
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

			"%": () => [
				sprite("portal"),
				area(),
				body({isStatic: true}),
				anchor("bot"),
				"portal",
			],

			">": () => [
				sprite("spike"),
				area(),
				body({isStatic: true}),
				anchor("bot"),
				"spike",
			]
		}
	})

	

	const avatar = fase.get("avatar")[0]

	function pular(){
		if(avatar.isGrounded()){
			avatar.jump()
		}
	}

	var velocidade = 400;

	onKeyDown("right", () => {
		avatar.move(velocidade, 0)
	})

	onKeyDown("left", () => {
		avatar.move(-velocidade, 0)
	})

	onKeyDown("space", pular)

	avatar.onUpdate(() => {
		if (avatar.pos.y >= 480) {
			go("lose")
		}
	})

	avatar.onCollide("spike", (spike) => {
		go("lose")
	})

	let scoreLabel = add([
		text(score),
		pos(12, 12),
	])

	avatar.onCollide("coin", (coin) => {
		destroy(coin)
		score++;
		scoreLabel.text = score;
		play("bell")
	})

	avatar.onCollide("portal", () => {
		play("cano")

		if(levelIdx < FASES.length - 1){
			go("game", {
				levelIdx: levelIdx + 1,
				score: score,
			})
		}else{
			go("vitoria", {score: score})
		}
	})
	
	scene("lose", () => {

		add([
			text("You Lose"),
			pos(12),
		])
	
		// Press any key to go back
		onKeyPress(comecar)
	
	})

	scene("vitoria", ({score}) => {
		add([
			text("Voce Ganhou " + score + " moedas"),
			pos(12)
		])
       
		play("up")
		onKeyPress(comecar)
	})
	
})

function comecar(){
	go("game", {
		levelIdx: 0,
		score: 0,
	})
}

comecar()