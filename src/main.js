import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "sprites/ghosty.png")

const SPEED = 320;
const bala_speed = 800;
const ENEMY_SPEED = 400;

const player = add([
	sprite("bean"),
	pos(100, 100),
	area(),
	anchor("center")
])

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
})

const enemy = add([
	sprite("ghosty"),
	pos(width() - 80, height() - 80),
	anchor("center"),
	// This enemy cycle between 3 states, and start from "idle" state
	state("move", [ "idle", "attack", "move" ]),
])

enemy.onStateEnter("idle", async() => {
	await wait(0.5)
	enemy.enterState("attack")
})

enemy.onStateEnter("move", async () => {
	await wait(2)
	enemy.enterState("idle")
})


enemy.onStateUpdate("move", () => {
	if(!player.exists()) return
		const dir = player.pos.sub(enemy.pos).unit()
		enemy.move(dir.scale(ENEMY_SPEED))
	
})

enemy.onStateUpdate("attack", () => {
	const dir = player.pos.sub(enemy.pos).unit()

	add([
		pos(enemy.pos),
			move(dir, bala_speed),
			rect(12, 12),
			area(),
			offscreen({ destroy: true }),
			anchor("center"),
			color(RED),
			"bullet",
	])
})

player.onCollide("bullet", (bullet) => {
	destroy(bullet),
	destroy(player),
	addKaboom(bullet.pos)
})