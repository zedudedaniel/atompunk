function loadState() {
	$.ajax({
		url: '/state',
		async: false,
		dataType: 'json',
		success: function (data) {
			state = data;
			state.time=moment().add(100, 'years');
		}
	});
}

function loadKnowledge() {
	$.ajax({
		url: '/knowledge',
		async: false,
		dataType: 'json',
		success: function (data) {
			knowledge = data;
		}
	});
}

function showIngameTime() {
    var refreshIngameClock = function () {
		$("#ingame-clock").html(state.time.format('ddd MMM DD YYYY'));
		state.time=state.time.add(1, 'days');
		setTimeout(refreshIngameClock, 1000);
	}
	setTimeout(refreshIngameClock, 1000);

}

function drawPois() {
	_.each(knowledge.locations, function (v, k) {
		$("body").prepend('<div class="poi" id="' + k + '" style="position: absolute; left: ' + v.coordinates.x + 'px; top: ' + v.coordinates.y + 'px">' + '<div class="poi-image"><img src="images/' + knowledge.locationTypes[v.type].icon + '"></div><div class="poi-text">' + v.title + "</div></div>");

		$(".poi-image").on("click", function (e) {
			renderPoiInfo(e.target.className == "poi-image" ? e.target.parentElement.id : e.target.parentElement.parentElement.id);
		});
	});
}

function renderPoiInfo(locationId) {
	var location = knowledge.locations[locationId];
	var description = location.description;
	var dialogue;
	$("#poi-info").html(description);
	var buttons = [];
	var options = location.options;
	for (var i in options) {
		var option = options[i];
		buttons.push({
			text: option.label,
			currentLocation: locationId,
			buttonId: i,
			disabled: !eval(option.enabled || 'true'),
			click: function (e) {
				dialogue.dialog("close");
				var currentLocation = e.target.attributes.currentLocation.value;
				var buttonId = e.target.attributes.buttonId.value;
				eval(knowledge.locations[currentLocation].options[buttonId].run);
			}
		});
	};
	dialogue = $("#poi-info").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		title: knowledge.locations[locationId].title,
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

function writeAndBindResources() {
    inventory = $("#resource-info").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		title: 'Inventory',
		//buttons: buttons,
		show: {
			effect: "fade",
			duration: 200
		},
		hide: {
			effect: "fade",
			duration: 200
		}
    });
    
	$("#resource-info-button").on("click", function (e) {
		$("#resource-info").html(_.map(state.team.inventory, function (v, k) {
			return k + ': ' + v;
		}).join('<br/>'));
		inventory.dialog("open");
	});
}

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
			currentState: stateId,
			buttonId: i,
			disabled: !eval(option.enabled || 'true'),
			click: function (e) {
				dialogue.dialog("close");
				var currentState = e.target.attributes.currentState.value;
				var buttonId = e.target.attributes.buttonId.value;
				var goto = scenarios[currentState].options[buttonId].goto;
				eval(scenarios[currentState].options[buttonId].run);
				if (typeof goto === 'string') {
					renderState(goto);
				} else {
					for (var j in goto) {
						if (goto[j] === null) {
							renderState(j);
							break;
						} else if (eval(goto[j])) {
							renderState(j);
							break;
						}
					}
				}
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