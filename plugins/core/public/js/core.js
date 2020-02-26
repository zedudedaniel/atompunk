function loadState() {
	$.ajax({
		url: '/state',
		async: false,
		dataType: 'json',
		success: function (data) {
			state = data;
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

function connectToWS() {
	const socket = new WebSocket('ws://localhost:8080');

	// Connection opened
	socket.addEventListener('open', function (event) {
		socket.send('Hello Server!');
	});

	// Listen for messages
	socket.addEventListener('message', function (event) {
		//console.log('Message from server ', event.data);
		state = JSON.parse(event.data).state;
		showState();
	});
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