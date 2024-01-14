// based on the code and article by BUN and Ahmad Moussa, and thank you to Doc for showing me it:
// https://www.gorillasun.de/blog/simulating-brush-strokes-with-hookes-law-in-p5js-and-processing/

function setup() {
	document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
	
	// VIEWPORT CANVAS
	vcanvas	= createCanvas(1000, 500);
	// DOCUMENT CANVAS
	dcanvas = createGraphics(500, 500);
	dcanvas.background(255);
	
	//ellipseMode(CENTER);
}

// brushSize simply is the thikness of the brush stroke
let brushSize = 40;
let f = 0.5;
let spring = 0.4;
let friction = 0.45;
let v = 0.5;
let r = 0;
let vx = 0;
let vy = 0;
let splitNum = 100;
let diff = 8;

function mouseMoved() {
	
}

function mousePressed() {
	
}

function mouseWheel(e) {
	
}

function keyPressed() {
	
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
	
	clear();
	image(dcanvas, tra_x(0), tra_y(0));
	
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

			vx += ( mouseX - x ) * spring;
			vy += ( mouseY - y ) * spring;
			vx *= friction;
			vy *= friction;

			v += sqrt( vx*vx + vy*vy ) - v;
			v *= 0.6;

			oldR = r;
			r = brushSize - v;

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

				dcanvas.fill(0);
				var ux = untra_x(x,y); var uy = untra_y(x,y);
				console.log("ux: " + ux + " uy: " + uy );
				dcanvas.ellipse( ux, uy, oldR, oldR / 2);

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