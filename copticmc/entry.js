var DATEOPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

var MAINDIV = document.getElementById("maindiv");
// the outermost div is usually 75% width, but it looks better on a phone in portrait mode at 95% width, so this simply detects
if (window.innerWidth < window.innerHeight){
	MAINDIV.style.width = "95%";
	//MAINDIV.style.fontSize = "40px";
}

const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const TAGSSTRING = URLPARAMS.get('tags')
const IDSTRING   = URLPARAMS.get('id')
CURRENTTAGS = parseTagString( TAGSSTRING )

CURRENTENTRIES = [];

// id present: just put in the one entry on the page
if (IDSTRING){
	CURRENTENTRIES.push(IDSTRING);
	
// no id string: put entries by tags (TODO i think searching by tag should go back to the abbreviated search page)
}else{
	// for every entry, we will see if it matches all the tags being searched
	for (key in ENTRIES) {
		var ce = ENTRIES[key] // current entry
		var tagismissing = false;
		for (var i = 0; i < CURRENTTAGS.length; i++){
			var ct = CURRENTTAGS[i] // current tag
			if (ce.tags.indexOf(ct) == -1){
				tagismissing = true;
			}
		}
		// skip this entry if any of the tags are not present
		if (tagismissing){
			continue;
		}
		CURRENTENTRIES.push(key);
	}
}

// add the header at the top of the page
//var pagetopdiv 	= document.createElement("div");
//pagetopdiv.setAttribute("class", "titlediv");
//MAINDIV.appendChild( pagetopdiv );

var pagetopstring = TAGSSTRING;
if (!TAGSSTRING){
	pagetopstring = PAGETOPTITLES["all"];
}
if (PAGETOPTITLES[ TAGSSTRING ]){
	pagetopstring = PAGETOPTITLES[ TAGSSTRING ];
}
//pagetopdiv.innerHTML = "<h2>Category:　" + pagetopstring + "</h2>";

var pagetopnotes = document.createElement("div");
pagetopnotes.setAttribute("class", "notesdiv");
MAINDIV.appendChild( pagetopnotes );
var pagetopnotesstring = "";
if (!TAGSSTRING){
	pagetopnotesstring = PAGETOPDESC["all"];
}
if (PAGETOPDESC[ TAGSSTRING ]){
	pagetopnotesstring += "<br><br>"
	pagetopnotesstring += PAGETOPDESC[ TAGSSTRING ];
}
if (!IDSTRING){
	pagetopnotes.innerHTML = "<b>" + pagetopstring + ": " + CURRENTENTRIES.length + " out of " + Object.keys(ENTRIES).length +  " entries" +"</b>" + pagetopnotesstring + "<br><br>"
}
if (TAGSSTRING){
	pagetopnotes.innerHTML += "<b><a href=\"entry.html\"><-- View all entries</a></b><br><br>"
}
pagetopnotes.innerHTML += "<b><a href=\"search.html\"><-- Back to search</a></b>"

for (var i = 0; i < CURRENTENTRIES.length; i++){
	var key = CURRENTENTRIES[i];
	var ce = ENTRIES[key]
	addDictEntry(key, ce);
}

function addDictEntry(key, ce){
	var outerdiv 	= document.createElement("div");
	outerdiv.setAttribute("class", "outerdiv");
	outerdiv.setAttribute("id", key);
	
	var headerdiv	= document.createElement("div");
	
	// ENTRY IMAGE
	var imgdiv		= document.createElement("div");
	// the image defaults to the same name as the entry key
	// but can be otherwise specified with the "img" attribute
	// no image can be specified with the string "none"
	var imgsrc = key;
	if (ce.img) {
		imgsrc = ce.img;
	}
	if (imgsrc != "none"){
		imgdiv.setAttribute("class","imgdiv");
		imgdiv.innerHTML = "<img src='img/" + imgsrc + ".png'>"
		headerdiv.appendChild( imgdiv );
	}
	
	// ENTRY TITLE
	var titlediv	= document.createElement("div");
	titlediv.setAttribute("class","titlediv");
	var titlestring = getEntryTitle( ce )
	titlediv.innerHTML = "<h2>" + titlestring + "</h2>";
	
	if (ce.date){
		titlediv.innerHTML += "Last updated: " + ce.date.toLocaleDateString("en-GB", DATEOPTIONS);
	}
	
	headerdiv.appendChild( titlediv );
	
	outerdiv.appendChild( headerdiv );
	
	// ENTRY ETYMOLOGY
	// these will be colored later by tags so keep them in higher scope
	var etymcells = [];
	if (ce.etym && ce.etym.length > 0) {
		var etymdiv		= document.createElement("div");
		etymdiv.setAttribute("class","etymdiv");
		etymdiv.innerHTML = "<b>Etymology:</b><br>"		
		
		var etymtable	= document.createElement("table");
		etymdiv.appendChild( etymtable );
		
		var row = etymtable.insertRow();
		// so that there is not so much empty space beneath the table (its already padded by the outer etymdiv)
		etymtable.style.marginBottom = "0px";
		
		// each item in the etymology gets its own cell
		for (var i = 0; i < ce.etym.length; i++){
			var cc = row.insertCell(); // current cell
			// each cell is given the same width
			cc.style.width = (100 / ce.etym.length) + "%"
			var cetymstring = doMarkup( ce.etym[i] );
			cc.innerHTML = cetymstring;
			etymcells[i] = cc;
		}
		
		outerdiv.appendChild( etymdiv );
	}
	
	// ENTRY NOTES
	if (ce.notes){
		var notesdiv	= document.createElement("div");
		notesdiv.setAttribute("class","notesdiv");
		var notesstring = doMarkup( ce.notes );
		notesdiv.innerHTML = notesstring;
		outerdiv.appendChild( notesdiv );
	}
	
	// ENTRY DERIVED TERMS
	if (ce.derivedterms){
		// giving it the same class as etymdiv cus they both contain tables inside the div
		var dtdiv	= document.createElement("div");
		dtdiv.setAttribute("class","etymdiv");
		dtdiv.innerHTML = "<b>Derived terms:</b><br>"	
		var dttable	= document.createElement("table");
		dtdiv.appendChild( dttable );
		dttable.style.marginBottom = "0px";
		
		var currentrow;
		for (var i = 0; i < ce.derivedterms.length; i++){
			// start a new row
			if (i % 2 == 0){
				currentrow = dttable.insertRow();
			}
			var currentdt = ce.derivedterms[i];
			var cdtstring = doMarkup( "• [r]" + currentdt + "[/r]" );
			
			var cc = currentrow.insertCell(); // current cell
			cc.style.width = "50%"
			cc.innerHTML += cdtstring;
		}
		outerdiv.appendChild( dtdiv );
	}
	
	// ENTRY TAGS
	// while iterating thru tags, if an etym tag is found, the corresponding etym cell is colored in all in one pass
	var curretymcell = 0;
	// redundant tags are not removed but they arent displayed
	var seentags = {};
	
	var tagsdiv		= document.createElement("div");
	tagsdiv.setAttribute("class","tagsdiv");
	var tagsstring = "<b>Tags: </b>"
	if (ce.tags){
		for (var i = 0; i < ce.tags.length; i++){
			// current tag
			var ctag = ce.tags[i]
			if (!seentags[ctag]){
				tagsstring += "<a href=\"?tags=" + ce.tags[i] + "\">"
				tagsstring += ce.tags[i] + "</a>, "
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