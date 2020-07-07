const dailyPrizes = {
	0: {
		gold: 50,
	},
	1: {
		gold: 100,
		["oak wood"]: 15,
	},
	2: {
		gold: 200,
		["oak wood"]: 25,
	},
	3: {
		gold: 280,
		["oak wood"]: 20,
		["copper ore"]: 20,
	},
	4: {
		gold: 350,
		["oak wood"]: 25,
		["copper ore"]: 25,
		["yew wood"]: 10,
	},
};

const getDailyPrize = (day)=>{
	return dailyPrizes[day];
};

module.exports = { getDailyPrize };