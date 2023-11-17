var ETYM_COLORS = {
	"egy": "#fff6db",
	"grk": "#deeaff",
	"mod": "#ffdfdf",
	"prs": "#d9fbff",
	"sem": "#dfffe4",
	"unk": "#ffffff"
}

var SOURCE_LINKS = {
	// Johnson, Janet H. (2001) The Demotic Dictionary of the Institute for the Study of Ancient Cultures of the University of Chicago
	"cdd_m": 	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_M.pdf#page=",
	"cdd_q":	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_Q.pdf#page=",
	// Coptic Dictionary Online, ed. by the Koptische/Coptic Electronic Language and Literature International Alliance (KELLIA)
	"cdo":		"https://coptic-dictionary.org/entry.cgi?tla=",
	// Černý, Jaroslav (1976) Coptic Etymological Dictionary, Cambridge: Cambridge University Press
	"cerny":	"",
	"lambdin":	"",
	"vycichl": 	"",
}
var SOURCE_NAMES = {
	"cdd_m":	"<i>CDD</i> M",
	"cdd_q":	"<i>CDD</i> Q",
	"cdo":		"<i>CDO</i>",
	"cerny":	"<i>ČED</i>",
	"lambdin":	"Lambdin",
	"vycichl":	"<i>DELC</i>"
}

// when citing a page number , but linking to the document the page number is different
var SOURCE_PAGE_OFFSETS = {
	/* "cerny":	21 */
}

// abbreviations in case I forget how to spell their names
SOURCE_LINKS["ce"] 			= SOURCE_LINKS["cerny"]
SOURCE_LINKS["vy"] 			= SOURCE_LINKS["vycichl"]
SOURCE_NAMES["ce"] 			= SOURCE_NAMES["cerny"]
SOURCE_NAMES["vy"] 			= SOURCE_NAMES["vycichl"]
SOURCE_PAGE_OFFSETS["ce"] 	= SOURCE_PAGE_OFFSETS["cerny"]
SOURCE_PAGE_OFFSETS["vy"]	= SOURCE_PAGE_OFFSETS["vycichl"]

var MAINDIV = document.getElementById("maindiv");

for (key in ENTRIES) {
	var ce = ENTRIES[key] // current entry
	addDictEntry(key, ce);
}

function addDictEntry(key, ce){
	var outerdiv 	= document.createElement("div");
	outerdiv.setAttribute("class", "outerdiv");
	
	var headerdiv	= document.createElement("div");
	
	// ENTRY IMAGE
	var imgdiv		= document.createElement("div");
	// the image defaults to the same name as the entry key
	// but can be otherwise specified with the "img" attribute
	var imgsrc = key;
	if (ce.img) {
		imgsrc = ce.img;
	}
	imgdiv.setAttribute("class","imgdiv");
	imgdiv.innerHTML = "<img src='img/" + imgsrc + ".png'>"
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

function doMarkup( instring ){
	var outstring = "";
	
	var i = 0;
	while (i < instring.length) {
		var substring3 = instring.substring( i, i+3 )
		// [c][/c] TAG: citation
		if (substring3 == "[c]"){
			var tagcloseindex = instring.indexOf("[/c]", i);
			if (tagcloseindex > -1){
				
				var innertext = instring.substring(i+3, tagcloseindex);
				// every citation has a hyphen
				// before hyphen: name of work cited
				// after hyphen: page number
				var hyphenindex = innertext.indexOf("-")
				if (hyphenindex > -1){
					var citationname = innertext.substring(0, hyphenindex);
					var citationpage = innertext.substring(hyphenindex + 1);
					
					var pstring = "";
					pstring = pstring + "(" + SOURCE_NAMES[citationname] + " " + citationpage + ")"
					
					// generates a link and sets it to the right page if it can
					if (SOURCE_LINKS[citationname]){
						/* var offset = SOURCE_PAGE_OFFSETS[citationname] ? SOURCE_PAGE_OFFSETS[citationname] : 0; */
						
						outstring = outstring + "<a href=\""
						outstring = outstring + SOURCE_LINKS[citationname]
						outstring = outstring + citationpage
						outstring = outstring + "\" target=\"_blank\" rel=\"noopener noreferrer\">"
						outstring = outstring + pstring
						outstring = outstring + "</a>"
					}else{
						outstring = outstring + pstring
					}
					
				}else{
					console.log("Error: no hyphen in citation")
				}
				
				// the [/c] closer is 4 chars long, minus one so when it increments itll be on the right char
				i = tagcloseindex + 3;
			}else{
				console.log("Error: [c] tag not closed")
			}
		// only put characters one by one if there is no tag to deal with
		}else{
			outstring = outstring + instring.substring(i, i+1);
		}
		i++;
	}
	
	return outstring;
}