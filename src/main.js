import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("espinho", "/sprites/spike.png");
loadSprite("coin", "/sprites/coin.png");
loadSound("bell", "/sounds/bell.mp3");

setGravity(2400)

const velocidade = 500;

const fase = addLevel([
	"$$$$$$$$$$$",
	"@     : $$$",
	"==========="
], {
	tileWidth: 64,
	tileHeight: 64,

	pos: vec2(450, 250),

	tiles: {
		"@": () => [
			sprite("bean"),
			body(),
			area(),
			anchor("bot"),
			"jogador",
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
			area(),
			anchor("bot"),
			"chao",
		],

		":": () => [
			sprite("espinho"),
			body({isStatic: true}),
			area(),
			anchor("bot"),
			"espinho",
		],
	}

})

const jogador = fase.get("jogador")[0];

function pular(){
	if(jogador.isGrounded()){
		jogador.jump();
	}
}

onKeyDown("space", pular);

onKeyDown("right", () => {
	jogador.move(velocidade, 0);
})

onKeyDown("left", () => {
	jogador.move(-velocidade, 0);
})

jogador.onCollide("moeda", (moeda) => {
	moeda.destroy();
	play("bell");
})

jogador.onCollide("espinho", (espinho) => {
	jogador.pos = fase.tile2Pos(0, 0);
})