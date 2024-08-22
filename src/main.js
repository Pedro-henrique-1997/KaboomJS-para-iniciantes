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

const andar = 400;


const LEVELS = [
	[
		"@ > $$$$ > $$$$$ #",
		"==================",
	],

	[
		"@ $$$ $$$$",
		"====>====>$$$$$$ #",
		"==========================",
	],

	[
		"@ $$$ > $$$$$ #",
		"======= ========",
	],

	[
		"@    #",
		"=======",
	],
]

scene("jogo", ({nivel, pontos}) => {
	const fases = addLevel(LEVELS[nivel || 0], {
		tileWidth: 65,
		tileHeight: 65,
		pos: vec2(200, 220),

		tiles: {
			"@": () => [
				sprite("bean"),
				area(),
				body(),
				anchor("bot"),
				"jogador",
			],

			"=": () => [
				sprite("grass"),
				area(),
				body({isStatic: true}),
				anchor("bot"),
				"chao",
			],

			"$": () => [
				sprite("coin"),
				area(),
				anchor("bot"),
				"moeda",
			],

			"#": () => [
				sprite("portal"),
				area(),
				body(),
				anchor("bot"),
				"portal",
			],

			">": () => [
				sprite("spike"),
				area(),
				body({isStatic: true}),
				anchor("bot"),
				"espinho",
			],
		}
	})

	const jogador = fases.get("jogador")[0]

	const andar = 400;

	function pulo(){
		if(jogador.isGrounded()){
			jogador.jump()
		}
	}

	var pontuacao = add([
		text(pontos),
		pos(12),
	])

	onKeyPress("space", pulo)

	onKeyDown("right", () => {
		jogador.move(andar, 0)
	})

	onKeyDown("left", () => {
		jogador.move(-andar, 0)
	})

	jogador.onCollide("espinho", () => {
		go("derrota")
	})

	jogador.onCollide("moeda", (moeda) => {
		destroy(moeda)
		play("bell")
		pontos++;
		pontuacao.text = pontos;
	})

	jogador.onCollide("portal", () => {
		play("cano")
		if(nivel < LEVELS.length -1){
			go("jogo", {
				nivel: nivel + 1,
				pontos: pontos,
			})
		}else{
			go("vitoria")
		}
	})

	jogador.onUpdate(() => {
		if(jogador.pos.y > 480){
			go("derrota")
		}
	})

	scene("derrota", () => {
		add([
			text("Voce Perdeu"),
			pos(12)
		])

		onKeyPress(comecarJogo)

	})

	scene("vitoria", () => {
		play("up")
		add([
			text("Voce Venceu!"),
			pos(12)
		])

		onKeyPress(comecarJogo)
	})
})

function comecarJogo(){
	go("jogo", {
		nivel: 0,
		pontos: 0,
	})
}

comecarJogo()