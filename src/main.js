import kaboom from "kaboom"

kaboom()

const SPEED = 320;
const BULLET_SPEED = 700;
const ENEMY_SPEED = 320;

loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")

const player = add([
	sprite("bean"),
	pos(80, 80),
	area(),
	anchor("center")
])

onKeyDown("down", () => {
	player.move(0, SPEED)
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

const enemy = add([
	sprite("ghosty"),
	anchor("center"),
	pos(width() - 80, height() - 80),
	state("move", ["idle", "atack", "move"]),
])

enemy.onStateEnter("idle", async () => {
	await wait(0.5)
	enemy.enterState("atack")
})

enemy.onStateEnter("atack", async() => {
	if(player.exists()){

        const dir = player.pos.sub(enemy.pos).unit()

		add([
			pos(enemy.pos),
			move(dir, BULLET_SPEED),
			rect(12, 12),
			area(),
			offscreen({destroy: true}),
			anchor("center"),
			color(BLUE),
			"bullet",
		])

		await wait(1)
		enemy.enterState("move")
	}
})

enemy.onStateEnter("move", async() => {
	await wait(2)
	enemy.enterState("idle")
})

enemy.onStateUpdate("move", () => {
	if(!player.exists()) return
	const dir = player.pos.sub(enemy.pos).unit()
	enemy.move(dir.scale(ENEMY_SPEED))
})

player.onCollide("bullet", (bullet) => {
	destroy(player)
	destroy(bullet)
	addKaboom(bullet.pos)
})