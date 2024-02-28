MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

CIRCLERADIUS = 0;

var STARPOINTS = [ ];

POINTSIZE = 1; DIFFUSE = false;
SIZE_DIVISORS = [ 128, 64, 32, 20 ]

function setup() {
	document.getElementById("textarea").value = "";
	
	greaterDim = Math.max( windowWidth, windowHeight );
	if (greaterDim > 1500){
		pixelDensity(0.5);
	}
	
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
		var filename = year();
		filename += month().toString().padStart(2,0);
		filename += day().toString().padStart(2,0);
		filename += "_" + hour().toString().padStart(2,0);
		filename += minute().toString().padStart(2,0);
		filename += second().toString().padStart(2,0);
		saveCanvas( filename );
	}
	document.getElementById("btn_clear").onclick = function(){
		STARPOINTS = [];
		document.getElementById("textarea").value = "";
	}
	
	// VIEWPORT CANVAS
	vcanvas		= createCanvas(windowWidth, windowHeight * 0.8);
	vcanvas.touchEnded(VCanvasTouched);
	vcanvas.mouseReleased(VCanvasTouched);
}

function touchStarted() {
	
}

function VCanvasTouched() {
	// current circle x/y
	var ccx = width/2; var ccy = height/2;
	var currradius = Math.sqrt( Math.pow(winMouseX - ccx, 2) + Math.pow(winMouseY - ccy, 2) ) / CIRCLERADIUS
	//console.log(currradius);
	var currangle  = Math.atan2( winMouseY - ccy, winMouseX - ccx )
	//console.log(currangle);
	
	var objname = document.getElementById("textarea").value
	
	var currpoint = new StarPoint( objname, currradius, currangle, POINTSIZE, DIFFUSE )
	STARPOINTS.push( currpoint );
}

function draw() {
	background(0);
	fill(0); stroke(255,0,0)
	CIRCLERADIUS = Math.min(width, height);
	circle( width/2, height/2, CIRCLERADIUS )
	
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
	textSize(CIRCLERADIUS / 20)
	textAlign(LEFT)
	text(datestring + " " + timestring, 0, 64)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight * 0.8);
}

// coordinates are polar
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
		var size = CIRCLERADIUS / SIZE_DIVISORS[ this.size - 1 ]
		circle( currx, curry, size );
		
		fill(255,0,0); stroke(0);
		textAlign(CENTER)
		textSize(CIRCLERADIUS / 32)
		text( this.name, currx, curry - (CIRCLERADIUS / 32) )
	}
}