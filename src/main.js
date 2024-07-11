import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")

function funky(){

	let isFunky = false;

	return {
		
		id: "funky",

		require: ["scale", "color"],

		add(){

		},

		update(){

			if(!isFunky) return
			this.color = rgb(rand(0, 255), rand(0, 255), rand(0, 255)),
			this.scale = rand(1, 2)

		},

		drawn(){

		},

		destroy(){

		},

		inspect(){
           return isFunky ? "one" : "off";
		},

		getFunky(){
			isFunky = true;
		}

	}
}

const bean = add([
	sprite("bean"),
	scale(1),
	pos(center()),
	anchor("center"),
	color(),
	area(),
	funky(),
	"friend",
	{
		coolness: 100,
    }
])

onKeyPress("space", () => {
	if(bean.coolness >= 100){
		bean.getFunky()
	}
})

onKeyPress("r", () => {
	bean.use(rotate(rand(0, 360)))
})

onKeyPress("a", () => {
	bean.unuse("funky")
})

add([
	text("Aperte SPACE para começar"),
	pos(12, 12),
])