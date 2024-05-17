import kaboom from "kaboom"

kaboom()

loadSprite("bean", "sprites/bean.png")
loadSprite("lightening", "sprites/lightening.png")
loadSprite("grass", "sprites/grass.png");
loadSprite("ghosty", "sprites/ghosty.png");
loadSprite("aco", "sprites/steel.png");

const velocidade = 320;

setGravity(1600)

const bean = add([
	pos(80, 40),
	sprite("bean"),
	area(),
	body(),
])

const a = add([
	sprite("grass"),
	body({isStatic: true}),
	area(),
	pos(center()),
	"grass",
])

const pulo = 1200;

function pular(){
	if(bean.isGrounded()){
		bean.jump(pulo);
	}
}

onKeyDown("space", pular);

add([
	rect(width(), 48),
	outline(4),
	pos(0, height() - 48),
	body({isStatic: true}),
	area(),
])

const b = add([
	sprite("aco"),
	body({mass: 10}),
	area(),
	pos(100, 100),
	"grass",
])

/*

for(var i = 0; i < 5; i++){

	const x = rand(0, width());
	const y = rand(0, height());

	const enemy = add([
		sprite("ghosty"),
		area(),
		pos(x, y),
		"enemy"
	])

}


bean.onUpdate(() => {
	// .isHovering() is provided by area() component, which returns a boolean of if the object is currently being hovered on
	if (bean.isHovering()) {
		bean.color = rgb(0, 0, 255)
	} else {
		bean.color = rgb()
	}
})


bean.onCollide("enemy", (enemy) =>{
	enemy.destroy(enemy);
})

const raio = add([
	sprite("lightening"),
	pos(200, 200),
	rotate(0),
	"raio"
])

/*
raio.onUpdate(() => {
	// .angle is a property provided by rotate() component, here we're incrementing the angle by 120 degrees per second, dt() is the time elapsed since last frame in seconds
	raio.angle += 120 * dt()
})
*/


onClick(() => {
	raio.moveTo(mousePos());
})

onKeyDown("right", () => {
	bean.move(velocidade, 0);
})

onKeyDown("left", () => {
	bean.move(-velocidade, 0);
})

onKeyDown("down", () => {
	bean.move(0, velocidade);
})

onKeyDown("up", () => {
	bean.move(0, -velocidade);
})

onClick(() => {
	addKaboom(raio.pos);
	burp();
})

//debug.inspect = true;