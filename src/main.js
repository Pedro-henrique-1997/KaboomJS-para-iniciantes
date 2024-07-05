import kaboom from "kaboom"
// Start game
kaboom()

loadSprite("bean", "/sprites/bean.png")

loop(0.5, () => {
	const jogador = add([
		sprite("bean"),
		pos(rand(vec2(0), vec2(width(), height())))
	])

	wait(3, () => {
		destroy(jogador)
	})
})