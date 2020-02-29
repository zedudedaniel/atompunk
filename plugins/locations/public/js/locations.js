var locations = {
	init: function() {
		this.drawPois();
	},
	drawPois: function() {
		_.each(knowledge.locations, function (v, k) {
			//'+(k===state.location.name? " team-location" : "")+'
			if($('#' + k).length < 1) {
				$("body").prepend('<div class="poi" id="' + k + '" style="position: absolute; left: ' + v.coordinates.x + 'px; top: ' + v.coordinates.y + 'px">' + '<div class="poi-image"><img src="' + knowledge.locationTypes[v.type].icon + '"></div><div class="poi-text">' + v.title + "</div></div>");
			}
			$(".poi-image").on("click", function (e) {
				this.renderPoiInfo(e.target.className == "poi-image" ? e.target.parentElement.id : e.target.parentElement.parentElement.id);
			});
		});
	},
	renderPoiInfo: function(locationId) {
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
					$.ajax({
						type: "POST",
						dataType: 'json',
						//json: true,
						url: '/location',
						contentType : 'application/json',
						data: JSON.stringify({
							buttonId: buttonId,
							location: currentLocation
						})/*,
						success: function (data) {
							state=data.state;
							knowledge=data.knowledge;
							drawPois();
							drawConnections();
							showState();		
						} */
					})
					//eval(knowledge.locations[currentLocation].options[buttonId].run);
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
	},
	travelHere: function() {

	}
}