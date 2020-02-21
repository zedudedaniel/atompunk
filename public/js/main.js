var knowledge;

var state;

$(document).ready(function () {

	

	loadKnowledge();
	loadState();
	//loadLocations();
	drawPois();
	writeAndBindResources();
	drawConnections();
	connectToWS();
	timeButtonPress();
});