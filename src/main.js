import kaboom from "kaboom"

kaboom({
	background: [141, 183, 255],
})

loadSprite("bigyoshi", "/examples/sprites/YOSHI.png")
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
loadSound("coin", "/sounds/bell.mp3")
loadSound("powerup", "/sounds/powerup.mp3")
loadSound("blip", "/examples/sounds/blip.mp3")
loadSound("hit", "/examples/sounds/hit.mp3")
loadSound("portal", "/sounds/cano.mp3")
loadSound("bell", "/sounds/bell.mp3")

//Funcoes de comportamento

function patrol(speed = 70, dir = 1){
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
	let isBig = false
	let timer = 0
	let destScale = 1
	
	return {
		id: "big",
		require: ["scale"],

		update(){
			if(isBig){
				timer -= dt()
				if(timer <= 0){
					this.smalliffy()
				}
			}

			this.scale = this.scale.lerp(vec2(destScale), dt() * 6)
		},
        
		isBig(){
			return isBig
		},	
		
		smalliffy(){
			timer = 0
			isBig = false
			destScale = 1
		},

		bigiffy(time){
			timer = time
			destScale = 2
			isBig = true
		}
	}
}

const FASES = [
	[
		"    0       ",
		"   --       ",
		"       $$   ",
		" %    ===   ",
		"            ",
		"   ^^  > = @",
		"============",
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
]


setGravity(2400)

const velocidade = 500;

scene("game", ({nivel, pontos}) => {
	const fase = addLevel(FASES[nivel || 0], {
		tileWidth: 64,
		tileHeight: 64,
		tiles: {
			"=": () => [
				sprite("grass"),
				area(),
				body({ isStatic: true }),
				anchor("bot"),
				offscreen({ hide: true }),
				"platform",
			],
			"-": () => [
				sprite("steel"),
				area(),
				body({ isStatic: true }),
				offscreen({ hide: true }),
				anchor("bot"),
			],
			"0": () => [
				sprite("bag"),
				area(),
				body({ isStatic: true }),
				offscreen({ hide: true }),
				anchor("bot"),
			],
			"$": () => [
				sprite("coin"),
				area(),
				pos(0, -9),
				anchor("bot"),
				offscreen({ hide: true }),
				"moeda",
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
				"espinho",
			],
			"#": () => [
				sprite("apple"),
				area(),
				anchor("bot"),
				body(),
				offscreen({ hide: true }),
				"apple",
			],
			">": () => [
				sprite("ghosty"),
				area(),
				anchor("bot"),
				body(),
				patrol(),
				offscreen({ hide: true }),
				"enemy",
			],
			"@": () => [
				sprite("portal"),
				area({ scale: 0.5 }),
				anchor("bot"),
				pos(0, -12),
				offscreen({ hide: true }),
				"portal",
			],
		},
		
	})

	const player = add([
		sprite("bean"),
		pos(0, 2),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		big(),
		anchor("bot"),
	])

	const JUMP_FORCE = 1320


	function pular(){
		if(player.isGrounded()){
			player.jump(JUMP_FORCE)
		}
	}

	onKeyDown("space", pular)

	onKeyDown("right", () => {
		player.move(velocidade, 0)
	})

	onKeyDown("left", () => {
		player.move(-velocidade, 0)
	})

	player.onUpdate(() => {
		if(player.pos.y >= 2400){
			go("derrota")
		}
	})

	var pontosLabel = add([
		text(pontos),
		pos(12),
		fixed(),
	])

	player.onCollide("moeda", (moeda) => {
		destroy(moeda);
		pontos++;
		pontosLabel.text = pontos;
		play("bell")
	})

	player.onUpdate(() => {
		camPos(player.pos)
	})

	let hasApple = false

	

	player.onCollide("portal", () => {
		if(nivel < FASES.length - 1){
			go("game", {
				nivel: nivel + 1,
				pontos: pontos
			})
		}else{
			go("Vitoria", {pontos: pontos})
		}
	})

	player.onHeadbutt((obj) => {
		if(obj.is("prize") && !hasApple){
			hasApple = true
			let maca = fase.spawn("#", obj.tilePos.sub(0, 1))
			maca.jump()
		}
	})

	player.onCollide("apple",(obj) => {
		hasApple = false
		destroy(obj)
		player.bigiffy(3)
	})

	player.onCollide("espinho", () => {
		go("derrota")
	})


	// grow an apple if player's head bumps into an obj with "prize" tag
	
})

scene("derrota", () => {
	add([
		text("Voce Perdeu"),
		pos(12),
	])

	onKeyPress(comecarGame)
})

scene("Vitoria", ({pontos}) => {
	add([
		text("Voce Venceu! E pegou " + pontos + " moedas"),
		pos(12)
	])

	onKeyPress(comecarGame)
})

function comecarGame(){
	go("game", {
		nivel: 0,
		pontos: 0,
	})
}

comecarGame()