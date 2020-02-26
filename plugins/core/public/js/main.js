var knowledge;

var state;

$(document).ready(function () {
	loadKnowledge();
	loadState();
	drawPois();
	writeAndBindResources();
	drawConnections();
	connectToWS();
	timeButtonPress();
});