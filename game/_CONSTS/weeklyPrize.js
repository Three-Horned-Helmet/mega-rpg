const weeklyPrizes = {
	0: {
		gold: 200,
	},
	1: {
		gold: 1000,
		["oak wood"]: 100,
		["copper ore"]: 100,
	},
	2: {
		gold: 2500,
		["oak wood"]: 150,
		["copper ore"]: 150,
		["yew wood"]: 150,
	},
	3: {
		gold: 4000,
		["oak wood"]: 200,
		["copper ore"]: 200,
		["iron ore"]: 150,
		["yew wood"]: 150,
	},
	4: {
		gold: 5000,
		["oak wood"]: 250,
		["copper ore"]: 250,
		["iron ore"]: 200,
		["yew wood"]: 200,
	},
};

const getWeeklyPrize = (week) => {
	return weeklyPrizes[week];
};

module.exports = { getWeeklyPrize };