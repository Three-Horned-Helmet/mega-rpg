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
	["mithril bar"]: {
		name: "mithril bar",
		typeSequence: ["resources"],
		cost: {
			["mithril ore"]: 4,
		},
		requirement: {
			building: "forge",
			level: 3,
		},
	},
	["pyrite bar"]: {
		name: "pyrite bar",
		typeSequence: ["resources"],
		cost: {
			["burite ore"]: 10,
			["steel bar"]: 4,
			["mithril bar"]: 2,
		},
		requirement: {
			building: "forge",
			level: 4,
		},
	},
};