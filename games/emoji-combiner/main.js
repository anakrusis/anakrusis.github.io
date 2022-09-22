var textinput = document.getElementById("emoji");
var images = {};

function preload() {
	images = {
		"smiley_base":  loadImage('img/smiley_base.png'), 
		"slight_smile": loadImage('img/slight_smile.png'), 
		"smiling_imp": loadImage('img/smiling_imp.png'), 
	}
}

function setup(){
	let canvasElement = createCanvas(640,640).elt;
    let context = canvasElement.getContext('2d');
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
	
	
	textinput.addEventListener("input", function () {
		//console.log("form has changed!");
		drawEmoji();
	});
}

function draw(){
	//background(128);
	//image(img,0,0,640,640);
	//console.log(emoji.value);
	
}

function drawEmoji(){
	var val = textinput.value;
	clear();
	
	for (const chara of val) {
		if (!(/\p{Extended_Pictographic}/u.test(chara))){ continue; }
		
		console.log(chara);
		if (!templates[chara]){ continue; }
		
		var template = templates[chara];
		if (!images[template.img]){ continue; }
		
		if ( images[template.baseimg] ){
			var cb = images[template.baseimg];
			tint( template.color )
			image(cb,0,0,640,640);
		}
		var ci = images[template.img];
		tint( template.color )
		image(ci,0,0,640,640);
	}
}

// EMOJI TYPES
// "face" goes on top of "base"
// "topper" goes on top of base and face in unique ways... hmmm...

// Templates
class EmojiTemplate{
	constructor(img,type,base,color){
		this.type = type;
		this.color = color;
		this.img     = img;
		this.baseimg = base;
	}
}

var templates = {
	
	"🙂": new EmojiTemplate( "slight_smile", "face", "smiley_base", [255,204,77] ),
	"😈": new EmojiTemplate( "smiling_imp", "face", "smiley_base", [255,204,77] ),
}