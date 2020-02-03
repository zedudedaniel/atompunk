_.each(locations,function(v,k){
	$("body").prepend('<div class="poi" id="' + k +'" style="position: absolute; left: ' +v.coordinates.x + 'px; top: ' +v.coordinates.y+ 'px">' + '<div class="poi-image"><img src="images/'+locationTypes[v.type].icon+'"></div><div class="poi-text">' + v.label + "</div></div>");
});