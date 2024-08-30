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
	
	importPGN( pgn ){
		// position array is initialized with the chess starting position
		this.importFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
		
		var legalmoves = this.getAllLegalMoves();
	}
	
	// The reason this is necessary is unfortunately due to the PGN notation...
	// if there is no mention of rank or file, such as Nd2, then only one piece has the legal move to go there, so we must find which one.
	// sometimes this is just because no other piece sees the square, but other times it is because another piece is pinned,
	// so the legal moves of the pieces, including whether they are pinned or not, must be calculated.
	
	// Note that technically not all legal moves need to be found. The legality of castling is complicated
	// as i would need to check if the kings and rooks have ever moved, and if they are castling through check.
	// Thankfully the notations O-O and O-O-O are never ambiguous, so the castling moves can be ignored here.
	
	getAllLegalMoves(){
	
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
			console.log(cpc.x + ", " + cpc.y);
			
			var cpc_legalmoves = this.getPieceLegalMoves( cpc );
		}		
	}
	
	getPieceLegalMoves( coord ){
		
	}
}