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
			health: 14,
			attack: 6,
		},
	},
	archer: {
		name: "archer",
		cost: {
			gold: 22,
			["yew wood"]: 7,
		},
		requirement: {
			building: "archery",
			level: 1,
		},
		stats: {
			health: 27,
			attack: 30,
		},
	},
	ranger: {
		name: "ranger",
		cost: {
			gold: 45,
			["yew wood"]: 10,
			["oak wood"]: 10,
		},
		requirement: {
			building: "archery",
			level: 2,
		},
		stats: {
			health: 70,
			attack: 75,
		},
	},
};