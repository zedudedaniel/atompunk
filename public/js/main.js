var scenarios;
var connections;
function renderState(stateId) {
	var description = scenarios[stateId].description;
	var dialogue;
	$("#poi-info").html(description);
	var buttons = [];
	var options = scenarios[stateId].options;
	for (var i in options) {
		var option = options[i];
		buttons.push({
			text: option.label,
			goto: option.goto,
			click: function (e) {
				dialogue.dialog("close");
				renderState(e.target.attributes.goto.value);
			}
		});
	};
	dialogue = $("#poi-info").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		title: scenarios[stateId].title,
		buttons: buttons,
		show: {
			effect: "fade",
			duration: 200
		},
		hide: {
			effect: "fade",
			duration: 200
		}
	});
	dialogue.dialog("open");
}

$(document).ready(function () {
	$.get('/scenarios/diamondCity.yml')
		.done(function (data) {
			scenarios = jsyaml.load(data);
		});

	_.each(locations, function (v, k) {
		$("body").prepend('<div class="poi" id="' + k + '" style="position: absolute; left: ' + v.coordinates.x + 'px; top: ' + v.coordinates.y + 'px">' + '<div class="poi-image"><img src="images/' + locationTypes[v.type].icon + '"></div><div class="poi-text">' + v.label + "</div></div>");

		$(".poi-image").on("click", function (e) {
			var stateId;
			if (e.target.className == "poi-image") {
				stateId = locations[e.target.parentElement.id].initEvent;
			} else {
				stateId = locations[e.target.parentElement.parentElement.id].initEvent;
			}
			renderState(stateId);
		});
	});

	$.get('/scenarios/poiConnections.yml')
		.done(function (data) {
			connections = jsyaml.load(data);
			function drawConnection(x1,y1,x2,y2) {
				var angle = Math.atan((y2-y1)/(x2-x1 + 0.00000001));
				var length = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
				var left = x1 + 40;
				var top = y1 + 11;
				$("body").prepend('<div class="connection" style="transform: rotate('+angle+'rad); left: '+left+'px; top: '+top+'px; width: '+length+'px;"></div>');
			}
			_.each(connections, function (v, k) {
				drawConnection(locations[v.path[0]].coordinates.x, locations[v.path[0]].coordinates.y, locations[v.path[1]].coordinates.x, locations[v.path[1]].coordinates.y);
			})
		});
});
