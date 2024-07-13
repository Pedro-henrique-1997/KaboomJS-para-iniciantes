import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")

function funky(){
	let isFunky = false;

	return {
        
		id: "funky",

		require: ["color", "scale"],

		add() {

		},

		destroy(){

		},

		update(){
			if(!isFunky) return
			this.color = rgb(rand(0, 255), rand(0, 255), rand(0, 255)),
			this.scale = rand(1, 2)
		},

		inspect(){
			return isFunky ? "on" : "off"
		},

		getFunky(){
			isFunky = true
		},
	}
}

const bean = add([
	sprite("bean"),
	pos(center()),
	scale(1),
	area(),
	anchor("center"),
	color(),
	funky(),
	{
		coolness:  100,
	},
])

onKeyPress("space", () => {
	if(bean.coolness >= 100){
		bean.getFunky()
	}
})

onKeyPress("d", () => {
	bean.use(rotate(rand(0, 360)))
})

onKeyPress("a", () => {
	bean.unuse("funky")
})

add([
	text("Aperte SPACE para começar"),
	pos(12, 12),
])