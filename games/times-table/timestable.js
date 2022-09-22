CELL_SIZE = 57;
BASE_FREQ = 20;
COLOR_FADE_PER_TICK = 0.5;

voices = 0;

cells = [];
cnv = null;
var osc;

var mostRecentNoteFreq = 0;

function preload(){
	
	// Initializing the piano sounds
	soundFormats('mp3');
	piano = {};
	sourceFreqs = [110,165,220,330,440,660,880,1320,1760];
	for (var i = 0; i < sourceFreqs.length; i++){
		piano[ sourceFreqs[i] ] = loadSound("assets/" + sourceFreqs[i] );
	}
	
	// Initializing the times table cells
	for (var i = 1; i <= 12; i++){
		
		cells[i] = [];
		
		for (var j = 1; j <= 12; j++){
			
			var c = new Cell(i,j);
			c.initSoundSource();
			//c.soundsource = new p5.Oscillator('sine');
			cells[i][j] = c;
		}
	}	
}

function windowResized() {
	cnv.center('horizontal');
}

function setup(){
	cnv = createCanvas(800, 800);
	cnv.center('horizontal');
	frameRate(60);
	textFont("Courier"); textSize(20); textAlign(CENTER);
}

function mousePressed() {
	
	var ix = Math.floor(mouseX / CELL_SIZE); var iy = Math.floor(mouseY / CELL_SIZE);
	//console.log(ix + " " + iy);
	
	var cell = cells[ix][iy];
	
/* 	cell.soundsource.start();
	cell.soundsource.freq(cell.val * BASE_FREQ);
    cell.soundsource.amp(0.25); */
	mostRecentNoteFreq = BASE_FREQ * cell.val;
	cell.soundsource.rate(cell.coeff);
	cell.soundsource.play();
	
	voices++;
}

function draw(){
	background(230)
	
	for (i=1; i<cells.length; i++){
		for (j=1; j<cells[i].length; j++){
			
			cells[i][j].update();
			cells[i][j].render();
		}
	}
	
	mostRecentNoteFreq = null;
	
	fill(0)
	text(voices, 15, 30)
}

class Cell {
	
	constructor(x,y){
		
		this.x = x;
		this.y = y;
		this.val = x * y;
		this.padding = 25;
		
		this.soundsource = null;
		
		this.r = 255;
		this.g = 255;
		this.b = 255;
	}
	
	initSoundSource(){
		
		var nearest = null; var closestDist = 100000000000;
		var freq = ( BASE_FREQ * this.val );
		for (var i = 0; i < sourceFreqs.length; i++){
			if ( Math.abs( sourceFreqs[i] - freq ) < closestDist ) {
				nearest = sourceFreqs[i]; closestDist = Math.abs(sourceFreqs[i] - freq);
			}
		}
		this.coeff = freq / nearest;
		var path = 'assets/' + nearest;
		this.soundsource = loadSound(path);
		this.soundsource.playMode('restart');
		
		this.soundsource.onended(function e(){
			voices--;
		});
		
		//this.soundsource = piano[nearest];
	}
	
	update(){
		this.r += COLOR_FADE_PER_TICK; this.g += COLOR_FADE_PER_TICK; this.b += COLOR_FADE_PER_TICK;
		this.r = Math.min(this.r, 255); this.g = Math.min(this.g, 255); this.b = Math.min(this.b, 255); 
		this.r = Math.max(this.r, 0); this.g = Math.max(this.g, 0); this.b = Math.max(this.b, 0); 
		
		var freq = ( BASE_FREQ * this.val );
		// The note itself being played
		if ( freq == mostRecentNoteFreq ){
			this.r -= 128; this.g -= 128; this.b -= 128;
		}else{
		// Various ratios to the note being played	
			
			for (var q = -8; q < 8; q++){
				
				var f = Math.pow(2,q);
				if ( freq == mostRecentNoteFreq * f ){
						
					this.r -= 128; this.g -= 128;
				}
			}
			for (var q = -8; q < 8; q++){
				
				var f = 3 * Math.pow(2,q);
				if ( freq == mostRecentNoteFreq * f ){
						
					this.b -= 128; this.g -= 128;
				}
			}
			for (var q = -8; q < 8; q++){
				
				var f = 5 * Math.pow(2,q);
				if ( freq == mostRecentNoteFreq * f ){
						
					this.b -= 128; this.r -= 128;
				}
			}
		}
	}
	
	render(){
		fill(this.r, this.g, this.b); stroke(0);
		rect( this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE );
		
		var b = ( (this.r + this.g + this.b)/3 < 64 ) ? 255 : 0;
		fill(b);
		var tx = this.x * CELL_SIZE + this.padding; var ty = this.y * CELL_SIZE + this.padding + 10; 
		text( this.val, tx, ty )
	}
}