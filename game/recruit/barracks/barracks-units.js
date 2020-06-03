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
			hp: 10,
			at: 3,
		},
	},
	militia: {
		name: "militia",
		cost: {
			gold: 20,
			["bronze bar"]: 2,
		},
		requirement: {
			building: "barracks",
			level: 1,
		},
		stats: {
			hp: 50,
			at: 10,
		},
	},
	guardsman: {
		name: "guardsman",
		cost: {
			gold: 50,
			["iron bar"]: 4,
		},
		requirement: {
			building: "barracks",
			level: 2,
		},
		stats: {
			hp: 150,
			at: 20,
		},
	},
};