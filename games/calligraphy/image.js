GLOBAL_PALETTE = {
	" ": [0, 0, 0, 0], 		// #00000000 (transparent)
	"a": [0, 0, 0, 255], 	// #000000ff (black)
}

class ImageString {
	constructor(width, height){
		this.width 			= width;
		this.height 		= height;
		this.imagestring 	= "";
		this.img			= {};
		
/* 		if (imgpath){
			this.loadImageData(imgpath);
		}else{
			this.clearImageData();
		} */
	}
	
	// all transparent
	clear(){
		this.imagestring = "";
		for (var i = 0; i < this.width * this.height; i++){
			this.imagestring += " ";
		}
	}
	
	// load from p5.js image object
	initFromImage( imgin ) {
		// the new reduced color version of the image is created
		this.img		 = createImage(this.width, this.height);
		this.imagestring = "";
		
		// stores colors whose nearest pixel color has already been found, so it doesnt have to search the table over and over again (slow)
		var colorcache = {};
		
		for ( var y = 0; y < this.height; y++ ){
			for ( var x = 0; x < this.width; x++ ){
				var currpixel = imgin.get( x, y )
				var currpixstring = this.colorsToHexString( currpixel );
				var nearestcolor  = this.findNearestColor(currpixel);
				//console.log(nearestcolor);
				this.imagestring += nearestcolor;
				this.img.set(x, y, GLOBAL_PALETTE[nearestcolor])
			}
		}
		
		console.log( this.imagestring );
	}

	// load from already prebaked image string 
	init( stringin ){
		
	}
	
	colorsToHexString( inpixel ){
		// pads zeroes and takes the last two digits of each
		// and then concatenates them all together
		var r = ("00" + inpixel[0].toString(16)).slice(-2); 
		var g = ("00" + inpixel[1].toString(16)).slice(-2); 
		var b = ("00" + inpixel[2].toString(16)).slice(-2); 
		var a = ("00" + inpixel[3].toString(16)).slice(-2);
		var outstring = "#" + r + g + b + a;
		return outstring;
	}
	
	// returns one char , which is the index into GLOBAL_PALETTE
	findNearestColor( inpixel ){
		// special case for fully transparent pixels to remain fully transparent, ignoring rgb values
		if (inpixel[3] == 0){ return " "; }
		
		var difference = 1000000000; var currdiff; var nearestcolor;
		// iterate thru each color in the palette
		for ( const key in GLOBAL_PALETTE ){
			var currpcolor = GLOBAL_PALETTE[key];
			currdiff = 0;
			for (var i = 0; i < 4; i++ ){
				currdiff += Math.abs( inpixel[i] - currpcolor[i] )
			}
			if ( currdiff < difference ) {
				nearestcolor = key; difference = currdiff;
			}
			if ( difference == 0 ){
				break;
			}
		}
		return nearestcolor;
	}
}