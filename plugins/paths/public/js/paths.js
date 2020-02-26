function drawConnections() {
	function drawConnection(x1, y1, x2, y2) {
		var angle = Math.atan((y2 - y1) / (x2 - x1 + 0.00000001));
		if (x2 < x1) {
			angle = y2 < y1 ? Math.PI + angle : Math.PI - angle;
		}
		var length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		var left = x1 + 40;
		var top = y1 + 11;
		$("body").prepend('<div class="connection" style="transform: rotate(' + angle + 'rad); left: ' + left + 'px; top: ' + top + 'px; width: ' + length + 'px;"></div>');
	}
	_.each(knowledge.poiConnections, function (v, k) {
		drawConnection(knowledge.locations[v.path[0]].coordinates.x, knowledge.locations[v.path[0]].coordinates.y, knowledge.locations[v.path[1]].coordinates.x, knowledge.locations[v.path[1]].coordinates.y);
	})
}