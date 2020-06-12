const worldLocations = {
	"Grassy Plains": {
		description: "1st world. Here you can find all the noobs, such as yourself",
		randomEvents: {
			"Highlanders": {
				name: "Highlanders",
				type: "raid",
				stats:{
					attack: 30,
					health:10,
				},
				rewards:{
					gold: 100,
				},
			},
			Wolves: {
				name: "Wolves",
				type: "raid",
				stats:{
					attack: 15,
					health:5,
				},
				rewards:{
					gold: 50,
				},
			},
			Chest: {
				name: "Bandit Camp",
				type: "luck",
				rewards:{
					gold: 1000,
				},
			},
		},
		places:{
			"Bandit Camp": {
				name: "Bandit Camp",
				type: "raid",
				stats:{
					attack: 30,
					health:20,
				},
				rewards:{
					gold: 1000,
				},
			},
			"Fishing village": {
				name: "Fishing village",
				type: "raid",
				stats:{
					attack: 10,
					health:30,
				},
				rewards:{
					gold: 500,
					"oak wood": 100,
					"yew wood": 50,
				},
			},
			"Collapsed Mine": {
				name: "Collapsed Mine",
				type: "raid",
				stats:{
					attack: 20,
					health:20,
				},
				rewards:{
					gold: 100,
					"copper ore": 200,
					"iron ore": 150,
				},
			},
			Forest: {
				name: "Forest",
				type: "hunt",
				stats:{
					attack: 5,
					health:5,
				},
				rewards:{
					gold: 1000,
				},
			},
			Cave: {
				name: "Cave",
				type: "hunt",
				stats:{
					attack: 2,
					health:2,
				},
				rewards:{
					gold: 500,
				},
			},
			"Bandidos de la Grande": {
				name: "Bandidos de la Grande",
				type: "miniboss",
				stats:{
					attack: 5,
					health:5,
				},
			},
			"Bandit's Castle": {
				name: "Bandit's Castle",
				type: "dungeon",
				stats:{
					attack: 5,
					health:5,
				},
			},
			River: {
				name: "River",
				type: "fishing",
				difficulty: 1,
			},
		},
	},
};

module.exports = { worldLocations };