const army = {
	armory: {
		helmet: {
			type: Object,
			default: {},
		},
		chest: {
			type: Object,
			default: {},
		},
		legging: {
			type: Object,
			default: {},
		},
		weapon: {
			type: Object,
			default: {},
		},
	},
	units: {
		archery: {
			huntsman: {
				type: Number,
				default: 0,
			},
			archer: {
				type: Number,
				default: 0,
			},
			ranger: {
				type: Number,
				default: 0,
			},
			survivalist: {
				type: Number,
				default: 0,
			},
			sharpshooter: {
				type: Number,
				default: 0,
			},
		},
		barracks: {
			peasant: {
				type: Number,
				default: 5,
			},
			militia: {
				type: Number,
				default: 0,
			},
			guardsman: {
				type: Number,
				default: 0,
			},
			knight: {
				type: Number,
				default: 0,
			},
			berserker: {
				type: Number,
				default: 0,
			},
			justicar: {
				type: Number,
				default: 0,
			},
		},
	},
};

module.exports = { army };