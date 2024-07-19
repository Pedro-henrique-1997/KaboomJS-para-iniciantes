import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("coin", "/sprites/coin.png")
loadSound("bell", "/sounds/bell.mp3")

setGravity(2400)

const SPEED = 480;

const level = addLevel([
	"@  = $$$$$$$$",
	"=============",
], {
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
	}
})

const player = level.get("player")[0];

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

player.onUpdate(() => {
	camPos(player.worldPos())
})

var score = 0;

const scoreLabel = add([
	text(score),
	pos(12, 12),
	fixed()
])

player.onCollide("coin", (coin) => {
     coin.destroy()
	 score++;
	 scoreLabel.text = score
	 play("bell")
})

onClick(() => {
	addKaboom(toWorld(mousePos()))
	burp()
})