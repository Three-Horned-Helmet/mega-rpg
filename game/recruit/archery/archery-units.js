module.exports = {
	huntsman: {
		name: "huntsman",
		cost: {
			gold: 5,
			["oak wood"]: 5,
		},
		requirement: {
			building: "archery",
			level: 0,
		},
		stats: {
			health: 22,
			attack: 10,
		},
	},
	archer: {
		name: "archer",
		cost: {
			gold: 30,
			["yew wood"]: 7,
		},
		requirement: {
			building: "archery",
			level: 1,
		},
		stats: {
			health: 45,
			attack: 35,
		},
	},
	ranger: {
		name: "ranger",
		cost: {
			gold: 50,
			["yew wood"]: 10,
			["oak wood"]: 10,
		},
		requirement: {
			building: "archery",
			level: 2,
		},
		stats: {
			health: 75,
			attack: 80,
		},
	},
};