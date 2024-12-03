var MAINDIV = document.getElementById("maindiv");
var DATEOPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

for (var i = 0; i < ENTRIES.length; i++){
	var ce = ENTRIES[i]
	addDictEntry(ce);
}

//var SUMMARYDIV = document.getElementById("summarydiv");
//SUMMARYDIV.innerHTML += "Total log entries: " + ENTRIES.length;

function addDictEntry(ce){
	// FOREGROUND OBJECT HEADER
	MAINDIV.innerHTML += "<h1><center>" + ce.name + "</center></h1>"
	
	for (var i = 0; i < ce.backgroundobjects.length; i++){
		var cbo = ce.backgroundobjects[i];
		
		var outerdiv 	= document.createElement("div");
		outerdiv.setAttribute("class", "outerdiv");
		//outerdiv.setAttribute("id", key);
		
		var headerdiv	= document.createElement("div");
		
/* 		// ENTRY DSS IMAGE
		var dssimgdiv		= document.createElement("div");
		dssimgdiv.setAttribute("class","imgdiv");
		dssimgdiv.innerHTML = "<img style=\"height:100%\" src='img/dss/" + imgsrc + ".png'>"
		headerdiv.appendChild( dssimgdiv )
		
		// ENTRY HUBBLE IMAGE
		var hubbleimgdiv	= document.createElement("div");
		hubbleimgdiv.setAttribute("class","imgdiv");
		hubbleimgdiv.innerHTML = "<img style=\"height:100%\" src='img/hubble/" + imgsrc + ".png'>"
		headerdiv.appendChild( hubbleimgdiv ) */
		
		// ENTRY TITLE
		var titlediv	= document.createElement("div");
		titlediv.setAttribute("class","titlediv");
		var titlestring = cbo.name
		titlediv.innerHTML = "<h2>" + titlestring + "</h2>";
		
		headerdiv.appendChild( titlediv );
		outerdiv.appendChild( headerdiv );
		
		// ENTRY INFO TABLE
		
		var tablediv = document.createElement("div");
		var infotable = document.createElement("table");
		var headerrow = infotable.insertRow();
		headerrow.innerHTML = "<th>DSS2 photo</th><th>Hubble photo</th><th>RA</th><th>Dec</th><th>Apparent size</th><th>Distance (Mpc)</th>"
		
		var inforow = infotable.insertRow();
		var dsscell = inforow.insertCell();
		dsscell.innerHTML = "<img style=\"width:256px\" src='img/dss/" + cbo.id + ".png'>"
		
		var hubblecell = inforow.insertCell();
		hubblecell.innerHTML = "<img style=\"width:256px\" src='img/hubble/" + cbo.id + ".png'>"
		
		var racell = inforow.insertCell();
		racell.innerHTML = cbo.ra;
		var deccell = inforow.insertCell();
		deccell.innerHTML = cbo.dec;
		var sizecell = inforow.insertCell();
		sizecell.innerHTML = cbo.size;
		var distcell = inforow.insertCell();
		distcell.innerHTML = cbo.distance;
		
		tablediv.appendChild(infotable);
		outerdiv.appendChild(tablediv);
		
		
		// ENTRY NOTES
		if (cbo.desc){
			var notesdiv	= document.createElement("div");
			notesdiv.setAttribute("class","notesdiv");
			notesdiv.innerHTML = cbo.desc;
			outerdiv.appendChild( notesdiv );
		}
		
		MAINDIV.appendChild( outerdiv );
	}
}