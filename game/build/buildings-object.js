// An object of all buildings. If you want to be able to build another structure,
// add it here and it will work

module.exports = {
	barracks: {
		name: "barracks",
		levels: [
			{
				cost: {
					gold: 15,
					 ["oak wood"]: 5,
				},
				level: 0,
			},
			{
				cost: {
					gold: 100,
					 ["oak wood"]: 20,
				},
				level: 1,
			},
			{
				cost: {
					gold: 200,
					["yew wood"]: 20,
				},
				level: 2,
			},
		],
	},
	archery: {
		name: "archery",
		levels: [
			{
				cost: {
					gold: 15,
					 ["oak wood"]: 10,
				},
				level: 0,
			},
			{
				cost: {
					gold: 100,
					["yew wood"]: 20,
					["bronze bar"]: 20,
					["iron bar"]: 20,
				},
				level: 1,
			},
			{
				cost: {
					gold: 200,
					["yew wood"]: 50,
					["bronze bar"]: 20,
					["iron bar"]: 20,
					["steel bar"]: 50,
				},
				level: 2,
			},
		],
	},
	farm: {
		name: "farm",
		levels: [
			{
				cost: {
					gold: 15,
					 ["oak wood"]: 5,
				},
				level: 0,
				popIncrease: 200,
			},
			{
				cost: {
					gold: 100,
					 ["oak wood"]: 20,
				},
				level: 1,
				popIncrease: 300,
			},
			{
				cost: {
					gold: 200,
					 ["oak wood"]: 30,
				},
				level: 2,
				popIncrease: 300,
			},
		],
		execute: async function(user) {
			// Increases the max population
			const farms = user.empire.filter(building => building.name === this.name)
				.sort((a, b) => b.level - a.level);
			let newPop = 0;
			newPop += this.levels[farms[0].level].popIncrease;
			newPop += farms.slice(1).reduce((acc, cur) => {
				return acc + this.levels[cur.level].popIncrease * 0.1;
			}, 0);

			user.updateHousePop(newPop);
		},
	},
	mine: {
		name: "mine",
		levels: [
			{
				cost: {
					gold: 50,
				},
				level: 0,
				produce: "copper ore",
				productionRate: 1,
			},
			{
				cost: {
					gold: 200,
					["bronze bar"]: 20,
				},
				level: 1,
				produce: "iron ore",
				productionRate: 2,
			},
		],
		execute: async function(user) {
			// Add the lastCollected and producing to new mine
			user.updateNewProduction("mine", "copper ore", new Date());
		},
	},
	lumbermill: {
		name: "lumbermill",
		levels: [
			{
				cost: {
					gold: 50,
					["copper ore"]: 10,
				},
				level: 0,
				produce: "oak wood",
				productionRate: 1,
			},
			{
				cost: {
					gold: 150,
					 ["oak wood"]: 30,
				},
				level: 1,
				produce: "yew wood",
				productionRate: 2,
			},
		],
		execute: async function(user) {
			// Add the lastCollected and producing to new mine
			user.updateNewProduction("lumbermill", "oak wood", new Date());
		},
	},
	forge: {
		name: "forge",
		levels: [
			{
				cost: {
					gold: 15,
					 ["oak wood"]: 5,
					["copper ore"]: 5,
				},
				level: 0,
				craftables: ["bronze bar"],
			},
			{
				cost: {
					gold: 100,
					["oak wood"]: 20,
					["bronze bar"]: 20,
				},
				level: 1,
				craftables: ["iron bar"],
			},
			{
				cost: {
					gold: 200,
					 ["oak wood"]: 50,
					["yew wood"]: 30,
					["bronze bar"]: 40,
					["iron bar"]: 40,
				},
				level: 2,
				craftables: ["steel bar"],
			},
		],
	},
	blacksmith: {
		name: "blacksmith",
		levels: [
			{
				cost: {
					gold: 30,
					 ["oak wood"]: 5,
					["bronze bar"]: 20,
				},
				level: 0,
				craftables: ["bronze sword", "oak shortbow",
					"bronze helmet", "bronze platemail", "bronze leggings"],
			},
			{
				cost: {
					gold: 100,
					["yew wood"]: 20,
					["iron bar"]: 40,
				},
				level: 1,
				craftables: ["iron sword", "yew shortbow",
					"iron helmet", "iron platemail", "iron leggings"],
			},
			{
				cost: {
					gold: 200,
					 ["oak wood"]: 50,
					["yew wood"]: 30,
					["bronze bar"]: 40,
					["iron bar"]: 40,
					["steel bar"]: 40,
				},
				level: 2,
				craftables: ["steel sword", "northern shortbow",
					"steel helmet", "steel platemail", "steel leggings"],
			},
		],
	},
	["armorer"]: {
		name: "armorer",
		levels: [
			{
				cost: {
					gold: 150,
					 ["oak wood"]: 50,
					["bronze bar"]: 30,
				},
				level: 0,
			},
			{
				cost: {
					gold: 500,
					["yew wood"]: 150,
					 ["oak wood"]: 150,
					["bronze bar"]: 50,
					["iron bar"]: 50,
					["steel bar"]: 30,
				},
				level: 1,
			},
		],
	},
	shop: {
		name: "shop",
		levels: [
			{
				cost: {
					gold: 30,
					["copper ore"]: 3,
				},
				level: 0,
			},
			{
				cost: {
					gold: 200,
					["yew wood"]: 20,
					["iron bar"]: 20,
				},
				level: 1,
			},
		],
	},
};