var core = {
	state: undefined,
	knowledge: undefined,
	init: function() {
		core.loadKnowledge();
		core.loadState();
		core.writeAndBindResources();
	},
	processMessage(m) {
		core.state = JSON.parse(m.data).state;
		core.knowledge = JSON.parse(m.data).knowledge;
		//core.showState();
	},
	loadState: function() {
		$.ajax({
			url: '/state',
			async: false,
			dataType: 'json',
			success: function (data) {
				core.state = data;
			}
		});
	},
	loadKnowledge: function() {
		$.ajax({
			url: '/knowledge',
			async: false,
			dataType: 'json',
			success: function (data) {
				core.knowledge = data;
			}
		});
	},
	writeAndBindResources: function() {
		var inventory = $("#resource-info").dialog({
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
			$("#resource-info").html(_.map(core.state.inventory, function (v, k) {
				return k + ': ' + v;
			}).join('<br/>'));
			inventory.dialog("open");
		});
	}
}