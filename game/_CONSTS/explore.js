const worldLocations = {
	"Grassy Plains": {
		description: "1st world. Here you can find all the noobs, such as yourself",
		randomEvents: {
			"Bandit Camp": {
				name: "Highlanders",
				type: "raid",
				difficulty: 5,
			},
			Wolves: {
				name: "Wolves",
				type: "raid",
				difficulty: 3,
			},
			Chest: {
				name: "Bandit Camp",
				type: "luck",
				difficulty: 1,
			},
		},
		places:{
			"Bandit Camp": {
				name: "Bandit Camp",
				type: "raid",
				stats:{
					attack: 3,
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
					attack: 2,
					health:40,
				},
				rewards:{
					gold: 500,
					"oak wood": 100,
					"yak wood": 50,
				},
			},
			"Collapsed Mine": {
				name: "Collapsed Mine",
				type: "raid",
				stats:{
					attack: 2,
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
			},
			Cave: {
				name: "Cave",
				type: "hunt",
				stats:{
					attack: 5,
					health:5,
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