// An object of all buildings. If you want to be able to build another structure,
// add it here and it will work

module.exports = {
	barracks: {
		name: "barracks",
		levels: [
			{
				cost: {
					gold: 30,
					["oak wood"]: 10,
				},
				level: 0,
			},
			{
				cost: {
					gold: 450,
					["oak wood"]: 150,
					["yew wood"]: 150,
				},
				level: 1,
			},
			{
				cost: {
					gold: 1600,
					["oak wood"]: 480,
					["yew wood"]: 300,
					["barlind wood"]: 300,
					["obsidian ore"]: 50,
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
					gold: 80,
					["oak wood"]: 20,
				},
				level: 0,
			},
			{
				cost: {
					gold: 500,
					["yew wood"]: 160,
					["bronze bar"]: 120,
					["iron bar"]: 90,
				},
				level: 1,
			},
			{
				cost: {
					gold: 1800,
					["yew wood"]: 500,
					["barlind wood"]: 250,
					["bronze bar"]: 250,
					["iron bar"]: 190,
					["steel bar"]: 100,
					["obsidian ore"]: 30,
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
					gold: 90,
					["oak wood"]: 35,
				},
				level: 0,
				popIncrease: 30,
			},
			{
				cost: {
					gold: 500,
					["oak wood"]: 210,
					["yew wood"]: 145,
				},
				level: 1,
				popIncrease: 90,
			},
			{
				cost: {
					gold: 1600,
					["oak wood"]: 450,
					["yew wood"]: 390,
					["barlind wood"]: 210,
				},
				level: 2,
				popIncrease: 150,
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

			return await user.updateHousePop(newPop);
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
					gold: 340,
					["bronze bar"]: 120,
				},
				level: 1,
				produce: "iron ore",
				productionRate: 2,
			},
			{
				cost: {
					gold: 540,
					["bronze bar"]: 100,
				},
				level: 999,
				produce: "obsidian ore",
				productionRate: 0,
			},
		],
		execute: async function(user) {
			// Add the lastCollected and producing to new mine
			return await user.updateNewProduction("mine", new Date(new Date() - 1000 * 60 * 5), "copper ore");
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
					gold: 290,
					["oak wood"]: 160,
					["copper ore"]: 95,
				},
				level: 1,
				produce: "yew wood",
				productionRate: 2,
			},
			{
				cost: {
					gold: 1800,
					["oak wood"]: 250,
					["yew wood"]: 250,
				},
				level: 2,
				produce: "barlind wood",
				productionRate: 3,
			},
		],
		execute: async function(user) {
			// Add the lastCollected and producing to new mine
			return await user.updateNewProduction("lumbermill", new Date(new Date() - 1000 * 60 * 5), "oak wood");
		},
	},
	forge: {
		name: "forge",
		levels: [
			{
				cost: {
					gold: 25,
					["oak wood"]: 10,
					["copper ore"]: 10,
				},
				level: 0,
				craftables: ["bronze bar"],
			},
			{
				cost: {
					gold: 440,
					["oak wood"]: 150,
					["bronze bar"]: 85,
				},
				level: 1,
				craftables: ["iron bar"],
			},
			{
				cost: {
					gold: 1650,
					["oak wood"]: 190,
					["yew wood"]: 175,
					["bronze bar"]: 120,
					["iron bar"]: 90,
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
					gold: 650,
					["yew wood"]: 190,
					["iron bar"]: 160,
				},
				level: 1,
				craftables: ["iron sword", "yew shortbow",
					"iron helmet", "iron platemail", "iron leggings"],
			},
			{
				cost: {
					gold: 2100,
					["oak wood"]: 350,
					["yew wood"]: 290,
					["barlind wood"]: 290,
					["bronze bar"]: 145,
					["iron bar"]: 145,
					["steel bar"]: 180,
					["obsidian ore"]: 70,
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
					gold: 2900,
					["oak wood"]: 450,
					["yew wood"]: 350,
					["barlind wood"]: 240,
					["bronze bar"]: 350,
					["iron bar"]: 290,
					["steel bar"]: 200,
					["obsidian ore"]: 100,
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
					gold: 330,
					["yew wood"]: 180,
					["iron bar"]: 180,
				},
				level: 1,
			},
		],
	},
};