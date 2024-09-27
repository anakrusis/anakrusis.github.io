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
		this.showleftboard = true; this.showrightboard = true;
		
		this.buttons = [];
		this.buttoncontainerx = 100; this.buttoncontainery = 100; 
		this.buttonncontainerwidth = 20; this.buttoncontainerheight = 20; 
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