module.exports = {
	["bronze bar"]: {
		name: "bronze bar",
		typeSequence: ["resources"],
		cost: {
			["copper ore"]: 2,
		},
		requirement: {
			building: "forge",
			level: 0,
		},
	},
	["iron bar"]: {
		name: "iron bar",
		typeSequence: ["resources"],
		cost: {
			["iron ore"]: 2,
		},
		requirement: {
			building: "forge",
			level: 1,
		},
	},
	["steel bar"]: {
		name: "steel bar",
		typeSequence: ["resources"],
		cost: {
			["copper ore"]: 2,
			["iron ore"]: 2,
		},
		requirement: {
			building: "forge",
			level: 2,
		},
	},
};