const cooldowns = {
	duel: {
		type: Date,
		default: 0,
	},
	dailyPrize: {
		type: Date,
		default: 0,
	},
	dungeon: {
		type: Date,
		default: 0,
	},
	explore: {
		type: Date,
		default: 0,
	},
	fish: {
		type: Date,
		default: 0,
	},
	hunt: {
		type: Date,
		default: 0,
	},
	miniboss:{
		type:Date,
		default: 0,
	},
	race: {
		type: Date,
		default: 0,
	},
	raid: {
		type: Date,
		default: 0,
	},
	tower: {
		type: Date,
		default: 0,
	},
	weeklyPrize: {
		type: Date,
		default: 0,
	},
};

module.exports = { cooldowns };