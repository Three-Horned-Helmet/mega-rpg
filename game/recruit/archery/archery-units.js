module.exports = {
	huntsman: {
		name: "huntsman",
		cost: {
			gold: 10,
			oak: 5,
		},
		requirement: {
			building: "archery",
			level: 0,
		},
		stats: {
			hp: 13,
			at: 9,
		},
	},
	archer: {
		name: "archer",
		cost: {
			gold: 30,
			yew: 7,
		},
		requirement: {
			building: "archery",
			level: 1,
		},
		stats: {
			hp: 30,
			at: 25,
		},
	},
	ranger: {
		name: "ranger",
		cost: {
			gold: 50,
			yew: 10,
			oak: 10,
		},
		requirement: {
			building: "archery",
			level: 2,
		},
		stats: {
			hp: 75,
			at: 80,
		},
	},
};