var maindiv = document.getElementById("maindiv"); 
var innercode = maindiv.innerHTML;

links = [ "https://soundcloud.com/amimifafa", "https://github.com/anakrusis", "https://cohost.org/amimifafa", "https://www.youtube.com/channel/UCcU35bFpdzi4v4SPdtHQp2Q", "https://battleofthebits.org/barracks/Profile/amelia/" ];

linktexts = [ "🎧 sound cloud", "🖥️ git hub", "🥚 cohost", "🎬youtube", "🏆 battle of bit" ];

innercode+="<div class=\"titlebar\"><a href=\"\"><img class=\"headerimg\" src=\"./pog land.png\"></a></div>"
innercode+="<table><tr>"

for (i = 0; i < 5; i++) {
	innercode+="<th><div class = \"linkdiv\">"
	innercode+="<a href=\"" + links[i] + "\">"
	innercode+=linktexts[i] + "</a>"
	innercode+="</div></th>"
}
innercode+="</table></tr>"

maindiv.innerHTML = innercode;
