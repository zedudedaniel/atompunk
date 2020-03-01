var events = {
	init: function() {
		// do nothing for now
	},
	renderState: function(stateId) {
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
	},
	showState: function() {
		// TBD
	}
}

