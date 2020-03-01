var time = {
	init: function() {
		time.timeButtonPress();
	},
	processMessage(m) {
		time.updateClock();
	},
	updateClock: function() {
		$("#ingame-clock").html(moment(core.state.time).format('MMM DD YYYY'));
		$("#time-button").html(core.state.timeRunning? 'Stop' : 'Start');
	},
	timeButtonPress: function() {
		$("#time-button").on("click", function (e) {
			$.ajax({
				type: "POST",
				dataType: 'json',
				url: '/time-control',
				contentType : 'application/json',
				success: function (data) {
					core.state=data.state;
					time.updateClock();
				}
			})
		});
	},
	stop: function() {
		if (core.state.timeRunning) {
			time.timeButtonPress();
		}
	}
}