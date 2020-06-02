// An object of all buildings. If you want to be able to build another structure,
// add it here and it will work

module.exports = {
	barracks:{
		name: "barracks",
		levels: [
			{
				cost: {
					gold: 15,
					oak: 5,
				},
				level: 0,
			},
			{
				cost: {
					gold: 100,
					oak: 20,
				},
				level: 1,
			},
			{
				cost: {
					gold: 200,
					yew: 20,
				},
				level: 2,
			},
		],
	},
	farm:{
		name: "farm",
		levels: [
			{
				cost: {
					gold: 15,
					oak: 5,
				},
				level: 0,
				popIncrease: 200,
			},
			{
				cost: {
					gold: 100,
					oak: 20,
				},
				level: 1,
				popIncrease: 300,
			},
			{
				cost: {
					gold: 200,
					oak: 30,
				},
				level: 2,
				popIncrease: 300,
			},
		],
		execute: async function(user) {
			// Increases the max population
			const farms = user.empire.filter(building => building.name === this.name).sort((a, b) => b.level - a.level);
			let newPop = 0;
			newPop += this.levels[farms[0].level].popIncrease;
			newPop += farms.slice(1).reduce((acc, cur) => {
				return acc + this.levels[cur.level].popIncrease * 0.1;
			}, 0);

			user.updateHousePop(newPop);
		},
	},
	mine:{
		name: "mine",
		levels: [
			{
				cost: {
					gold: 50,
				},
				level: 0,
				oreAvailable: "copper",
				productionRate: 5,
			},
			{
				cost: {
					gold: 200,
					["bronze bar"]: 20,
				},
				level: 1,
				oreAvailable: "iron",
				productionRate: 10,
			},
		],
		execute: async function(user) {
			// Add the lastCollected and producing to new mine
			user.updateNewMine(new Date());
		},
	},
};