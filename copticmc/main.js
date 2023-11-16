var MAINDIV = document.getElementById("maindiv");

for (key in ENTRIES) {
	var ce = ENTRIES[key] // current entry
	addDictEntry(key, ce);
}

function addDictEntry(key, ce){
	var outerdiv 	= document.createElement("div");
	
	var headerdiv	= document.createElement("div");
	
	var imgdiv		= document.createElement("div");
	imgdiv.setAttribute("class","imgdiv");
	imgdiv.innerHTML = "<img src='img/" + key + ".png'>"
	headerdiv.appendChild( imgdiv );
	
	// ENTRY TITLE
	var titlediv	= document.createElement("div");
	titlediv.setAttribute("class","titlediv");
	var titlestring = "<h2>" + ce.coptic;
	// if the word is unattested then put an asterisk beside the name
	if (ce.tags.indexOf("unattested") != -1){
		titlestring += " *";
	}
	titlestring += " - " + ce.english + "</h2>";
	titlediv.innerHTML = titlestring;
	headerdiv.appendChild( titlediv );
	
	outerdiv.appendChild( headerdiv );
	
	// ENTRY ETYMOLOGY
	if (ce.etym.length > 0) {
		var etymdiv		= document.createElement("div");
		outerdiv.appendChild( etymdiv );
	}
	
	// ENTRY NOTES
	if (ce.notes){
		var notesdiv	= document.createElement("div");
		notesdiv.setAttribute("class","notesdiv");
		notesdiv.innerHTML = ce.notes;
		outerdiv.appendChild( notesdiv );
	}
	
	// ENTRY TAGS
	var tagsdiv		= document.createElement("div");
	tagsdiv.setAttribute("class","tagsdiv");
	var tagsstring = "<b>Tags: </b>"
	if (ce.tags.length > 0){
		for (var i = 0; i < ce.tags.length; i++){
			tagsstring += ce.tags[i] + ", "
		}
		// remove the last comma after the last entry
		tagsstring = tagsstring.substring( 0, tagsstring.length - 2 );
	}else{
		tagsstring += "none"
	}
	
	tagsdiv.innerHTML = tagsstring;
	
	outerdiv.appendChild( tagsdiv );
	
	MAINDIV.appendChild( outerdiv );
}