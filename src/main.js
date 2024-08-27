import kaboom from "kaboom"

kaboom({
	background: [141, 183, 255],
})

// load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("bag", "/sprites/bag.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("steel", "/sprites/steel.png")
loadSprite("prize", "/sprites/jumpy.png")
loadSprite("apple", "/sprites/apple.png")
loadSprite("portal", "/sprites/portal.png")
loadSprite("coin", "/sprites/coin.png")
loadSound("bell", "/sounds/bell.mp3")
loadSound("powerup", "/sounds/powerup.mp3")
loadSound("blip", "/examples/sounds/blip.mp3")
loadSound("hit", "/examples/sounds/hit.mp3")
loadSound("portal", "/sounds/cano.mp3")

const JUMP_FORCE = 1320
const MOVE_SPEED = 480
const FALL_DEATH = 2400

setGravity(2400)

function patrol(speed = 60, dir = 1){
	return{
		id:"patrol",
		require: ["pos", "area"],

		add(){
			this.on("collide", (obj, col) => {
				if(col.isLeft() || col.isRight()){
					dir = -dir
				}
			})
		},
		update(){
			this.move(speed * dir, 0)
		}
	}
}

function big(){
	let time = 0;
	let isBig = false;
	let deatScale = 1;

	
}

const LEVELS = [
	[
		"    0       ",
		"   --       ",
		"       $$   ",
		" %    ===   ",
		"            ",
		"   ^  > = @",
	"===================",
	],
	[
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"           $$         =   $",
		"  %      ====         =   $",
		"                      =   $",
		"                      =    ",
		"       ^^      = >    =   @",
		"===========================",
	],
	[
		"     $    $    $    $     $",
		"     $    $    $    $     $",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		" ^^^^>^^^^>^^^^>^^^^>^^^^^@",
		"===========================",
	],

	[
		"  %$$     $$$    $$$   @",
		"  ==  >  ===  > === ====",
		"============================",
	]
]

const levelConf = {
	tileWidth: 64,
	tileHeight: 64,

	tiles: {
		"=": () => [
			sprite("grass"),
			area(),
			body({isStatic: true}),
			anchor("bot"),
			"plataform",
		],

		"-": () => [
			sprite("steel"),
			area(),
			body({isStatic: true}),
			anchor("bot"),
		],

		"0": () => [
			sprite("bag"),
			area(),
			body({isStatic: true}),
			anchor("bot"),
		],

		"$": () => [
			sprite("coin"),
			area(),
			pos(0, -9),
			anchor("bot"),
			"coin",
		],

		"%": () => [
			sprite("prize"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			offscreen({ hide: true }),
			"prize",
		],
		"^": () => [
			sprite("spike"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			offscreen({ hide: true }),
			"danger",
		],

		"#": () => [
			sprite("apple"),
			area(),
			anchor("bot"),
			body(),
			"apple",
		],
		">": () => [
			sprite("ghosty"),
			area(),
			anchor("bot"),
			body(),
			patrol(),
			"enemy",
		],
		"@": () => [
			sprite("portal"),
			area({ scale: 0.5 }),
			anchor("bot"),
			pos(0, -12),
			"portal",
		],
	}
}

scene("game", ({levelIdx, coins} = {levelIdx: 0, coins: 0}) => {

	const level = addLevel(LEVELS[levelIdx ?? 0], levelConf)

	const player = add([
		sprite("bean"),
		pos(0, 10),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		//big(),
		anchor("bot"),
	])

	player.onUpdate(() => {
		// center camera to player
		camPos(player.pos)
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("derrota")
		}
	})

	function jump(){
		if(player.isGrounded()){
			player.jump(1000)
		}
	}

	onKeyDown("right", () => {
		player.move(MOVE_SPEED, 0)
	})

	onKeyDown("left", () => {
		player.move(-MOVE_SPEED, 0)
	})


	let coinsLabel = add([
		text(coins),
		pos(12),
		fixed(),
	])

	player.onCollide("coin", (coin) => {
		coins++;
		destroy(coin);
		play("bell");
		coinsLabel.text =  coins;
	})

	player.onCollide("portal", () => {
		if(levelIdx + 1 < LEVELS.length){
			go("game", {
				levelIdx: levelIdx + 1,
				coins: coins,
			})
		}else{
			go("vitoria")
		}
	})
	
	player.onGround((l) => {
		if(l.is("enemy")){
			player.jump(JUMP_FORCE * 1.5)
			destroy(l)
			addKaboom(l.pos)
			burp()
		}
	})

	player.onCollide("danger", () => {
		go("derrota")
	})

	player.onCollide("enemy", (e, col) => {
		if(!col.isBottom()){
			go("derrota")
		}
	})

	player.onHeadbutt((obj) => {
		if(obj.is("prize") ){
			const apple = level.spawn("#", obj.tilePos.sub(0, 1))
			apple.jump()
		}
	})

	player.onCollide((apple) => {
		
	})


	onKeyPress("space", jump)
})

scene("derrota",() => {
	add([
		text("Voce Perdeu")
	])

	onKeyPress(() => go("game"))
})

scene("vitoria",() => {
	add([
		text("Voce Venceu")
	])

	onKeyPress(() => go("game"))
})

go("game")