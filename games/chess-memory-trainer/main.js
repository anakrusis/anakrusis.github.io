function preload(){
	// uppercase = white pieces
	// lowercase = black pieces
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
	
	//EXAMPLEPGN = loadStrings('pgn/lichess_pgn_2024.08.23_goofysillychess_vs_jd290599.YDv8S5Sb.pgn');
	EXAMPLEPGN = loadStrings('pgn/testpgn.pgn');
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
	
	//EXAMPLEPOS = positionArrayFromFEN("6k1/6p1/2N1pn1p/4P3/r4r2/7P/P5P1/R3R1K1 b - - 0 27");
	//EXAMPLEPOS = positionArrayFromPGN("");
	
	EXAMPLEPOS = new Position();
	EXAMPLEPOS.importPGN( EXAMPLEPGN );
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

function positionArrayFromPGN( pgn ){
	// the output array begins with the chess starting position
	var arrayout = positionArrayFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
	
	var legalmoves = getAllLegalMoves( arrayout, true );
	
	return arrayout;
}

// white to move = true, black to move = false

// the reason this is necessary is unfortunately due to the PGN notation...
// if there is no mention of rank or file, such as Nd2, then only one piece has the legal move to go there, so we must find it
// sometimes this is just because no other piece sees the square, but other times it is because another piece is pinned
function getAllLegalMoves( position, whitetomove ){
	
	// first make a list of all the pieces of this color
	// each item of the array is an object e.g. {x = 0, y = 0}
	var piececoords = [];
	
	for (var x = 0; x < 8; x++){
		for (var y = 0; y < 8; y++){
			var currsquare = position[x][y];
			if (!currsquare){ continue; }
			// uppercase are white pieces; lowercase are black pieces
			if ((currsquare.toUpperCase() === currsquare) == whitetomove){
				// current piece coord
				var cpc = {}; cpc.x = x; cpc.y = y; piececoords.push(cpc);
			}
		}
	}
	
	for (var i = 0; i < piececoords.length; i++){
		var cpc = piececoords[i]; // current piece coord
		//console.log(cpc.x + ", " + cpc.y);
		
		var cpc_legalmoves = getPieceLegalMoves( position, whitetomove, cpc );
	}
}

// white to move is a little redundant since I could just get the color of the piece being moved from the piece coordinates
// but I don't feel like reevaluating it again redundantly so why not just pass it in?
function getPieceLegalMoves( position, whitetomove, coord ){
	console.log(coord.x + ", " + coord.y);
	
	// each legal move out will be an object with a start coordinate and destination coordinate.
	// The start coordinate might seem useless since this function deals with a single piece, but this will be
	// called from the getAllLegalMoves function, so the start coordinate is needed
	var legalmovesout = [];
	var piece = position[coord.x][coord.y];
	console.log(piece);
	
	// PAWN:
	if (piece.toLowerCase() == "p"){
		// the two diagonal squares that a pawn can capture
		var cpx = 1; var cpy = whitetomove ? 1 : -1;
		for (var i = 0; i < 2; i++){
			var tx = coord.x + cpx; var ty = coord.y + cpy;
			var targetsquare = position[tx][ty];
			// cant capture if nothing is on the square
			if ( !targetsquare ){ continue; }
			// can only capture if the target piece color is not the same as our piece color
			if ((currsquare.toUpperCase() === currsquare) != whitetomove){
				var pawncapturemove = {};
				pawncapturemove.start = { "x": coord.x, }
			}
			
			cpx *= -1;
		}
	}
	
	// todo handle pinned piece. if moving this piece off of its current square allows the oppponent
	// to capture the king on their turn, then return an empty list of moves. there are no legal moves for this piece
}

function draw() {
	background(0);
	
	drawChessboard( 100, 100, 500, false, EXAMPLEPOS.posarray );
		
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

// return first index of any of the strings in the array
function firstIndexOfItems(str, items){
	var firstindex = 100000000;
	var nonefound = true;
	for (var i = 0; i < items.length; i++){
		var cfi = str.indexOf(items[i]); // current first index
		// any index which is not -1 but smaller than the previous one found will be used
		if (cfi < firstindex && cfi != -1){ firstindex = cfi; nonefound = false; }
	}
	if (nonefound){ return -1; }
	return firstindex;
}

// return last index of any of the strings in the array
function lastIndexOfItems(str, items){
	var lastindex = 0;
	for (var i = 0; i < items.length; i++){
		if (str.lastIndexOf(items[i]) > lastindex){ lastindex = str.lastIndexOf(items[i]) }
	}
	return lastindex;
}