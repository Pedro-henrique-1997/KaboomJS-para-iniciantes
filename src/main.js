import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("grass", "/sprites/grass.png")
loadSound("bell", "/sounds/bell.mp3")

const SPEED = 500;

setGravity(2400)

const level = addLevel([
	"$$$$$$$$$",
	"@  ^   $$",
	"=========",
],  {
	tileWidth: 64,
	tileHeight: 64,

	pos: vec2(400, 200),

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

		"^": () => [
			sprite("spike"),
			area(),
			body({isStatic: true}),
			anchor("bot"),
			"espinho",
		]
	}
})

const player = level.get("player")[0]

onKeyDown("space", () => {
	if(player.isGrounded()){
		player.jump(800)
	}
})

onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

player.onCollide("moeda", (moeda) => {
	destroy(moeda);
	play("bell");
})

player.onCollide("espinho", (espinho) => {
	player.pos = level.tile2Pos(0, 0);
})