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
		this.draggedpiece;
		this.mousestartx = null; this.mousestarty = null;
		
		// -- GRAPHICS STATE --
		this.leftboardx = 100; 	this.leftboardy = 100; 	this.leftboardsize = 500;
		this.rightboardx = 100; this.rightboardy = 100; this.rightboardize = 500;
		this.boardflipped = false; // will apply to both boards at once
		this.showghostpiece = true;
		this.showleftboard = false; this.showrightboard = false;
		
		this.buttons = [];
		this.buttoncontainerx = 100; this.buttoncontainery = 100; 
		this.buttonncontainerwidth = 20; this.buttoncontainerheight = 20; 
		
		// META STATE
		// start:		before the game has begun
		// countdown:	the left board is shown for about 10 seconds, the right board and done button are hidden
		// input:		the player inputs the board as they remember it
		// result:		the result of whether the players board matches the given board, and info on what game it came from
		this.state = "start";
		// in milliseconds, because it counts down using deltaTime
		this.timer = 0;
		this.score = 0;
		this.total = 0;
	}
	
	// returns boolean on whether the leftposition and rightposition are the same
	arePositionsMatching(){
		for (var x = 0; x < 8; x++){
			for (var y = 0; y < 8; y++){
				var ls = this.leftposition.getSquare(x,y); var rs = this.rightposition.getSquare(x,y); // left square and right square
				
				// if both squares at this position evaluate to false, then its okay, they're both empty squares.
				// I can't remember if i set them to null or undefined so lets be careful trying to compare them
				if (!ls && !rs){
					continue;
				}
				// otherwise if any two squares don't match then the whole position is not matching
				if (ls != rs){
					return false;
				}
			}
		}
		return true;
	}
	
	screenToCoordX(sx){
		var relx = sx - this.rightboardx;
		var cx;
		if (this.boardflipped){
			cx = Math.floor( 8 - ( relx / ( this.rightboardsize / 8 )) );
		}else{
			cx = Math.floor(relx / ( this.rightboardsize / 8 ));
		}
		return cx;
	}
	screenToCoordY(sy){
		var rely = sy - this.rightboardy;
		var cy;
		if (this.boardflipped){
			cy = Math.floor( rely / ( this.rightboardsize / 8 ));
		}else{
			cy = Math.floor( 8 - ( rely / ( this.rightboardsize / 8 )) );
		}
		return cy;
	}
	
	positionBoardsAndButtons(){
		var buttonvalues = [ "K", "Q", "R", "B", "N", "P", "k", "q", "r", "b", "n", "p" ];
		
		// landscape mode
		if (width > height){
			
		// portrait mode
		}else{
			var ypadding = Math.floor( height / 32 );
			
			// boards are half as tall as the screen height (the greater dimension) minus some room for padding and the button container
			var boardsize = Math.floor(height / 2) - (ypadding * 4);
			// boards are x centered
			var boardx = Math.floor((width/2) - (boardsize / 2))

			this.leftboardx = boardx; this.leftboardy = ypadding; this.leftboardsize = boardsize;
			
			this.buttoncontainery = this.leftboardy + boardsize + ypadding;
			this.buttoncontainerwidth = (boardsize / 8) * 6;
			this.buttoncontainerx = (width/2) - (this.buttoncontainerwidth / 2);
			this.buttoncontainerheight = (boardsize / 8) * 2;
			
			this.rightboardx = boardx; this.rightboardy = this.buttoncontainery + this.buttoncontainerheight + ypadding; 
			this.rightboardsize = boardsize;
			
			// each button is the size of a square on the board
			var buttonsize = boardsize / 8;
			
			this.buttons = [];
			for (var i = 0; i < 12; i++){
				var currx = (( i % 6 ) * buttonsize) + this.buttoncontainerx;
				var curry = (Math.floor(i / 6) * buttonsize ) + this.buttoncontainery;
				var button = {
					"x": 		currx,
					"y": 		curry,
					"width": 	buttonsize,
					"height":	buttonsize,
					"piecevalue":	buttonvalues[i]
				}
				console.log(button);
				
				this.buttons.push(button);
			}
		}
	}
}