import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png");
loadSprite("grass", "/sprites/grass.png");
loadSprite("spike", "/sprites/spike.png");
loadSprite("coin", "/sprites/coin.png");
loadSound("bell", "/sounds/bell.mp3");

setGravity(2400)

const SPEED = 500;

const level = addLevel([
	"$$$$$$$$$",
	"@    :   ",
	"=========",
], {
	tileWidth: 64,
	tileHeight: 64,

	pos: vec2(200, 200),

	tiles: {
		"@": () => [
			sprite("bean"),
			anchor("bot"),
			area(),
			body(),
			"jogador",
		],

		"$": () => [
			sprite("coin"),
			anchor("bot"),
			area(),
			"moeda",
		],

		":": () => [
			sprite("spike"),
			body({isStatic: true}),
			anchor("bot"),
			area(),
			"espinho",
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

const player = level.get("jogador")[0];

onKeyDown("space", () => {
	if(player.isGrounded()){
		player.jump();
	}
})

onKeyDown("right", () => {
	player.move(SPEED, 0);
})

onKeyDown("left", () => {
	player.move(-SPEED, 0);
})

player.onCollide("moeda", (moeda) => {
	moeda.destroy();
	play("bell");
})

player.onCollide("espinho", (espinho) => {
	player.pos = level.tile2Pos(0, 0);
})