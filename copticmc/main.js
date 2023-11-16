var ETYM_COLORS = {
	"egy": "#fff6db",
	"grk": "#deeaff",
	"mod": "#ffdfdf",
	"prs": "#d9fbff",
	"sem": "#dfffe4",
	"unk": "#ffffff"
}

var MAINDIV = document.getElementById("maindiv");

for (key in ENTRIES) {
	var ce = ENTRIES[key] // current entry
	addDictEntry(key, ce);
}

function addDictEntry(key, ce){
	var outerdiv 	= document.createElement("div");
	outerdiv.setAttribute("class", "outerdiv");
	
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
	// these will be colored later by tags so keep them in higher scope
	var etymcells = [];
	if (ce.etym.length > 0) {
		var etymdiv		= document.createElement("div");
		etymdiv.setAttribute("class","etymdiv");
		etymdiv.innerHTML = "<b>Etymology:</b><br>"		
		
		var etymtable	= document.createElement("table");
		etymdiv.appendChild( etymtable );
		
		var row = etymtable.insertRow();
		
		// each item in the etymology gets its own cell
		for (var i = 0; i < ce.etym.length; i++){
			var cc = row.insertCell(); // current cell
			//cc.setAttribute("style","background-color:#000000;")
			cc.innerHTML = ce.etym[i]
			etymcells[i] = cc;
		}
		
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
	// while iterating thru tags, if an etym tag is found, the corresponding etym cell is colored in all in one pass
	var curretymcell = 0;
	// redundant tags are not removed but they arent displayed
	var seentags = {};
	
	var tagsdiv		= document.createElement("div");
	tagsdiv.setAttribute("class","tagsdiv");
	var tagsstring = "<b>Tags: </b>"
	if (ce.tags.length > 0){
		for (var i = 0; i < ce.tags.length; i++){
			// current tag
			var ctag = ce.tags[i]
			if (!seentags[ctag]){
				tagsstring += ce.tags[i] + ", "
				seentags[ctag] = true
			}
			// etymology tags color the respective cells in the etymology section
			if (ctag.substring(0, 5) == "etym-"){
				var etymoriginstr = ctag.substring(5);
				var color = ETYM_COLORS[etymoriginstr];
				if (etymcells[ curretymcell ]){
					etymcells[ curretymcell ].style.background = color;
					curretymcell++;
				}
			}
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