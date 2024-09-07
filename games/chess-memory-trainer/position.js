// A chess position. the current state of the board

class Position {
	constructor(){
		// the 8x8 array which contains the board state. 
		// each item is a one character string like "Q" (white queen), "b" (black knight), etc. or undefined if empty
		// I think an empty string is fine too because iirc it evaluates to false which is all we care about
		this.posarray = [];
		// white to move = true, black to move = false
		this.whitetomove = true;
	}
	
	getSquare(x,y){
		if (!this.posarray[x]){ return null; }
		if (!this.posarray[x][y]){ return null; }
		
		return this.posarray[x][y];
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
				
				// todo special case: castles O-O and O-O-O. handle up here and then continue, skipping all the 
				// code below with rank and file and piece type parsing
				
				// the last number between 1 and 8 inclusive to occur in the token is the destination rank
				var destrankindex = 0;
				for (var q = 1; q <= 8; q++){
					if (token.lastIndexOf(q) > destrankindex){ destrankindex = token.lastIndexOf(q) }
				}
				var destrank = token.charAt(destrankindex);
				console.log("dest rank: " + destrank);
				
				// the last lowercase letter between a and h inclusive is the destination file
/* 				var destfileindex = 0;
				for (var q = 0; q < 7; q++){
					var ltr = String.fromCharCode(97 + q);
					if (token.lastIndexOf(ltr) > destfileindex){ destfileindex = token.lastIndexOf(ltr) }
				} */
				var destfileindex = lastIndexOfItems(token, ["a","b","c","d","e","f","g","h"]);
				var destfile = token.charAt(destfileindex);
				console.log("dest file: " + destfile);
				
				// the reason that the first instance is chosen instead of the last is because of pawn promotion moves like a8=Q
				var piecetypeindex = firstIndexOfItems(token, ["B","K","N","Q","R"]);
				var piecetype;
				// pawns do not have a piece type specified by letter
				if (piecetypeindex == -1){ 
					piecetype = "p";
				}else{
					piecetype = token.charAt(piecetypeindex);
				}
				
				console.log("piece type: " + piecetype);
				
				// get all the matching pieces of this type and color
				var piecelist = this.getSameColorPiecesOfType(piecetype, this.whitetomove)
				
				// iterate through these pieces and see which ones have the legal move to go to the destination square
				for (var q = 0; q < piecelist.length; q++){
					var cpc = piecelist[q]; // current piece coord
					var cpc_legalmoves = this.getPieceLegalMoves( cpc );
					
					console.log(cpc_legalmoves);
				}
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
		//console.log(piece);
		
		// -- PAWN -- all kinds of pawn moves are special cases that don't apply to any other pieces
		if (piece.toLowerCase() == "p"){
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
		
		// todo handle pinned piece. if moving this piece off of its current square allows the oppponent
		// to capture the king on their turn, then return an empty list of moves. there are no legal moves for this piece
		
		return legalmovesout;
	}
}