// A chess position. the current state of the board

class Position {
	constructor(){
		// the 8x8 array which contains the board state. 
		// each item is a one character string like "Q" (white queen), "b" (black knight), etc. or undefined if empty
		// I think an empty string is fine too because iirc it evaluates to false which is all we care about
		this.posarray = [];
		// white to move = true, black to move = false
		this.whitetomove = true;
		
		// the moves are stored in that same format as they usually are:
		// {
		//		"start": { "x": 0, "y": 0 },
		//		"dest":	 { "x": 1, "y"; 1 },
		//		"iscapture": true
		// }
		this.movehistory = [];
	}
	
	getSquare(x,y){
		if (!this.posarray[x]){ return null; }
		if (!this.posarray[x][y]){ return null; }
		
		return this.posarray[x][y];
	}
	
	setSquare(x,y,piecetype){
		if (!this.posarray[x]){ return; }
		this.posarray[x][y] = piecetype;
	}
	
	importFEN( fen ){
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
		this.posarray = arrayout;
	}
	
	// The pgn is an array containing a string for each line of the file
	
	importPGN( pgn ){
		// position array is initialized with the chess starting position, white to move
		this.importFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		this.whitetomove = true;
		
		// find first item in array that begins with "1. " (the first move)
		var movesstring = "";
		for (var i = 0; i < pgn.length; i++){
			if ( pgn[i].indexOf("1. ") == 0 ) {
				movesstring = pgn[i]; break;
			}
		}
		
		// iterates through all spaces in the string, and separates the text between them into their own tokens
		var tokenarray = [];
		var stringremaining = movesstring;
		while (stringremaining.indexOf(" ") != -1){
			var spaceindex = stringremaining.indexOf(" ");
			var stringbeforespace = stringremaining.substring(0, spaceindex);
			tokenarray.push(stringbeforespace);
			stringremaining = stringremaining.substring(spaceindex + 1);
		}
		// Note that the last bit remaining is not added to a token; there is no space character after it.
		// This is fine because the final word of the pgn is who won e.g. "1-0", "0-1", "1/2-1/2" and this isn't needed here.
		
		for (var i = 0; i < tokenarray.length; i++){
			var token = tokenarray[i];
			console.log(token);
			
			// every third token starting with the first should be the move number. 
			// if this is not in order, then something is not right, there may be variations in this PGN or it is wrongly formatted
			if (i % 3 == 0){
				var expectedmovenumber = (Math.floor(i / 3) + 1);
				var expectedtoken = expectedmovenumber + ".";
				if (token != expectedtoken){
					console.log("Error: Could not import PGN. Move numbers were not placed in the right order"); return;
				}
				
			// the other two tokens out of three are white and black's moves
			}else{
				// ignore indication of checks, checkmate
				token = token.replace("+", "");
				token = token.replace("#", "");
				
				// properties relating to the move
				var startrank; 	var startfile;	var startx;	var starty;
				var destrank;	var destfile;	var destx;	var desty;
				var piecetype; 	var iscapture = false; 
				
				// todo special case: castles O-O and O-O-O. handle up here and then continue, skipping all the 
				// code below with rank and file and piece type parsing
				
				// the last number between 1 and 8 inclusive to occur in the token is the destination rank
				var destrankindex = 0;
				for (var q = 1; q <= 8; q++){
					if (token.lastIndexOf(q) > destrankindex){ destrankindex = token.lastIndexOf(q) }
				}
				destrank = token.charAt(destrankindex);
				console.log("dest rank: " + destrank);
				desty = destrank - 1;
				
				// the last lowercase letter between a and h inclusive is the destination file
				var destfileindex = lastIndexOfItems(token, ["a","b","c","d","e","f","g","h"]);
				destfile = token.charAt(destfileindex);
				console.log("dest file: " + destfile);
				destx = token.charCodeAt(destfileindex) - 97;
				console.log("dest x: " + destx);
				
				// the first instance of these letters BKNQR is the piece type
				// the reason that the first instance is chosen instead of the last is because of pawn promotion moves like a8=Q
				var piecetypeindex = firstIndexOfItems(token, ["B","K","N","Q","R"]);
				// pawns are specified by the absence of a letter
				if (piecetypeindex == -1){ 
					piecetype = "p";
				}else{
					piecetype = token.charAt(piecetypeindex);
				}
				
				console.log("piece type: " + piecetype);
				
				var stringbefore = token.substring(0, destfileindex)
				console.log(stringbefore);
				
				// x: captures or "takes"
				if (stringbefore.indexOf("x") != -1){
					iscapture = true;
				}
				
				// any other instance of 1-8 numbers would be for disambiguating the rank of two pieces on the same rank
				var startrankindex = firstIndexOfItems(stringbefore, ["1","2","3","4","5","6","7","8"]);
				startrank = stringbefore.charAt(startrankindex);
				console.log("start rank: " + startrank);
				starty = startrank - 1;
				
				// any other instance of the a-h letters would be for disambiguation, giving the start file
				var startfileindex = firstIndexOfItems(stringbefore, ["a","b","c","d","e","f","g","h"]);
				startfile = stringbefore.charAt(startfileindex);
				console.log("start file: " + startfile);
				startx = token.charCodeAt(startfileindex) - 97;
				console.log("start x: " + startx);
				
				// note: if starting rank or file is not specified, the charAt function gives an empty string ""
				// this is fine because it evaluates to false, but be careful
				
				// get the coords of all the matching pieces of this type and color
				var piecelist = this.getSameColorPiecesOfType(piecetype, this.whitetomove)
				// and a list which will have all the moves to the destination square
				var movestodestination = [];
				
				// iterate through these pieces and see which ones have the legal move to go to the destination square
				for (var q = 0; q < piecelist.length; q++){
					var cpc = piecelist[q]; // current piece
					var cpc_legalmoves = this.getPieceLegalMoves( cpc );
					
					console.log(cpc_legalmoves);
					
					for (var moveindex = 0; moveindex < cpc_legalmoves.length; moveindex++){
						var clm = cpc_legalmoves[moveindex]; // current legal move
						
						if (clm.dest.x == destx && clm.dest.y == desty){
							movestodestination.push( clm );
						}
					}
				}
				
				console.log(movestodestination);
				
				// if only one legal move possible then just do it 
				if (movestodestination.length == 1){
					this.doMove(movestodestination[0]);
				}
				
				// otherwise iterate through the legal moves which have the correct destination and see which ones
				// match up with the start x and y (if they are specified)
				
				
				// alternate between white and black
				this.whitetomove = !this.whitetomove
			}
		}
	}
	
	// returns coordinates of all pieces of this type matching the color specified
	getSameColorPiecesOfType(piecetype, color){
		// piece type is not case sensitivc, so you can put either K or k, N or n...
		piecetype = piecetype.toLowerCase();
		
		var piececoords = [];
		
		for (var x = 0; x < 8; x++){
			for (var y = 0; y < 8; y++){
				var currsquare = this.getSquare(x,y);
				if (!currsquare){ continue; }
				// uppercase are white pieces; lowercase are black pieces
				if (((currsquare.toUpperCase() === currsquare) == this.whitetomove) && (piecetype == currsquare.toLowerCase())){
					// current piece coord
					var cpc = {}; cpc.x = x; cpc.y = y; piececoords.push(cpc);
				}
			}
		}
		
		return piececoords; 
	}
	
	// The reason this is necessary is unfortunately due to the PGN notation...
	// if there is no mention of rank or file, such as Nd2, then only one piece has the legal move to go there, so we must find which one.
	// sometimes this is just because no other piece sees the square, but other times it is because another piece is pinned,
	// so the legal moves of the pieces, including whether they are pinned or not, must be calculated.
	
	// Note that technically not all legal moves need to be found. The legality of castling is complicated
	// as i would need to check if the kings and rooks have ever moved, and if they are castling into, out of, or through check.
	// Thankfully the notations O-O and O-O-O are never ambiguous, so the castling moves can be ignored here.
	
	getAllLegalMoves(){
		var legalmovesout = [];
	
		// first make a list of all the pieces of this color
		// each item of the array is an object e.g. {x = 0, y = 0}
		var piececoords = [];
		
		for (var x = 0; x < 8; x++){
			for (var y = 0; y < 8; y++){
				var currsquare = this.getSquare(x,y);
				if (!currsquare){ continue; }
				// uppercase are white pieces; lowercase are black pieces
				if ((currsquare.toUpperCase() === currsquare) == this.whitetomove){
					// current piece coord
					var cpc = {}; cpc.x = x; cpc.y = y; piececoords.push(cpc);
				}
			}
		}
		
		for (var i = 0; i < piececoords.length; i++){
			var cpc = piececoords[i]; // current piece coord
			var cpc_legalmoves = this.getPieceLegalMoves( cpc );
			
			// add legal moves to the larger list
			for (var q = 0; q < cpc_legalmoves.length; q++){
				legalmovesout.push( cpc_legalmoves[q] );
			}
		}

		return legalmovesout;
	}
	
	getPieceLegalMoves( coord ){
		//console.log(coord.x + ", " + coord.y);
	
		// each legal move out will be an object with a start coordinate and destination coordinate.
		// The start coordinate might seem useless since this function deals with a single piece, but this will be
		// called from the getAllLegalMoves function, so the start coordinate is needed
		var legalmovesout = [];
		var piece = this.getSquare(coord.x, coord.y);
		var piecetype = piece.toLowerCase();
		//console.log(piece);
		
		// -- PAWN -- all kinds of pawn moves are special cases that don't apply to any other pieces
		if (piecetype == "p"){
			// the two diagonal squares that a pawn can capture an enemy piece
			var cpx = 1; var cpy = this.whitetomove ? 1 : -1;
			for (var i = 0; i < 2; i++){
				var tx = coord.x + cpx; var ty = coord.y + cpy;
				var targetsquare = this.getSquare(tx,ty);
				// can't capture if nothing is on the square
				if ( !targetsquare ){ continue; }
				// can only capture if the target piece color is not the same as our piece color
				if ((currsquare.toUpperCase() === currsquare) != this.whitetomove){
					var pawncapturemove = {};
					pawncapturemove.start = { "x": coord.x, "y": coord.y }
					pawncapturemove.dest  = { "x": tx, 		"y": ty }
					pawncapturemove.iscapture = true;
					
					legalmovesout.push(pawncapturemove);
				}
				
				cpx *= -1;
			}
			
			// todo add en passant capture
			
			// one square pawn push: only legal if the square is unoccupied
			var osy = this.whitetomove ? 1 : -1;
			var onesquarelegal = false;
			var targetsquare = this.getSquare( coord.x, coord.y + osy );
			if (!targetsquare){
				var pawnonesquaremove = {};
				pawnonesquaremove.start = { "x": coord.x, "y": coord.y }
				pawnonesquaremove.dest  = { "x": coord.x, "y": coord.y + osy }
				
				legalmovesout.push(pawnonesquaremove);
				onesquarelegal = true;
			}
			
			// two square pawn push, only on starting rank and if the one square push is legal
			var tsy = this.whitetomove ? 2 : -2;
			var startrank = this.whitetomove ? 1 : 6;
			if (onesquarelegal && coord.y == startrank){
				var targetsquare = this.getSquare( coord.x, coord.y + tsy );
				if (!targetsquare){
					var pawntwosquaremove = {};
					pawntwosquaremove.start = { "x": coord.x, "y": coord.y }
					pawntwosquaremove.dest  = { "x": coord.x, "y": coord.y + tsy }
					
					legalmovesout.push(pawntwosquaremove);
				}
			}
		}
		// == KNIGHT -- the signature L-shaped move that no other piece can do
		if (piecetype == "n"){
			// there are two knight moves which are four way rotationally symmetric:
			// up one + out two, and up two + out one
			var KNIGHTMOVES = [ { "x": 1, "y": 2 }, { "x": 2, "y": 1 } ]
			for ( var angle = 0; angle < Math.PI * 2; angle += Math.PI/2 ){
				
				for (var i = 0; i < KNIGHTMOVES.length; i++){
					var knightmovex = Math.round((KNIGHTMOVES[i].x) * Math.cos(angle) - (KNIGHTMOVES[i].y) * Math.sin(angle));
					var knightmovey = Math.round((KNIGHTMOVES[i].x) * Math.sin(angle) + (KNIGHTMOVES[i].y) * Math.cos(angle));
					
					var cx = coord.x + knightmovex; var cy = coord.y + knightmovey;
					var knightmove = {
						"start": { "x": coord.x,	"y": coord.y },
						"dest":	 { "x": cx,			"y": cy }
					}
					
					if (this.getSquare(cx, cy)){
						// if the color does not match then it can be captured, otherwise do not add
						if ((this.getSquare(cx, cy).toUpperCase() === this.getSquare(cx, cy)) != this.whitetomove){
							legalmovesout.push(knightmove);
						}
						
					}else{
						legalmovesout.push(knightmove);
					}
				}
			}
		}
		
		// -- DIAGONAL MOVEMENT -- queen and bishop
		if (piecetype == "q" || piecetype == "b"){
			
		}
		
		// -- ORTHOGONAL MOVEMENT -- queen and rook
		if (piecetype == "q" || piecetype == "r"){
			
		}
		
		// todo handle pinned piece. if moving this piece off of its current square allows the oppponent
		// to capture the king on their turn, then return an empty list of moves. there are no legal moves for this piece
		
		// edit: do not just return an empty list of moves. sliding pieces can move in the same axis that they are pinned.
		// so check each move and only remove the moves that unpin the piece from the king
		
		return legalmovesout;
	}
	
	doMove( move ){
		var piecetype = this.getSquare(move.start.x, move.start.y);
		this.setSquare(move.dest.x, move.dest.y, piecetype);
		this.setSquare(move.start.x, move.start.y, undefined);
		
		// todo add the pieces of the start and destination squares to the move history
		// (will make it easier to undo)
		
		this.movehistory.push(move);
	}
	
	
}