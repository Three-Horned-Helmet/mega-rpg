module.exports = {
	peasant: {
		name: "peasant",
		cost: {
			gold: 6,
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
	knight: {
		name: "knight",
		cost: {
			gold: 55,
			["steel bar"]: 4,
		},
		requirement: {
			building: "barracks",
			level: 3,
		},
		stats: {
			health: 120,
			attack: 40,
		},
	},
	berserker: {
		name: "berserker",
		cost: {
			gold: 80,
			["mithril bar"]: 3,
		},
		requirement: {
			building: "barracks",
			level: 4,
		},
		stats: {
			health: 160,
			attack: 55,
		},
	},
	justicar: {
		name: "justicar",
		cost: {
			gold: 110,
			["pyrite bar"]: 2,
		},
		requirement: {
			building: "barracks",
			level: 5,
		},
		stats: {
			health: 200,
			attack: 70,
		},
	},
};