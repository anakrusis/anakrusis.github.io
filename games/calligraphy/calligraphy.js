// based on the code and article by BUN and Ahmad Moussa, and thank you to Doc for showing me it:
// https://www.gorillasun.de/blog/simulating-brush-strokes-with-hookes-law-in-p5js-and-processing/

// in pixels
GRID_SIZE 				= 72;
GRID_COLUMNS 			= 16;
GRID_ROWS 				= 16;
GRID_STROKE				= 2;
GRID_ENABLED			= true;

// in pixels
DOC_PADDING_OUTER 		= 36;
DOC_PADDING_BTWN_LINES	= 36;

ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6]
currentZoomPreset = 3;

// p5.js image objects
BRUSH_IMAGES 				= [];
BRUSH_COLOR_PRESETS 		= [ [0, 0, 0], [255, 0, 0] ];
BRUSH_COLOR_PRESET_NAMES 	= [ "Black", "Red" ]
brushColor = 0;
brushSensitivity = 1.5;

// text that appears when changing a setting
marqueeText = "";
marqueeTimer = 0;

var SLIDER_SENSITIVITY = document.getElementById("slider_sensitivity");
var HDR_SENSITIVITY = document.getElementById("hdr_sensitivity");
HDR_SENSITIVITY.innerHTML = "Brush sensitivity: " + SLIDER_SENSITIVITY.value;
SLIDER_SENSITIVITY.oninput = function() {
	HDR_SENSITIVITY.innerHTML = "Brush sensitivity: " + this.value;
	brushSensitivity = this.value;
}

function preload() {
	BRUSH_IMAGES[ "ellipse20.png" ] = loadImage("img/brush/ellipse20.png");
}

function setup() {
	BRUSH_ELLIPSE20 = new ImageString(20, 10);
	BRUSH_ELLIPSE20.initFromImage( BRUSH_IMAGES["ellipse20.png"] );
	
	//console.log(BRUSH_ELLIPSE20.colorsToHexString( [255,0,0,1] ));
	
	// ~~~
	
	document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
	
	// VIEWPORT CANVAS
	vcanvas		= createCanvas(1000, 800);
	// DOCUMENT CANVAS
	dcanvas 	= newDocument();
	// GRID CANVAS
	gcanvas 	= newDocumentGrid();
	
	textSize(48);
	textAlign(CENTER, CENTER);
	noSmooth();
}

// returns gcanvas , an offscreen graphics buffer for the grid
function newDocumentGrid() {
	var docwidth = (GRID_SIZE * GRID_COLUMNS) + (2 * DOC_PADDING_OUTER);
	var docheight = (GRID_SIZE * 2 * GRID_ROWS) + (2 * DOC_PADDING_OUTER) + ((GRID_ROWS - 1) * DOC_PADDING_BTWN_LINES);
	var gcanvas = createGraphics(docwidth, docheight);
	gcanvas.fill(0,0,0,0)
	gcanvas.stroke(128,128,255)
	
	var sx, sy; // square x, square y
	for (sy = 0; sy < GRID_ROWS; sy++){
		for (sx = 0; sx < GRID_COLUMNS; sx++){
			// fine x and y
			var fx = (sx * GRID_SIZE) + DOC_PADDING_OUTER;
			var fy = (sy * 2 * GRID_SIZE) + DOC_PADDING_OUTER + (sy * DOC_PADDING_BTWN_LINES);
			gcanvas.rect( fx, fy, GRID_SIZE, GRID_SIZE );
			gcanvas.rect( fx, fy + GRID_SIZE, GRID_SIZE, GRID_SIZE );
		}
	}
	
	return gcanvas;
}

// returns dcanvas , an offscreen graphics buffer for the document 
function newDocument(){
	var docwidth = (GRID_SIZE * GRID_COLUMNS) + (2 * DOC_PADDING_OUTER);
	var docheight = (GRID_SIZE * 2 * GRID_ROWS) + (2 * DOC_PADDING_OUTER) + ((GRID_ROWS - 1) * DOC_PADDING_BTWN_LINES);
	var dcanvas = createGraphics(docwidth, docheight);
	dcanvas.background(255);
	//dcanvas.blendMode(MULTIPLY) // for some reason it slows everything awfully
	
	return dcanvas;
}

// brushSize simply is the thikness of the brush stroke
let brushSize = 20;
let f = 0.5;
let spring = 0.4;
let friction = 0.45;
let v = 0.5;
let r = 0;
let vx = 0;
let vy = 0;
let splitNum = 100;
let diff = 8;

function doMarqueeText(text) {
	marqueeText = text;
	marqueeTimer = 100;
}

function mouseMoved() {
	
}

function mousePressed() {
	
}

function mouseWheel(e) {	
	if (e.delta < 0){
		currentZoomPreset++;
	}else{
		currentZoomPreset--;
	}
	currentZoomPreset = Math.max( currentZoomPreset, 0 );
	currentZoomPreset = Math.min( currentZoomPreset, ZOOM_PRESETS.length - 1 );
	
	cam_zoom = ZOOM_PRESETS[ currentZoomPreset ];
	
	var zoompc = Math.floor(cam_zoom * 100); doMarqueeText("Zoom: " + zoompc + "%");
}

function keyPressed() {
	if (key == "r"){
		brushColor++; brushColor %= 2;
		doMarqueeText( "Brush color: " + BRUSH_COLOR_PRESET_NAMES[ brushColor ] )
	}
	else if (key == "g"){
		GRID_ENABLED = !GRID_ENABLED;
		doMarqueeText( "Grid " + (GRID_ENABLED ? "enabled" : "disabled") )
	}
}

function draw() {
	if (keyIsDown(87)) { // up
		cam_y--;
	}
	else if (keyIsDown(83)) { // down
		cam_y++;
	}
	
	if (keyIsDown(65)) { // left
		cam_x--;
	}
	if (keyIsDown(68)) { // right
		cam_x++;
	}
	
	marqueeTimer--;
	marqueeTimer = Math.max( marqueeTimer, 0 );
	
	clear(); //background(220);
	blendMode(BLEND)
	image(dcanvas, tra_x(0), tra_y(0), dcanvas.width * cam_zoom, dcanvas.height * cam_zoom); // document
	if (GRID_ENABLED){
		blendMode(MULTIPLY)
		image(gcanvas, tra_x(0), tra_y(0), gcanvas.width * cam_zoom, gcanvas.height * cam_zoom); // grid
	}
	// border outlining docment
	fill(0,0,0,0);
	rect( tra_x(0), tra_y(0), dcanvas.width * cam_zoom, dcanvas.height * cam_zoom )
	
	blendMode(DIFFERENCE)
	if (marqueeTimer > 0){
		fill(255); noStroke();
		text( marqueeText, width/2, 40);
	}
	
	if(mouseIsPressed) {
		// MIDDLE CLICK: scroll canvas
		if (mouseButton === CENTER) {
			cam_x -= (movedX / cam_zoom);
			cam_y -= (movedY / cam_zoom);
			
		// LEFT CLICK: draw brush strokes to the canvas
		}else if (mouseButton === LEFT){
			if(!f) {
				f = true;
				x = mouseX;
				y = mouseY;
			}
			
			//if (movedX > 0 || movedY > 0){
				vx += ( mouseX - x ) * spring;
				vy += ( mouseY - y ) * spring;
				vx *= friction;
				vy *= friction;
			//}
			
			if (Math.abs(movedX) > 0 || Math.abs(movedY) > 0){
				v += sqrt( vx*vx + vy*vy ) - v;
				v *= 0.6;
			}

			oldR = r;
			r = brushSize - (v / (cam_zoom / brushSensitivity));

			for( let i = 0; i < splitNum; ++i ) {
				oldX = x;
				oldY = y;
				x += vx / splitNum;
				y += vy / splitNum;
				oldR += ( r - oldR ) / splitNum;
				if(oldR < 1) { oldR = 1; }

				//push()
				//translate(x,y)
				//rotate(PI/2)

				//rx = (x * cos( -PI/2 )) - (y * sin( -PI / 2))
				//ry = (x * sin( -PI/2 )) + (y * cos( -PI/2))

				var bc = BRUSH_COLOR_PRESETS[ brushColor ];
				dcanvas.stroke( bc );
				dcanvas.fill( bc );
				
				var ux = untra_x(x,y); var uy = untra_y(x,y);
				//console.log("ux: " + ux + " uy: " + uy );
				//dcanvas.ellipse( ux, uy, oldR, oldR / 2);

				var centeroffsetX = BRUSH_IMAGES[ "ellipse20.png" ].width / 2;
				var centeroffsetY = BRUSH_IMAGES[ "ellipse20.png" ].height / 2;
				dcanvas.image( BRUSH_IMAGES[ "ellipse20.png" ], ux - centeroffsetX, uy - centeroffsetY, oldR, oldR / 2 )

				//pop();

				//strokeWeight( oldR+diff );  // AMEND: oldR -> oldR+diff
				//line( x, y, oldX, oldY );
				//strokeWeight( oldR );  // ADD
				//line( x+diff*1.5, y+diff*2, oldX+diff*2, oldY+diff*2 );  // ADD
				//line( x-diff, y-diff, oldX-diff, oldY-diff );  // ADD
			}

		} 
	} else if(f) {
		vx = vy = 0;
		f = false;
	}
}