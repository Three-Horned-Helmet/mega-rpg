module.exports = {
	peasant: {
		name: "peasant",
		cost: {
			gold: 5,
		},
		requirement: {
			building: "barracks",
			level: 0,
		},
		stats: {
			health: 10,
			attack: 5,
		},
	},
	militia: {
		name: "militia",
		cost: {
			gold: 15,
			["bronze bar"]: 2,
		},
		requirement: {
			building: "barracks",
			level: 1,
		},
		stats: {
			health: 35,
			attack: 16,
		},
	},
	guardsman: {
		name: "guardsman",
		cost: {
			gold: 35,
			["iron bar"]: 4,
		},
		requirement: {
			building: "barracks",
			level: 2,
		},
		stats: {
			health: 80,
			attack: 25,
		},
	},
};