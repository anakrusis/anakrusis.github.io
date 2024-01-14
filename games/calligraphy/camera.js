// 2024 jan 13
// This code is simplified from the Space Game code

var cam_x = 0;
var cam_y = 0;
var cam_zoom = 1;

var tra_x = function(x){ // translate x based on camera values
	var originx = width / 2;
	return ((x-cam_x)*cam_zoom)+originx
}

var tra_y = function(y){ // translate y based on camera values
	var originy = height / 2;
	return ((y-cam_y)*cam_zoom)+originy
}

var untra_x = function(x,y){ // these two convert screen pos back to ingame pos (for cursor clicking and stuff)
	
	var originx = width / 2;
	var originy = height / 2;
	
	var outputx = ( (x - originx) / cam_zoom ) + cam_x ;
	//var outputy = ( (y - outputy) / cam_zoom ) + cam_y ;
	
	return outputx;
	
}

var untra_y = function(x,y){
	
	var originx = width / 2;
	var originy = height / 2;
	
	//var outputx = ( (x - outputx) / cam_zoom ) + cam_x ;
	var outputy = ( (y - originy) / cam_zoom ) + cam_y ;
	
	return outputy;
	
}