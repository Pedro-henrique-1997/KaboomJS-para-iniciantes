import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("moeda", "/sprites/coin.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("espinho", "/sprites/spike.png")
loadSound("bell", "/sounds/bell.mp3")

setGravity(2000)

const velocidade = 400;

const level = addLevel([
	"@  > $$$$$$$",
	"============",
], {
	pos: vec2(200, 200),
    tileWidth: 64,
	tileHeight: 64,

	tiles: {
		"@": () => [
			sprite("bean"),
			area(),
			body(),
			anchor("center"),
			"jogador",
		],

		"=": () => [
			sprite("grass"),
			area(),
			body({isStatic: true}),
			anchor("center"),
			"chao",
		],

		"$": () => [
			sprite("moeda"),
			area(),
			anchor("center"),
			"moeda",
		],

		">": () => [
			sprite("espinho"),
			area(),
			body({isStatic: true}),
			"espinho",
		],
	}
})

const jogador = level.get("jogador")[0]

function pular(){
	if(jogador.isGrounded()){
		jogador.jump()
	}
}

onKeyPress("space", pular)

onKeyDown("right", () => {
	jogador.move(velocidade, 0)
})

onKeyDown("left", () => {
	jogador.move(-velocidade, 0)
})

var pontos = 0

var pontosLabel = add([
	text(pontos),
	pos(12, 12)
])

jogador.onCollide("moeda", (moeda) => {
	destroy(moeda);
	pontos++;
	pontosLabel.text = pontos;
    play("bell")
})

jogador.onCollide("espinho", (espinho) => {
	jogador.pos = level.pos2Tile(0, 0)
	shake()
})