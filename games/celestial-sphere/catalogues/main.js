var MAINDIV = document.getElementById("maindiv");
var DATEOPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

for (var i = 0; i < ENTRIES.length; i++){
	var ce = ENTRIES[i]
	addDictEntry(ce);
}

//var SUMMARYDIV = document.getElementById("summarydiv");
//SUMMARYDIV.innerHTML += "Total log entries: " + ENTRIES.length;

function addDictEntry(ce){
	var outerdiv 	= document.createElement("div");
	outerdiv.setAttribute("class", "outerdiv");
	//outerdiv.setAttribute("id", key);
	
	// ENTRY TITLE
	var titlediv	= document.createElement("div");
	titlediv.setAttribute("class","titlediv");
	var titlestring = ce.title
	titlediv.innerHTML = "<h2>" + titlestring + "</h2>";
	outerdiv.appendChild( titlediv );
	
	// ENTRY NOTES
	if (ce.text){
		var notesdiv	= document.createElement("div");
		notesdiv.setAttribute("class","notesdiv");
		notesdiv.innerHTML = ce.text;
		outerdiv.appendChild( notesdiv );
	}
	
	MAINDIV.appendChild( outerdiv );
}