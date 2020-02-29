var time = {
	init: function() {
		timeButtonPress();
	},
	timeButtonPress: function() {
		$("#time-button").on("click", function (e) {
			$.ajax({
				type: "POST",
				dataType: 'json',
				url: '/time-control',
				contentType : 'application/json',
				success: function (data) {
					state=data.state;
					core.showState();			
				}
			})
		});
	}
}