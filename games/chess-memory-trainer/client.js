class Client {
	constructor(){
		// -- BOARD STATE --
		// the position on the left is a random position from one of my games
		this.leftposition = new Position();
		// the position on the right is what the user has reconstructed from memory
		this.rightposition = new Position();
	
		// -- MOUSE STATE --
		this.pieceselectedx = null; this.pieceselectedy = null;
		this.pieceselectedlegalmoves = [];
		this.piecedraggedx = null; this.piecedraggedy = null;
		this.mousestartx = null; this.mousestarty = null;
		
		// -- GRAPHICS STATE --
		this.leftboardx = 100; 	this.leftboardy = 100; 	this.leftboardsize = 500;
		this.rightboardx = 100; this.rightboardy = 100; this.rightboardize = 500;
		this.boardflipped = false; // will apply to both boards at once
	}
	
	screenToCoordX(sx){
		var relx = sx - this.leftboardx;
		var cx;
		if (this.boardflipped){
			cx = Math.floor( 8 - ( relx / ( this.leftboardsize / 8 )) );
		}else{
			cx = Math.floor(relx / ( this.leftboardsize / 8 ));
		}
		return cx;
	}
	screenToCoordY(sy){
		var rely = sy - this.leftboardy;
		var cy;
		if (this.boardflipped){
			cy = Math.floor( rely / ( this.leftboardsize / 8 ));
		}else{
			cy = Math.floor( 8 - ( rely / ( this.leftboardsize / 8 )) );
		}
		return cy;
	}
	
	positionBoardsAndButtons(){
		// landscape mode
		if (width > height){
			
		// portrait mode
		}else{
			// boards are half as tall as the screen height (the greater dimension)
			var boardsize = Math.floor(height / 2)
			
			// board x is centered
			var boardx = Math.floor((width/2) - (boardsize / 2))
			this.leftboardx = boardx; this.leftboardy = 0; this.leftboardsize = boardsize;
			this.rightboardx = boardx; this.rightboardy = boardsize; this.rightboardize = boardsize;
		}
	}
}