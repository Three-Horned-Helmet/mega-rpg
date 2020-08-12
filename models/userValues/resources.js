const resources = {
	gold: {
		type: Number,
		default: 100,
	},

	// WOOD
	["oak wood"]: {
		type: Number,
		default: 5,
	},
	["yew wood"]: {
		type: Number,
		default: 0,
	},
	["barlind wood"]: {
		type: Number,
		default: 0,
	},
	["aspen wood"]: {
		type: Number,
		default: 0,
	},

	// ORE
	["copper ore"]: {
		type: Number,
		default: 10,
	},
	["iron ore"]: {
		type: Number,
		default: 0,
	},
	["mithril ore"]: {
		type: Number,
		default: 0,
	},
	["burite ore"]: {
		type: Number,
		default: 0,
	},

	// BARS
	["bronze bar"]: {
		type: Number,
		default: 0,
	},
	["iron bar"]: {
		type: Number,
		default: 0,
	},
	["steel bar"]: {
		type: Number,
		default: 0,
	},
	["mithril bar"]: {
		type: Number,
		default: 0,
	},
	["pyrite bar"]: {
		type: Number,
		default: 0,
	},

	// MISC
	["obsidian ore"]: {
		type: Number,
		default: 0,
	},
};

module.exports = { resources };