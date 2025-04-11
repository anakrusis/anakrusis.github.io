// pixel art editor
// written on my phone with termux and micro and tested with http-server
// 2025 april 11

var PALETTE = [0, 80, 160, 255]
// 1 = 1k, 2 = 2k, 4 = 4k
var banksize = 1;
var tilebank = [];
var selectedtile = 0x00;
var selectedcolor = 0x03;
var floodfillmode = false;

var blob_url;
var exported = false;

function setup(){
	document.getElementById("btn_colorselect").onclick = function(){
		selectedcolor += 1; selectedcolor %= 4;
		this.innerHTML = selectedcolor;

		var cc = PALETTE[selectedcolor] // current color
		var bgcolorstring = "rgb(" + cc + "," + cc + "," + cc + ")"

		var tc = cc >= 0x80 ? 0x00 : 0xff // text color
		var textcolorstring = "rgb(" + tc + "," + tc + "," + tc + ")";

		this.style = "background-color: " + bgcolorstring + ";\ncolor: " + textcolorstring + ";";
	}
	document.getElementById("btn_fill").onclick = function(){
		floodfillmode = !floodfillmode;
		if (floodfillmode){
			this.innerHTML = "Fill on";
		}else{
			this.innerHTML = "Fill off";
		}
	}
	document.getElementById("btn_cleartile").onclick = function(){
		tile_clear(selectedtile)
	}
	document.getElementById("btn_export").onclick = function(){
		//if (exported){
		//	window.location.href = blob_url;
		//	exported = false;
		//	return
		//}

		var dataout = [];
		for (var i = 0; i < 0x40 * banksize; i++){
			dataout = dataout.concat(tile_export(i))
		}

		
		var bytesout = new Uint8Array(dataout);
		var blob = new Blob( [bytesout], {type: 'application/octet-stream'} );
		blob_url = URL.createObjectURL(blob);

		var a = document.createElement('a');
		a.href = blob_url;
		a.download = "out.chr"
 		document.body.appendChild(a);
 		a.click();
 		document.body.removeChild(a);

		//exported = true;
		//save(dataout, "out.txt");
	}

	for (var i = 0; i < 0x40 * banksize; i++){
		var currtile = [];
		tilebank.push(currtile);
		tile_clear(i);
	}
	createCanvas(windowWidth, windowHeight * 0.8);
}

function mouseClicked(){
	// mouse in top half: pixel editor
	if (mouseY <  height / 2){
		var dSCALE = height / 2
		var pixelscale = dSCALE/8
		var dX = (width/2)-(dSCALE/2)
		var px = Math.floor((mouseX - dX)/ pixelscale);
		var py = Math.floor(mouseY / pixelscale);

		console.log(px + "," + py)

		if (px >= 8 || px < 0){ return }
		if (py >= 8 || py < 0){ return }

		tile_setpixel(selectedtile, px, py, selectedcolor)

	// mouse in the bottom half: select tile
	}else{
		// display scale, display x/y
		var dSCALE = height/2;
		var dX = (width/2)-(dSCALE/2)
		var dY = dSCALE;
		// tile x/y
		var tx = Math.floor((mouseX - dX) / (dSCALE / 0x10));
		var ty = Math.floor((mouseY - dY) / (dSCALE / 0x10));

		if (tx >= 16 || tx < 0){ return }
		if (ty >= 16 || ty < 0){ return }

		var tind = (ty * 0x10) + tx
		if (tind >= 0x40*banksize){return}

		selectedtile = tind;
	}
}

function draw(){
	// light blue backgrond
	background(128,192,255);

	// the top half of the screen displays
	// the current tile (with grid)
	var dSCALE = height / 2;
	var dX = (width / 2)-(dSCALE/2);
	tile_draw(selectedtile, dX, 0, dSCALE, true)

	// the bottom half displays all tiles
	for (var i = 0; i < 0x40 * banksize; i++){
		var px = i % 16;
		var py = Math.floor(i / 16);

		var cx = dX + (px * dSCALE/0x10 ); 
		var cy = dSCALE + (py * dSCALE/0x10);

		tile_draw(i, cx, cy, dSCALE/0x10);

		// all tiles get a black outline
		stroke(0)
		// the selected tile gets a pulsating
		// magenta glow
		if (i == selectedtile){
			var alpha = (millis() % 1000) / 500
			alpha *= TWO_PI;
			alpha = 0xb0 * Math.sin(alpha)
			fill(255, 0, 255, alpha);
			
		}else{
			noFill();
		}
		rect(cx, cy, dSCALE/0x10, dSCALE/0x10)
	}
}

// all pixels in tile are set to background color
// or transparent if sprite
function tile_clear(t){
	for (var i = 0; i < 0x40; i++){
		tilebank[t][i] = 0x00;
	}
}
function tile_draw(t,x,y,scale,outlined){
	var pscale = scale / 8; // pixel scale
	for (var i = 0; i < 0x40; i++){
		var cpix = tilebank[t][i]; 
		var cx = pscale*(i % 8); 
		var cy = pscale*Math.floor(i/8);

		fill(PALETTE[cpix]);
		if (outlined){
			stroke(0); // black pixel grid
		}else{
			// grid the same color
			stroke(PALETTE[cpix])
		}
		
		rect(x + cx, y + cy, pscale, pscale)
		
	}
}
function tile_setpixel(t,x,y,color){
	var oldcolor = tilebank[t][(y*8)+x];
	if (oldcolor == color){ return }
	
	tilebank[t][(y*8)+x] = color;
	
	if (floodfillmode){
		for (var q = 0; q < 4; q++){
			// four cardinal directions
			var OFFSETTABLE = [0, 1, 0, -1]
			var xoffset = OFFSETTABLE[(q+1)%4]
			var yoffset = OFFSETTABLE[q]

			var cx = x + xoffset;
			var cy = y + yoffset;
			// dont flood fill to OOB pixel
			if (cx < 0 || cx >= 8){continue}
			if (cy < 0 || cy >= 8){continue}

			var cind = (cy*8)+cx
			var ccolor = tilebank[t][cind]
			// if this neighboring pixel has
			// the same color as the old color
			// then continue the flood fill
			if (ccolor == oldcolor){
				tile_setpixel(t,cx,cy,color);
			}
		}	
	}
}
function tile_export(t){
	var bitplane1 = [0,0,0,0,0,0,0,0,
					 0,0,0,0,0,0,0,0];
	//var bitplane2 = [0,0,0,0,0,0,0,0];
	var place = 0x80
	for (var i = 0; i < 0x40; i++){
		var ccolor = tilebank[t][i];
		var lowbit = ccolor % 2;
		var highbit = Math.floor(ccolor / 2);

		// bitplane index (which byte)
		var bpind = Math.floor(i/8);
		// low bits go in the first eight bytes
		bitplane1[bpind] += (lowbit*place)
		// high bits go in the latter eight bytes
		bitplane1[bpind + 8] += (highbit*place)

		console.log(bitplane1[bpind] + " " + bitplane1[bpind + 8])

		// place goes down by powers of two
		// then wraps around for next byte
		place /= 2;
		if (place < 1){ place = 0x80 }
	}
	return bitplane1;

	//var bytesout = new Uint8Array( bitplane1 );
	
	//var out = "";
	//for (var i = 0; i < 0x10; i++){
	//	var cbyte = String.fromCharCode( bitplane1[i] )
	//	cbyte = cbyte.charCodeAt(0); 
		// we are only working with bytes
	//	out += cbyte;
	//}
	//return bytesout;
}
