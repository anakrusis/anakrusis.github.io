var ETYM_COLORS = {
	"egy": "#fff6db",
	"grk": "#deeaff",
	"mod": "#ffdfdf",
	"prs": "#d9fbff",
	"sem": "#dfffe4",
	"unk": "#ffffff"
}

var SOURCE_LINKS = {
	"aeka": "https://journals.uio.no/actaorientalia/article/view/5256/4598/",
	// Johnson, Janet H. (2001) The Demotic Dictionary of the Institute for the Study of Ancient Cultures of the University of Chicago
	"cdd_i":	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_'I.pdf#page=",
	"cdd_m": 	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_M.pdf#page=",
	"cdd_s":	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_S.pdf#page=",
	"cdd_q":	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_Q.pdf#page=",
	// Coptic Dictionary Online, ed. by the Koptische/Coptic Electronic Language and Literature International Alliance (KELLIA)
	"cdo":		"https://coptic-dictionary.org/entry.cgi?tla=",
	// Černý, Jaroslav (1976) Coptic Etymological Dictionary, Cambridge: Cambridge University Press
	"cerny":	"",
	"crum":		"https://coptot.manuscriptroom.com/crum-coptic-dictionary/?docID=800000&pageID=",
	"dpdp":		"http://129.206.5.162/beta/palaeography/palaeography.html?q=tla:",
	"lambdin":	"",
	"richter":  "https://archiv.ub.uni-heidelberg.de/propylaeumdok/4629/1/Richter_Borrowing_into_Coptic_2017.pdf#page=",
	"sawy":		"https://d-nb.info/1274430623/34#page=",
	"tla":		"https://thesaurus-linguae-aegyptiae.de/lemma/",
	"two":		"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/saoc45.pdf#page=",
	"vycichl": 	"",
}
var SOURCE_NAMES = {
	"aeka":		"Erichsen",
	"cdd_i":	"<i>CDD</i> Ỉ",
	"cdd_m":	"<i>CDD</i> M",
	"cdd_s":	"<i>CDD</i> S",
	"cdd_q":	"<i>CDD</i> Q",
	"cdo":		"<i>CDO</i>",
	"cerny":	"<i>ČED</i>",
	"crum":		"<i>CD</i>",
	"dpdp":		"<i>DPDP</i>",
	"lambdin":	"Lambdin",
	"richter":	"Richter",
	"sawy":		"Sawy",
	"tla":		"<i>TLA</i>",
	"two":		"<i>TWO</i>",
	"vycichl":	"<i>DELC</i>"
}

// when citing a page number , but linking to the document the page number is different
var SOURCE_PAGE_OFFSETS = {
	"richter": -512,
	"sawy": 3,
	"two":	6
}

// abbreviations in case I forget how to spell their names
SOURCE_LINKS["ce"] 			= SOURCE_LINKS["cerny"]
SOURCE_LINKS["vy"] 			= SOURCE_LINKS["vycichl"]
SOURCE_LINKS["cd"] 			= SOURCE_LINKS["crum"]
SOURCE_NAMES["ce"] 			= SOURCE_NAMES["cerny"]
SOURCE_NAMES["vy"] 			= SOURCE_NAMES["vycichl"]
SOURCE_NAMES["cd"] 			= SOURCE_NAMES["crum"]
SOURCE_PAGE_OFFSETS["ce"] 	= SOURCE_PAGE_OFFSETS["cerny"]
SOURCE_PAGE_OFFSETS["vy"]	= SOURCE_PAGE_OFFSETS["vycichl"]

// the page can be specially titled if certain tags are put in
var PAGETOPTITLES = {
	"all":					"All words",
	"block":				"Blocks",
	"death-message":		"Death messages",
	"etym-egy": 			"Words of Egyptian origin",
	"etym-grk": 			"Words of Greek origin",
	"etym-mod": 			"Words of modern origin",
	"etym-prs": 			"Words of Persian origin",
	"etym-sem": 			"Words of Semitic origin",
	"etym-unk": 			"Words of unknown origin",
	"generic-material":		"Generic materials",
	"generic-type":			"Generic types",
	"item":					"Items",
	"mob":					"Mobs",
	"thermalexpansion":		"Thermal Expansion",
	"thermalfoundation":	"Thermal Foundation",
	"vanilla":				"Vanilla Minecraft"
}
var PAGETOPDESC		= {
	"all":			"",
	"etym-egy":		"This category is for words whose predecessors are certainly attested in earlier stages of the Egyptian language. If a word is only attested in Demotic and Coptic, and not earlier Egyptian, then I usually do not include it in this category.",
	"etym-grk":		"This category is for Greek loanwords which were introduced and attested during the productive period of Coptic. For new Greek loanwords, and situations where Greek is one of various modern languages that share a similar word, see the section <a href=\"?tags=etym-mod\">Words of modern origin</a>.",
	"generic-material":		"Words which do not refer to a specific block or item, but instead are used in a whole family of blocks/items made out of this material. Usually combines with a <a href=\"?tags=generic-type\">generic type</a> to make specific blocks and items.",
	"thermalexpansion":		"Words used in the mod <a href=\"https://teamcofh.com/docs/1.12/thermal-expansion/\">Thermal Expansion</a>. This is a mod about industrialization, so the attested Coptic vocabulary to work with is understandably limited. But the machines are not realistic and almost in the realm of fantasy; names such as \"Aqueous Accumulator\" are not much more attested in English than the Coptic translated equivalents. So I feel a bit less hesitant about coinage and using unattested terms for this particular mod than with <a href=\"?tags=vanilla\">the base game</a> or other mods, but I still try to be faithful to the language and find the proper citations wherever possible.",
	"thermalfoundation":	"Words used in the mod <a href=\"https://teamcofh.com/docs/1.12/thermal-foundation/\">Thermal Foundation</a>.",
	"not-to-be-translated": "Words which are fully or partially on the \"Not to be translated\" list of the <a href=\"https://docs.google.com/spreadsheets/d/1xxDvR2MrPUaxXwNfn-oJX-fBerEsZkfo\">Minecraft Official Glossary</a>.",
	"uncertain":			"Words for which a suitable translation has not been decided upon yet.",
	"vanilla":				"Words used in the base game without mods."
}

var MAINDIV = document.getElementById("maindiv");
// the outermost div is usually 75% width, but it looks better on a phone in portrait mode at 95% width, so this simply detects
if (window.innerWidth < window.innerHeight){
	MAINDIV.style.width = "95%";
	//MAINDIV.style.fontSize = "40px";
}

const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const TAGSSTRING = URLPARAMS.get('tags')
CURRENTTAGS = parseTagString( TAGSSTRING )

CURRENTENTRIES = [];

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
pagetopnotes.innerHTML = "<b>" + pagetopstring + ": " + CURRENTENTRIES.length + " out of " + Object.keys(ENTRIES).length +  " entries" + "</b>" + pagetopnotesstring

pagetopnotes.innerHTML += "<br><br><b><a href=\"entry.html\"><-- Clear all tags</a></b>"

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

function doMarkup( instring ){
	var outstring = "";
	
	var i = 0;
	while (i < instring.length) {
		var substring3 = instring.substring( i, i+3 )
		// [c][/c] TAG: CITATION
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
						// add an offset onto the page number only if the page number is a number and an offset exists
						if (typeof(parseInt(citationpage)) == "number" && SOURCE_PAGE_OFFSETS[citationname]){
							var num = parseInt(citationpage)
							citationpage = num + SOURCE_PAGE_OFFSETS[citationname];
						}
						
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
			
		// [d][/d] TAG: DEMOTIC TEXT
		}else if (substring3 == "[d]"){
			var tagcloseindex = instring.indexOf("[/d]", i);
			if (tagcloseindex == -1){
				console.log("Error: [d] tag not closed")
				i++;
				continue;
			}
			// also adds em spaces because its too close to the normal text otherwise
			var innertext = instring.substring(i+3, tagcloseindex);
			outstring += " <span class=\"demotic\">";
			outstring += innertext
			outstring += "</span> "
			
			i = tagcloseindex + 3;
			
		// [h][/h] TAG: HIEROGLYPHIC TEXT
		}else if (substring3 == "[h]"){
			var tagcloseindex = instring.indexOf("[/h]", i);
			if (tagcloseindex == -1){
				console.log("Error: [h] tag not closed")
				i++;
				continue;
			}
			var innertext = instring.substring(i+3, tagcloseindex);
			outstring += " <span class=\"hiero\">";
			outstring += innertext
			outstring += "</span> "
			
			i = tagcloseindex + 3;
			
		// [i][/i] TAG: ITALIC TEXT
		// (used for bracketed non-bold italic sections in headers)
		}else if (substring3 == "[i]"){
			var tagcloseindex = instring.indexOf("[/i]", i);
			if (tagcloseindex == -1){
				console.log("Error: [i] tag not closed")
				i++;
				continue;
			}
			var innertext = instring.substring(i+3, tagcloseindex);
			outstring += "<span class=\"notbold\">[<i>";
			outstring += innertext
			outstring += "</i>]</span>"
			
			i = tagcloseindex + 3;
			
		// [r][/r] TAG: REFERENCE TO ANOTHER ENTRY
		// inner text should be a valid key 
		}else if (substring3 == "[r]"){
			var tagcloseindex = instring.indexOf("[/r]", i);
			if (tagcloseindex == -1){
				console.log("Error: [r] tag not closed")
				i++;
				continue;
			}
			var innertext = instring.substring(i+3, tagcloseindex);
			if (!ENTRIES[ innertext ]){
				console.log("Error: invalid reference to entry")
				i++;
				continue;
			}
			if (CURRENTENTRIES.indexOf( innertext ) > -1){
				outstring += "<b><a href=\"#" + innertext + "\">"
				outstring += getEntryTitle( ENTRIES[innertext] )
				outstring += "</a></b>"
			}else{
				outstring += "<b>"
				outstring += getEntryTitle( ENTRIES[innertext] )
				outstring += "</b>"
			}
			i = tagcloseindex + 3;
			
		// only put characters one by one if there is no tag to deal with
		}else{
			outstring = outstring + instring.substring(i, i+1);
		}
		i++;
	}
	
	return outstring;
}

// simple csv
function parseTagString(instring){
	var outtable = [];
	if (!instring){ return outtable; }
	var lastcommaindex = 0;
	for (var i = 0; i < instring.length; i++){
		var cc = instring.substring(i, i+1);
		if (cc == ","){
			outtable.push( instring.substring( lastcommaindex, i ) );
			// skip the comma itself by adding 1
			lastcommaindex = i + 1;
		}
	}
	// whatever is remaining after the final comma gets pushed too
	outtable.push( instring.substring(lastcommaindex) )
	return outtable;
}

function getEntryTitle( ce ){
	var titlestring =  ce.coptic;
	// if the word is unattested then put an asterisk beside the name
	if (ce.tags.indexOf("unattested") != -1){
		titlestring += " *";
	}
	if (ce.tags.indexOf('uncertain') != -1){
		titlestring += " ?";
	}
	titlestring += " — " + ce.english;
	titlestring = doMarkup( titlestring );
	return titlestring;
}