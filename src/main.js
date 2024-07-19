import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("coin", "/sprites/coin.png")
loadSound("bell", "/sounds/bell.mp3")

setGravity(2400)

const SPEED = 400;

const fase = addLevel([
	"@  = $$$$$$$ $$$",
	"= ======== =====",
], {
	tileWidth: 64,
	tileHeight: 64,
	pos: vec2(350, 200),
	tiles: {
		"@": () => [
			sprite("bean"),
			area(),
			body(),
			anchor("bot"),
			"player"
		],

		"$": () => [
			sprite("coin"),
			area(),
			anchor("bot"),
			"moeda",
		],
		
		"=": () => [
			sprite("grass"),
			body({isStatic: true}),
			anchor("bot"),
			area(),
			"grass",
		],
	}
})

const jogador = fase.get("player")[0]

onKeyDown("right", () => {
	jogador.move(SPEED, 0)
})

onKeyDown("left", () => {
	jogador.move(-SPEED, 0)
})

onKeyPress("space", () => {
	if (jogador.isGrounded()) {
		jogador.jump()
	}
})

jogador.onUpdate(() => {
	camPos(jogador.worldPos())
})

var pontos = 0;

var pontosLabel = add([
	text(pontos),
	pos(12, 12),
	fixed()
])

jogador.onCollide("moeda", (moeda) => {
    moeda.destroy();
	pontos++;
	play("bell")
})

pontosLabel.onUpdate(() => {
	
	pontosLabel.text = pontos;
})

onClick(() => {
	addKaboom(toWorld(mousePos()))
	
})