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
				difficulty: 5,
			},
			"Fishing village": {
				name: "Fishing village",
				type: "raid",
				difficulty: 3,
			},
			"Collapsed Mine": {
				name: "Collapsed Mine",
				type: "raid",
				difficulty: 2,
			},
			Forest: {
				name: "Forest",
				type: "hunt",
				difficulty: 1,
			},
			Cave: {
				name: "Cave",
				type: "hunt",
				difficulty: 2,
			},
			"Bandidos de la Grande": {
				name: "Bandidos de la Grande",
				type: "miniboss",
				difficulty: 18,
			},
			"Bandit's Castle": {
				name: "Bandit's Castle",
				type: "dungeon",
				difficulty: 30,
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