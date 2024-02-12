IMAGE_PALETTE = {
	"0": "#00000000",
	"1": "#000000ff"
}

class Image {
	constructor(width, height){
		this.width 			= width;
		this.height 		= height;
		this.imagestring 	= "";
		
/* 		if (imgpath){
			this.loadImageData(imgpath);
		}else{
			this.clearImageData();
		} */
	}
	
	// all transparent
	clearImageData(){
		this.imagestring = "";
		for (var i = 0; i < this.width * this.height; i++){
			this.imagestring += "0";
		}
	}
	
	// load from image file path (for example a .png)
	initImageStringFromImage( path ) {
		console.log(path);
		this.img = loadImage( path )
		for ( var y = 0; y < this.height; y++ ){
			for ( var x = 0; x < this.width; x++ ){
				var currpixel = this.img.get( x, y )
			}
		}
	}

	initImageString( datain ){
		
	}
}