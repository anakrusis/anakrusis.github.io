MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

CIRCLERADIUS = 0;

var STARPOINTS = [ ];

POINTSIZE = 1; DIFFUSE = false;
SIZE_DIVISORS = [ 128, 64, 32, 20 ]

touched_on_frame = false;

function preload(){
	PIECE_TEXTURES = {
		"K": loadImage("img/wK.svg"),
		"Q": loadImage("img/wQ.svg"),
		"R": loadImage("img/wR.svg"),
		"B": loadImage("img/wB.svg"),
		"N": loadImage("img/wN.svg"),
		"P": loadImage("img/wP.svg"),
		
		"k": loadImage("img/bK.svg"),
		"q": loadImage("img/bQ.svg"),
		"r": loadImage("img/bR.svg"),
		"b": loadImage("img/bB.svg"),
		"n": loadImage("img/bN.svg"),
		"p": loadImage("img/bP.svg"),
	}
	// TODO bake transparency into a GHOST_TEXTURES table?
	// (dreadfully slow in real time it seems)
}

function setup() {
/* 	document.getElementById("textarea").value = "";
	
	document.getElementById("btn_size").onclick = function(){
		POINTSIZE += 1; 
		if (POINTSIZE >= 5){
			POINTSIZE = 1;
		}
		this.innerHTML = "Size: " + POINTSIZE
	}
	
	document.getElementById("btn_undo").onclick = function(){
		STARPOINTS.pop();
	}
	document.getElementById("btn_save").onclick = function(){
		
		var year_4char 	= year();
		var month_2char = month().toString().padStart(2,0);
		var day_2char	= day().toString().padStart(2,0);
		var hour_2char	= hour().toString().padStart(2,0);
		var min_2char	= minute().toString().padStart(2,0);
		var sec_2char	= second().toString().padStart(2,0);
		
		var filename = year_4char + month_2char + day_2char + "_" + hour_2char + min_2char + sec_2char;
		var datestamp = year_4char + "-" + month_2char + "-" + day_2char;
		var timestamp = hour_2char + ":" + min_2char + ":" + sec_2char
		
		var objout = {
			"format": 2,
			"objpoints": STARPOINTS,
			"date": datestamp + " " + timestamp
		}
		
		saveCanvas( filename );
		saveJSON(objout, filename + '.json');
	}
	document.getElementById("btn_clear").onclick = function(){
		STARPOINTS = [];
		document.getElementById("textarea").value = "";
	}
	document.getElementById("btn_cleartext").onclick = function(){
		document.getElementById("textarea").value = "";
	}
	
	greaterDim = Math.max( windowWidth, windowHeight );
	if (greaterDim > 1500){
		pixelDensity(0.5);
	}
	// get the screen ratio and make a canvas proportional to it
	//var ratio = (windowHeight * 0.8) / windowWidth
	
	// VIEWPORT CANVAS
	vcanvas	= createCanvas( windowWidth, windowHeight * 0.8 );
	//vcanvas.mouseReleased( VCanvasTouched );
	//vcanvas.touchEnded( VCanvasTouched );
	
	frameRate(10); */
	
	// VIEWPORT CANVAS
	vcanvas	= createCanvas( windowWidth, windowHeight * 0.8 );
	
	EXAMPLEPOS = positionArrayFromFEN("6k1/6p1/2N1pn1p/4P3/r4r2/7P/P5P1/R3R1K1 b - - 0 27");
}

function drawChessboard( drawx, drawy, drawsize, flipped, positionarray ){
	// the checkered background
	noStroke();
	for (var i = 0; i < 8; i++){
		var sx = drawx + (i * (drawsize/8));
		
		for (var j = 0; j < 8; j++){
			var sy = drawy + (j * (drawsize/8));
			
			if (( i + j ) % 2 == 1){
				fill("#968EFF");
			}else{
				fill("#DBD8FF");
			}
			rect(sx, sy, drawsize/8, drawsize/8);
			
		}
	}
	
	// the pieces are placed 
	var sx, sy;
	for (var x = 0; x < 8; x++){
		
		if (flipped){ 	sx = drawx + ((7 - x) * (drawsize/8)); }
		else { 			sx = drawx + (x * drawsize/8); }
		
		for (var y = 0; y < 8; y++){
			
			if (flipped){ 	sy = drawy + (y * (drawsize/8)); }
			else { 			sy = drawy + ((7 - y) * drawsize/8); }
			
			if (positionarray[x][y]){
				image(PIECE_TEXTURES[ positionarray[x][y] ], sx, sy, drawsize/8, drawsize/8 );
			}
		}
	}
}

function positionArrayFromFEN( fen ){
	// the output is a 8x8 array
	var arrayout = [];
	for (var x = 0; x < 8; x++){
		arrayout[x] = [];
	}
	
	var rank = 7; var file = 0;
	for (var i = 0; i < fen.length; i++){
		var cc = fen.charAt(i);
		if (cc == "/"){
			rank--;
			file = 0;
			
		} else if (cc >= '0' && cc <= '9'){
			file += parseInt(cc);
			
		} else {
			arrayout[file][rank] = cc;
			file++;
		}
		
		if (file > 7 && rank == 0){ break; }
	}
	
	return arrayout;
}

function draw() {
	background(0);
	
	drawChessboard( 100, 100, 500, false, EXAMPLEPOS );
		
/* 	touched_on_frame = false;
	
	background(0);
	
	// current circle x/y
	var ccx = width/2; var ccy = height/2;
	
	// crosshair
	strokeWeight( 3 )
	// half red for crosshair and fov circle
	stroke(128,0,0)
	var ANGLEDIVISON = Math.PI / 4
	var linecount = Math.floor(( 2 * Math.PI ) / ANGLEDIVISON)
	var currangle = 0;
	for (var i = 0; i < linecount; i++){
		var currx = (CIRCLERADIUS * Math.cos( currangle )) + ccx;
		var curry = (CIRCLERADIUS * Math.sin( currangle )) + ccy;
		line ( ccx, ccy, currx, curry )
		
		currangle += ANGLEDIVISON;
	}
	
	//line( 0,   ccy, width,	ccy )
	//line( ccx, 0,	ccx,	height )
	
	strokeWeight(3)
	fill(0,0,0,0); 
	CIRCLERADIUS = Math.min(width / 2, height / 2);
	circle( ccx, ccy, CIRCLERADIUS * 2 )
	
	// full red for star points and text
	strokeWeight( 1 )
	stroke(255,0,0)
	for (var i = 0; i < STARPOINTS.length; i++){
		STARPOINTS[i].drawPoint();
	}
	
	var datestring 		= year() + " " + MONTH_NAMES[ month() - 1 ] //+ " " + day();
	var daystring 		= day().toString().padStart(2,0); datestring += " " + daystring;
	
	var hourstring 		= hour().toString().padStart(2,0); 
	var minutestring	= minute().toString().padStart(2,0);
	var secondstring	= second().toString().padStart(2,0);
	var timestring 		= hourstring + ":" + minutestring + ":" + secondstring;
	
	fill(255,0,0); stroke(0);
	textSize((CIRCLERADIUS*2) / 20)
	textAlign(LEFT)
	text(datestring + " " + timestring, 0, 64)
	//text(width + "x" + height, 0, 128) */
}

/* // coordinates are polar
class StarPoint {
	constructor(name, rad, angle, size, diffuse){
		this.name 		= name;
		// 1: the edge of the circle. 0: the center
		this.radius		= rad;
		// in radians
		this.angle		= angle;
		this.size		= size;
		this.diffuse	= diffuse;
	}
	
	drawPoint(){
		// current circle x/y/rad
		var ccx = width/2; var ccy = height/2; var crad = this.radius * CIRCLERADIUS
		var currx = (crad * Math.cos( this.angle )) + ccx;
		var curry = (crad * Math.sin( this.angle )) + ccy;
		
		fill(255,0,0);
		var size = (CIRCLERADIUS*2) / SIZE_DIVISORS[ this.size - 1 ]
		circle( currx, curry, size );
		
		fill(255,0,0); stroke(0);
		textAlign(CENTER)
		textSize((CIRCLERADIUS*2) / 32)
		text( this.name, currx, curry - ((CIRCLERADIUS*2) / 32) )
	}
} */