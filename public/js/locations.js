var locations={
	home: {
		type: "bunker",
		label: "Bunker 001",
		initEvent: "diamondCityCheckpoint",
		coordinates: {
			x: 650,
			y: 360
		}
	},
	diamondCity: {
		type: "city",
		label: "Diamond City",
		coordinates: {
			x: 650,
			y: 330
		}
	},
	crackotown: {
		type: "city",
		label: "Crackotown",
		coordinates: {
			x: 800,
			y: 330
		}
	},
	beeBeeCity: {
		type: "city",
		label: "Bee Bee City",
		coordinates: {
			x: 1000,
			y: 330
		}
	},
	mutantPort: {
		type: "port",
		label: "Mutant's Port",
		coordinates: {
			x: 200,
			y: 11
		}
	}, 
	piratePort: {
		type: "port",
		label: "Pirate's Port",
		coordinates: {
			x: 1300,
			y: 30
		}
	}
};
var locationTypes={
	bunker: {
		icon: "bunker.png"
	},
	city: {
		icon: "city.png"
	},
	port: {
		icon: "port.png"
	}
};

var state = {
	money: 100,
	food: 200,
	team: {
		raphael:{
			name: "Raphael",
			strength: 10,
			special: {
				s:10
			}
		}
	}
};