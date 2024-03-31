var MAINDIV = document.getElementById("maindiv");
// the outermost div is usually 75% width, but it looks better on a phone in portrait mode at 95% width, so this simply detects
if (window.innerWidth < window.innerHeight){
	MAINDIV.style.width = "95%";
	//MAINDIV.style.fontSize = "40px";
}

CURRENTENTRIES = [];

for (key in ENTRIES) {
	var ce = ENTRIES[key] // current entry
	CURRENTENTRIES.push(key);
}

var pagetopnotes = document.createElement("div");
pagetopnotes.setAttribute("class", "notesdiv");
MAINDIV.appendChild( pagetopnotes );

pagetopnotes.innerHTML += "<b>" + CURRENTENTRIES.length + " out of " + Object.keys(ENTRIES).length +  " entries" +"</b>"

var cattable = document.createElement("table");
MAINDIV.appendChild( cattable );
cattable.style.marginBottom = "0px";
	
var currentrow;
for (var i = 0; i < CURRENTENTRIES.length; i++){
	var key = CURRENTENTRIES[i];
	var ce = ENTRIES[key]
	
	// start a new row
	if (i % 2 == 0){
		currentrow = cattable.insertRow();
	}
	var currenttitle = doMarkup( "[r]" + key + "[/r]" );
	
	var cc = currentrow.insertCell(); // image cell
	cc.style.width = "5%"; cc.style.border = "0px";
	
	var imgsrc = key;
	if (ce.img) {
		imgsrc = ce.img;
	}
	if (imgsrc != "none"){
		var img = document.createElement("img");
		
		// gifs dont need to have a file extension added at the end. png is the default.
		if (imgsrc.indexOf("gif") != -1){
			img.src = "img/" + imgsrc + ""
		}else{
			img.src = "img/" + imgsrc + ".png"
		}
		
		img.style.height = "48px"
		cc.appendChild( img );
		cc.style.padding = "0px"; cc.style.textAlign = "center";
		//cc.innerHTML = "<img src='img/" + imgsrc + ".png'>"
	}
	
	var cc = currentrow.insertCell(); // text cell
	cc.style.width = "45%"; //cc.style.border = "0px";
	cc.innerHTML += currenttitle;
}

function addCategoryTable(){
	
}

function addSearchEntry(key, ce){
	
}