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

$(document).ready(function () {

	state.time=moment().add(100, 'years');

	var refreshIngameClock = function () {
		$("#ingame-clock").html(state.time.format('ddd MMM Do YYYY'));
		state.time=state.time.add(1, 'days');
		setTimeout(refreshIngameClock, 1000);
	}
	setTimeout(refreshIngameClock, 1000);

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

	$.get('/scenarios/poiConnections.yml')
		.done(function (data) {
			connections = jsyaml.load(data);
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
			_.each(connections, function (v, k) {
				drawConnection(locations[v.path[0]].coordinates.x, locations[v.path[0]].coordinates.y, locations[v.path[1]].coordinates.x, locations[v.path[1]].coordinates.y);
			})
		});
});

function skillCheck(skillName, difficultyClass, partyMember) {
	return Math.random() * 99 + 1 + state.team[partyMember][skillName] >= difficultyClass;
}

function invUpdate(itemName, amount) {
	var itemBag = state.team.inventory;
	//In the future, change this to be the team's bag
	if (typeof itemBag[itemName] === 'undefined') {
		itemBag[itemName] = 0;
	}
	itemBag[itemName] += amount;
}

function invCheck(itemName, amount) {
	return _.get(state, 'team.inventory.' + itemName, 0) >= amount;
}