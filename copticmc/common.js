// common functions used by the whole site

// registry of tag keywords:
// [c]: citation
// [d]: demotic text 		(soon to be deprecated)
// [h]: hieroglyphic text 	(soon to be deprecated)
// [k]:	coptic text			(soon to be deprecated)
// [r]: reference to another entry on the site
// [s]: scriptorium link 	(soon to be deprecated)

var TAG_KEYWORDS = [ "c", "d", "h", "i", "k", "r" ]

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
	"cdd_b":	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_B.pdf#page=",
	"cdd_g":	"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/CDD_G.pdf#page=",
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
	"dpdp_c":	"http://129.206.5.162/beta/palaeography/palaeography.html?q=",
	"dpdp_tm":	"http://129.206.5.162/beta/palaeography/palaeography.html?q=tm_nam:",
	"dvs":		"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/SAOC38.pdf#page=",
	"lambdin":	"",
	"prhind1":	"http://129.206.5.162/beta/palaeography/database/papyri/pRhind%20I.html/",
	"richter":  "https://archiv.ub.uni-heidelberg.de/propylaeumdok/4629/1/Richter_Borrowing_into_Coptic_2017.pdf#page=",
	"sawy":		"https://d-nb.info/1274430623/34#page=",
	"tla":		"https://thesaurus-linguae-aegyptiae.de/lemma/",
	"two":		"https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/saoc45.pdf#page=",
	"vycichl": 	"",
}
var SOURCE_NAMES = {
	"aeka":		"Erichsen",
	"aep":		"Allen <i>AEP</i>",
	"cdd_b":	"<i>CDD</i> B",
	"cdd_g":	"<i>CDD</i> G",
	"cdd_i":	"<i>CDD</i> Ỉ",
	"cdd_m":	"<i>CDD</i> M",
	"cdd_s":	"<i>CDD</i> S",
	"cdd_q":	"<i>CDD</i> Q",
	"cdo":		"<i>CDO</i>",
	"cerny":	"<i>ČED</i>",
	"crum":		"<i>CD</i>",
	"dpdp":		"<i>DPDP</i>",
	"dpdp_c":	"<i>DPDP</i>",
	"dpdp_tm":	"<i>DPDP tm</i>",
	"dvs":		"Johnson <i>DVS</i>",
	"ep":		"Peust <i>EP</i>",
	"lambdin":	"Lambdin",
	"ma":		"Mawood",
	"prhind1":	"P.&nbsp;Rhind&nbsp;I",
	"richter":	"Richter",
	"sawy":		"Sawy",
	"tla":		"<i>TLA</i>",
	"two":		"Johnson <i>TWO</i>",
	"vycichl":	"<i>DELC</i>"
}

// when citing a page number , but linking to the document the page number is different
var SOURCE_PAGE_OFFSETS = {
	"dvs":		12,
	"richter": -512,
	"sawy": 	3,
	"two":		6
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

var SCRIPTORIUM_LINKS = {
	"deut19":	"https://data.copticscriptorium.org/texts/old-testament/05_deuteronomy_19/",
	"exo24":	"https://data.copticscriptorium.org/texts/old-testament/02_exodus_24/",
	"jer11":	"https://data.copticscriptorium.org/texts/old-testament/24_jeremiah_11/",
	"jud9":		"https://data.copticscriptorium.org/texts/old-testament/07_judges_9/",
	"prov25":	"https://data.copticscriptorium.org/texts/old-testament/20_proverbs_25/",
	"psa73":	"https://data.copticscriptorium.org/texts/old-testament/19_psalms_73/",
	"rev21": 	"https://data.copticscriptorium.org/texts/new-testament/66_revelation_21/"
}
var SCRIPTORIUM_NAMES = {
	"deut19":	"Deuteronomy&nbsp19",
	"exo24":	"Exodus&nbsp;24",
	"jer11":	"Jeremiah&nbsp;11",
	"jud9":		"Judges&nbsp;9",
	"prov25":	"Proverbs&nbsp;25",
	"psa73":	"Psalm&nbsp;73",
	"rev21": 	"Revelation&nbsp;21"
}

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
	"generic-type":			"Words which do not refer to a specific block or item, but instead are used in a whole family of blocks/items of this type. This includes materials which the blocks/items are made out of (examples: gold, iron, wood), forms of blocks/items (examples: planks, stairs, swords), or the generic terms for objects which are always colored (examples: bed, wool). All of these words have a number of derived terms.",
	"no-descendant": 		"Words for which an earlier Egyptian / Demotic term is attested, but a Coptic descendant is not known.",
	"not-to-be-translated": "Words which are fully or partially on the \"Not to be translated\" list of the <a href=\"https://docs.google.com/spreadsheets/d/1xxDvR2MrPUaxXwNfn-oJX-fBerEsZkfo\">Minecraft Official Glossary</a>.",
	"thermalexpansion":		"Words used in the mod <a href=\"https://teamcofh.com/docs/1.12/thermal-expansion/\">Thermal Expansion</a>. This is a mod about industrialization, so the attested Coptic vocabulary to work with is understandably limited. But the machines are not realistic and almost in the realm of fantasy; names such as \"Aqueous Accumulator\" are not much more attested in English than the Coptic translated equivalents. So I feel a bit less hesitant about coinage and using unattested terms for this particular mod than with <a href=\"?tags=vanilla\">the base game</a> or other mods, but I still try to be faithful to the language and find the proper citations wherever possible.",
	"thermalfoundation":	"Words used in the mod <a href=\"https://teamcofh.com/docs/1.12/thermal-foundation/\">Thermal Foundation</a>.",
	"uncertain":			"Words for which a suitable translation has not been decided upon yet.",
	"vanilla":				"Words used in the base game without mods."
}

function getEntryTitle( ce ){
	// first, get the coptic text in [k] tags
	var titlestring = "[k]" + ce.coptic + "[/k]";
	
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

// simple csv
function parseTagString(instring){
	var outtable = [];
	if (!instring){ return outtable; }
	var lastcommaindex = 0;
	for (var i = 0; i < instring.length; i++){
		var cc = instring.substring(i, i+1); // current char
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

// give it the string with the first character being the opener [
// returns an array with two items: [0]: the new string, [1]: char count in the old string to skip over
function parseTag( intagstring ){
	var outstring = "";
	// 0 = skip no characters, 1 = skip one character, etc.
	var skipcharcount = 0;
	
	// find first ] starting at the index of the current [
	var rightbracketind = intagstring.indexOf("]");
	var innertagtext = intagstring.substring(1, rightbracketind)
	
	// if no tag exists for the string between the [] brackets, then just put the [ char,
	//  and continue as normal-- this is so that sequences like "[...]" (i.e. a lacuna) can be ignored
	if (TAG_KEYWORDS.indexOf(innertagtext) == -1){
		console.log("Warning: [" + innertagtext + "] tag does not exist!");
		//outstring += cc; i++; continue;
		return [ "[", 0 ];
	}
	// now we must find the first closing tag that matches the opening tag
	var closingtag = "[/" + innertagtext + "]";
	var closingtagindex = intagstring.indexOf(closingtag)
	// if no closing tag exists then just put the [ char and continue on (and give a warning)
	if (closingtagindex == -1){
		console.log("Warning: [" + innertagtext + "] tag was not closed!")
		//outstring += cc; i++; continue;
		return [ "[", 0 ];
	}
	// inner text = the text between the [] and [/] tags
	var innertext = intagstring.substring( (innertagtext.length + 2), closingtagindex );	
	
	// gather all the arguments inside the inner text (delimited by pipe (|) chars)
	var i = 0; var tagargs = []; var currargstring = "";
	while (i < innertext.length){
		var cc = innertext.substring(i, i+1); // current char
		
		// if another tag is opened inside of this tag, then handle it recursively!
		if (cc == "["){
			var outs = parseTag( innertext.substring( i ) );
			currargstring += outs[0];
			i += outs[1];
			
		// pipe: argument delimiter
		}else if (cc == "|"){
			tagargs.push( currargstring );
			currargstring = "";
		}else{
			currargstring += cc
		}
		i++;
	}
	// the last ( or only ) argument won't have a pipe following, so push it
	tagargs.push( currargstring );
	console.log( tagargs );
	
	// handling the different tags is much simpler now than before
	
	// [c][/c] TAG: CITATION
	if (innertagtext == "c"){
		if (!SOURCE_NAMES[tagargs[0]]){
			console.log("Warning: unknown source " + tagargs[0] + " was cited!")
			return [ "[", 0 ];
		}
	
	// [d][/d] TAG: DEMOTIC TEXT (soon to be deprecated)
	}else if (innertagtext == "d"){
		outstring += " <span class=\"demotic\">";
		outstring += tagargs[0]
		outstring += "</span> "
		
	// [h][/h] TAG: HIEROGLYPHIC TEXT (soon to be deprecated)
	}else if (innertagtext == "h"){
		outstring += " <span class=\"hiero\">";
		outstring += tagargs[0]
		outstring += "</span> "
		
	// [i][/i] TAG: ITALIC TEXT
	// (used for bracketed non-bold italic sections in headers)
	}else if (innertagtext == "i"){
		outstring += "<span class=\"notbold\">[<i>";
		outstring += tagargs[0]
		outstring += "</i>]</span>"
		
	// [k][/k] TAG: COPTIC TEXT (soon to be deprecated)
	}else if (innertagtext == "k"){
		outstring += "<span class=\"coptic\">";
		outstring += tagargs[0]
		outstring += "</span>"
		
	// [r][/r] TAG: REFERENCE TO ANOTHER ENTRY
	}else if (innertagtext == "r"){
		var ce = ENTRIES[tagargs[0]]; // current entry 
		if (!ce){
			console.log("Warning: unknown entry " + tagargs[0] + " was referenced!")
			return [ "[", 0 ];
		}
		// if entry exists on the page then link to it, otherwise dont
		if (CURRENTENTRIES.indexOf( tagargs[0] ) > -1){
			outstring += "<b><a href=\"entry.html#" + tagargs[0] + "\">"
			outstring += getEntryTitle( ce )
			outstring += "</a></b>"
		}else{
			outstring += "<b>"
			outstring += getEntryTitle( ce )
			outstring += "</b>"
		}
	}
	
	return [ outstring, closingtagindex + closingtag.length - 1 ];
}

function doMarkup( instring ){
	var outstring = "";
	
	var i = 0;
	while (i < instring.length) {
		var cc = instring.substring(i, i+1); // current char
		
		if (cc == "["){
			var outs = parseTag( instring.substring( i ) );
			outstring += outs[0];
			i += outs[1];
			
		// only put characters one by one if there is no tag to deal with
		}else{
			outstring += cc;
		}
		
		i++;
	}
/* 		var substring3 = instring.substring( i, i+3 )
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
			
		// [k][/k] TAG: COPTIC TEXT (the k stands for Keme / Khemi)
		}else if (substring3 == "[k]"){
			var tagcloseindex = instring.indexOf("[/k]", i);
			if (tagcloseindex == -1){
				console.log("Error: [k] tag not closed")
				i++;
				continue;
			}
			var innertext = instring.substring(i+3, tagcloseindex);
			outstring += "<span class=\"coptic\">";
			outstring += innertext
			outstring += "</span>"
			
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
				outstring += "<b><a href=\"entry.html#" + innertext + "\">"
				outstring += getEntryTitle( ENTRIES[innertext] )
				outstring += "</a></b>"
			}else{
				outstring += "<b>"
				outstring += getEntryTitle( ENTRIES[innertext] )
				outstring += "</b>"
			}
			i = tagcloseindex + 3;
			
		// [s][/s] TAG: SCRIPTORIUM CITATION ( no parentheses, can do colon for bible verses )
		}else if (substring3 == "[s]"){
			var tagcloseindex = instring.indexOf("[/s]", i);
			if (tagcloseindex == -1){
				console.log("Error: [s] tag not closed")
				i++;
				continue;
			}
			var innertext = instring.substring(i+3, tagcloseindex);
			var hyphenindex = innertext.indexOf("-")
			// if there is a hyphen, then use the part before the hyphen as the key to the link table with a scriptorium page
			// if there is no hyphen, then use the whole string
			var keystring = ( hyphenindex > -1 ) ? innertext.substring(0, hyphenindex) : innertext
			var citationlink = SCRIPTORIUM_LINKS[keystring]
			var citationname = SCRIPTORIUM_NAMES[keystring];
			// the text before the link tag gets wrapped around it ( or doesn't )
			var citationstring = "";
			if (citationname){
				citationstring = citationname;
			}else{
				citationstring = "Invalid Scriptorium citation name"
			}
			if ( hyphenindex > -1 ){
				var citationverse = innertext.substring(hyphenindex + 1);
				citationstring += ":" + citationverse;
			}
			
			if (citationlink){
				// automatically goes to the analytic page, but that could be changed 
				citationlink += "analytic"
				citationstring = "<a href=\"" + citationlink + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + citationstring
				citationstring += "</a>"
			}
			outstring += citationstring
			
			i = tagcloseindex + 3;
			
		// only put characters one by one if there is no tag to deal with
		}else{
			outstring = outstring + instring.substring(i, i+1);
		}
		i++;
	} */
	
	return outstring;
}