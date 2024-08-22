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
		"@  > $$$$$$$$ #",
		"===============",
	],

	[
		"@ > $$$ > $$$$$$$ #",
		"==================="
	],

	[
		"@ $ $ ",
		"= = = =#",
		"========",
	],
]

scene("game", ({nivel_fase, pontos}) => {
	const painel = addLevel(FASES[nivel_fase || 0], {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(300, 200),

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
				"moeda",
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
				"espinho",
			],
		}
	})

	const jogador = painel.get("avatar")[0]

	function pular(){
		if(jogador.isGrounded()){
			jogador.jump()
		}
	}

	const movimento = 400;

	onKeyDown("right", () => {
		jogador.move(movimento, 0)
	})

	onKeyDown("left", () => {
		jogador.move(-movimento, 0)
	})

	const pontuacao = add([
		text(pontos),
		pos(12, 12)
	])

	jogador.onCollide("moeda", (moeda) => {
		destroy(moeda);
		pontos++;
		pontuacao.text = pontos;
		play("bell")
	})
	
	jogador.onCollide("portal", () => {
		play("cano")

		if(nivel_fase < FASES.length - 1){
			go("game", {
				nivel_fase: nivel_fase +  1,
				pontos: pontos
			})
		}else{
			go("vitoria", (pontos))
		}
	})

	jogador.onCollide("espinho", () => {
		go("derrota")
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

		onKeyPress(iniciar)
	})


	scene("vitoria", (pontos) => {
		add([
			text("Voce Venceu e ganhou "  + pontos + "moedas"),
			pos(12)
		])

		play("up")

		onKeyPress(iniciar)
	})

	onKeyDown("space", pular)
})

function iniciar(){
	go("game", {
		nivel_fase: 0,
		pontos: 0,
	})
}

iniciar()