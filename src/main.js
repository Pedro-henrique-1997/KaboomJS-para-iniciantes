import kaboom from "kaboom"

kaboom()

loadSprite("bean", "sprites/bean.png")
loadSprite("lightening", "sprites/lightening.png")

add([
	pos(80, 40),
	sprite("bean"),
])

const raio = add([
	sprite("lightening"),
	pos(200, 200),
	rotate(0),
	
])

raio.onUpdate(() => {
	// .angle is a property provided by rotate() component, here we're incrementing the angle by 120 degrees per second, dt() is the time elapsed since last frame in seconds
	raio.angle += 120 * dt()
})
