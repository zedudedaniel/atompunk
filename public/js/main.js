var scenarios;
$(document).ready(function () {
	$.get('/scenarios/diamondCity.yml')
		.done(function (data) {
			scenarios = jsyaml.load(data);

			/*
			console.log('File load complete');
			console.log(jsyaml.load(data));
			var jsonString = JSON.stringify(data);
			console.log(jsonString);
			console.log($.parseJSON(jsonString));
			*/
		});

	_.each(locations, function (v, k) {
		$("body").prepend('<div class="poi" id="' + k + '" style="position: absolute; left: ' + v.coordinates.x + 'px; top: ' + v.coordinates.y + 'px">' + '<div class="poi-image"><img src="images/' + locationTypes[v.type].icon + '"></div><div class="poi-text">' + v.label + "</div></div>");

		$(".poi-image").on("click", function (e) {
			var event = locations[e.target.parentElement.parentElement.id].initEvent;
			var description = scenarios[event].description;
			$("#poi-info").html(description);
			dialogue = $("#poi-info").dialog({
				autoOpen: false,
				height: 400,
				width: 350,
				modal: true,
				buttons: {
					"Option 1": function () {
						dialog.dialog("close");
					},
					"Option 2": function () {
						dialog.dialog("close");
					}
				}
			});
			dialogue.dialog("open");
		});
	});

});