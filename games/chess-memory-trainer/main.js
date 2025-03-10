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
	
	EXAMPLEPGN = loadStrings('pgn/lichess_pgn_2024.08.23_goofysillychess_vs_jd290599.YDv8S5Sb.pgn');
	//EXAMPLEPGN = loadStrings('pgn/testpgn.pgn');
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
	*/
	
	document.getElementById("btn_info").onclick = function(){
		client.timer = 1;
	}
	
	document.getElementById("btn_next").onclick = function(){
		if (client.state == "start"){
			client.leftposition.importPGN( EXAMPLEPGN, true );
			client.rightposition = new Position
			
			client.showleftboard = true;
			client.state = "countdown"; 
			client.timer = client.countdownlength;
			this.style.visibility = 'hidden';
			
		}else if (client.state == "input"){
			client.state = "result";
			client.showleftboard = true;
			client.draggedpiece = null;
			this.innerHTML = "Next";
			this.style.visibility = 'hidden';
			client.resultnextbtncooldown = client.resultnextbtncooldownamount;
	
			var linkstartstring; var linkendstring;
			if (client.sitelink){
				// opens link in new tab
				linkstartstring = "<a href=\"" + client.sitelink + "#" + (client.ply-1) + "\" target=\"_blank\" rel=\"noopener noreferrer\">"
				linkendstring	= "</a>"
			}else{
				linkstartstring = ""; linkendstring = "";
			}
			
			var matching = client.arePositionsMatching();
			if (matching){
				document.getElementById("btn_info").innerHTML = linkstartstring + "Correct!" + linkendstring;
				client.score++;
				
			}else{
				document.getElementById("btn_info").innerHTML = linkstartstring + "Incorrect!" + linkendstring;
			}
			client.total++;
			document.getElementById("btn_counter").innerHTML = client.score + " / " + client.total;
			
			
		}else if (client.state == "result"){
			client.leftposition.importPGN( EXAMPLEPGN, true );
			client.rightposition = new Position
			
			client.showleftboard = true; client.showrightboard = false;
			client.state = "countdown"; 
			client.timer = client.countdownlength;
			this.style.visibility = 'hidden';
		}
	}
	
	// reduced resolution on my phone screen so it runs better and doesnt waste my battery lol
	greaterDim = Math.max( windowWidth, windowHeight );
	if (greaterDim > 1500){
		pixelDensity(0.5);
	}
	
	// VIEWPORT CANVAS
	vcanvas	= createCanvas( windowWidth, windowHeight * 0.92 );
	frameRate(10);
	textSize(windowHeight / 32); 
	
	//EXAMPLEPOS = positionArrayFromFEN("6k1/6p1/2N1pn1p/4P3/r4r2/7P/P5P1/R3R1K1 b - - 0 27");
	//EXAMPLEPOS = positionArrayFromPGN("");
	
	client = new Client
	client.positionBoardsAndButtons();
	client.leftposition.importPGN( EXAMPLEPGN, true );
}

function mousePressed(e){
	// this cooldown is to prevent the double tap glitch ive been getting
	if (client.clickcooldowntimer > 0){
		return;
	}
	client.clickcooldowntimer = client.clickcooldownamount;
	
	// the buttons and board interactions only work in the input mode
	if (client.state != "input"){ return; }
	
	// first check for if any of the ui buttons have been pressed
	for (var i = 0; i < client.buttons.length; i++){
		var cb = client.buttons[i];
		if (mouseX > cb.x && mouseX < cb.x+cb.width && mouseY > cb.y && mouseY < cb.y+cb.height){	
			// the buttons toggle, so e.g. if you have rook selected and click the rook button again it unselects
			if (client.draggedpiece == cb.piecevalue){
				client.draggedpiece = null;
			}else{
				client.draggedpiece = cb.piecevalue;
			}
			return;
		}
	}
	
	var sx = client.screenToCoordX(mouseX); var sy = client.screenToCoordY(mouseY);
	
	if (sx < 0 || sx > 7 || sy < 0 || sy > 7){ return; }
	//console.log(sx + " " + sy)
	
/* 	if (client.leftposition.getSquare(sx,sy)){
		client.pieceselectedx = sx; client.pieceselectedy = sy;
		client.leftposition.whitetomove = client.leftposition.getSquareColor(sx,sy);
		client.pieceselectedlegalmoves = client.leftposition.getPieceLegalMoves( {"x": sx, "y": sy} )
	}else{
		client.pieceselectedx = null; client.pieceselectedy = null;
		client.pieceselectedlegalmoves = [];
	} */
	
	if (client.draggedpiece){		
		// and placing pieces also toggle, if you place pawn on a square with a pawn it goes empty
		if (client.rightposition.getSquare(sx,sy) == client.draggedpiece){
			client.rightposition.setSquare(sx,sy,null);
		}else{
			client.rightposition.setSquare(sx,sy,client.draggedpiece);
		}
	}
}

function mouseMoved(e){
}

function mouseReleased(e){
	
}

function touchEnded(e){
	client.showghostpiece = false;
}

function draw() {
	client.clickcooldowntimer -= deltaTime;
	if (client.clickcooldowntimer < 0){ client.clickcooldowntimer = 0; }
	
	if (client.state == "countdown"){
		var secondsbefore = Math.floor(client.timer / 1000);
		client.timer -= deltaTime;
		var secondsafter = Math.floor(client.timer / 1000);
		
		// the dom is only modified when the seconds digit has changed, not every draw() call, which im afraid would be super inefficient
		if (secondsbefore != secondsafter){
			var digit1 =  secondsafter % 10;
			var digit10 = Math.floor(secondsafter / 10) % 10;
			var secondsstring = "0:" + digit10 + digit1;
			
			document.getElementById("btn_info").innerHTML = secondsstring
		}
		
		// when the time is run out, go to the input mode, where the user can recreate the map
		if (secondsafter <= 0){
			document.getElementById("btn_info").innerHTML = "-";
			document.getElementById("btn_next").style.visibility = "visible";
			document.getElementById("btn_next").innerHTML = "Done";
			client.state = "input";
			
			client.showleftboard = false;
			client.showrightboard = true;
		}
		
	}else if (client.state == "result"){
		if (client.resultnextbtncooldown > 0){ 
			client.resultnextbtncooldown -= deltaTime;
			// if it becomes less than zero after decrementing it on this tick, then make the button visible
			if (client.resultnextbtncooldown <= 0){
				document.getElementById("btn_next").style.visibility = "visible";
			}
		}
	}
	
	background(20);
	
	//noFill();
	//stroke(128)
	//rect(client.buttoncontainerx, client.buttoncontainery, client.buttoncontainerwidth, client.buttoncontainerheight);
	
	if (client.state == "input"){
		stroke(0);
		for (var i = 0; i < client.buttons.length; i++){
			var cb = client.buttons[i];
			
			fill( client.draggedpiece == cb.piecevalue ? "#DBD8FF" : "#968EFF" );
			
			rect(cb.x, cb.y, cb.width, cb.height);
			image(PIECE_TEXTURES[ cb.piecevalue ], cb.x, cb.y, cb.width, cb.height );
		}
	}
	
	if (client.showleftboard){
		drawChessboard( client.leftboardx,   client.leftboardy, client.leftboardsize, 
					client.boardflipped, client.leftposition );
	}
	if (client.showrightboard){		
		drawChessboard( client.rightboardx,  client.rightboardy, client.rightboardsize, 
						client.boardflipped, client.rightposition );
	}
		
	//ghost piece
	if (client.draggedpiece && client.showghostpiece){
		image(PIECE_TEXTURES[client.draggedpiece], mouseX - client.rightboardsize/16, mouseY - client.rightboardsize/16, client.rightboardsize/8, client.rightboardsize/8);
	}
	
	//fill(256)
	//var loggerstring = windowWidth + " x " + windowHeight + "\n" + client.resultnextbtncooldown;
	//text(loggerstring, 20, 20)
		
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

function drawChessboard( drawx, drawy, drawsize, flipped, position ){
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
			
			if (position.getSquare(x,y)){
				image(PIECE_TEXTURES[ position.getSquare(x,y) ], sx, sy, drawsize/8, drawsize/8 );
			}
		}
	}
	
	// the little green circles indicating legal moves (this is just for debugging)
	for (var i = 0; i < client.pieceselectedlegalmoves.length; i++){
		var dest = client.pieceselectedlegalmoves[i].dest;
		
		var sx, sy;
		if (flipped){ 	
			sx = drawx + ((7 - dest.x) * (drawsize/8)); 
			sy = drawy + (dest.y * (drawsize/8));
		} else { 			
			sx = drawx + (dest.x * drawsize/8); 
			sy = drawy + ((7 - dest.y) * drawsize/8);
		}
		
		// divided by 16 is half a square, so that they appear centered
		fill(0,128,0)
		circle(sx + drawsize/16, sy + drawsize / 16, drawsize/24)
	}
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