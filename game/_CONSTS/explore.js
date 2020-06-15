const worldLocations = {
	"Grassy Plains": {
		description: "1st world. Here you can find all the noobs, such as yourself",
		randomEvents: {
			"Highlanders": {
				name: "Highlanders",
				type: "raid",
				stats:{
					attack: 300,
					health:100,
				},
				rewards:{
					gold: 100,
				},
			},
			Wolves: {
				name: "Wolves",
				type: "raid",
				stats:{
					attack: 150,
					health:50,
				},
				rewards:{
					gold: 50,
				},
			},
			Chest: {
				name: "Bandit Camp",
				type: "luck",
				rewards:{
					gold: 500,
				},
			},
		},
		places:{
			"Bandit Camp": {
				name: "Bandit Camp",
				type: "raid",
				stats:{
					attack: 300,
					health:200,
				},
				rewards:{
					gold: 70,
				},
			},
			"Fishing village": {
				name: "Fishing village",
				type: "raid",
				stats:{
					attack: 100,
					health:300,
				},
				rewards:{
					gold: 100,
					"oak wood": 50,
					"yew wood": 20,
				},
			},
			"Collapsed Mine": {
				name: "Collapsed Mine",
				type: "raid",
				stats:{
					attack: 200,
					health:200,
				},
				rewards:{
					gold: 50,
					"copper ore": 100,
					"iron ore": 60,
				},
			},
			Forest: {
				name: "Forest",
				type: "hunt",
				stats:{
					attack: 10,
					health:10,
				},
				rewards:{
					gold: 40,
				},
			},
			Cave: {
				name: "Cave",
				type: "hunt",
				stats:{
					attack: 20,
					health:15,
				},
				rewards:{
					gold: 50,
				},
			},
			"C'Thun": {
				name: "C'Thun",
				type: "miniboss",
				stats:{
					attack: 500,
					health:500,
				},
				reward:{
					dungeonKey: "Ogre tooth",
				},
			},
			"Bandit's Castle": {
				name: "Bandit's Castle",
				type: "dungeon",
				stats:{
					attack: 500,
					health:500,
				},
			},
			River: {
				name: "River",
				type: "fish",
				difficulty: 1,
			},
		},
	},
	"Misty Mountains":{

	},
};

module.exports = { worldLocations };