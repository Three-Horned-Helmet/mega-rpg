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
			{
				cost: {
					gold: 3600,
					["oak wood"]: 480,
					["yew wood"]: 300,
					["barlind wood"]: 300,
				},
				level: 3,
			},
			{
				cost: {
					gold: 6700,
					["aspen wood"]: 800,
					["barlind wood"]: 300,
					["mithril bar"]: 400,
					["obsidian ore"]: 100,
				},
				level: 4,
			},
			{
				cost: {
					gold: 12700,
					["aspen wood"]: 1450,
					["yew wood"]: 3200,
					["mithril bar"]: 490,
					["pyrite bar"]: 700,
				},
				level: 5,
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
			{
				cost: {
					gold: 7800,
					["barlind wood"]: 2500,
					["aspen wood"]: 1300,
					["iron bar"]: 190,
					["mithril bar"]: 650,
					["burite ore"]: 400,
					["obsidian ore"]: 160,
				},
				level: 3,
			},
			{
				cost: {
					gold: 15800,
					["yew wood"]: 9500,
					["aspen wood"]: 5300,
					["pyrite bar"]: 400,
				},
				level: 4,
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
			{
				cost: {
					gold: 4800,
					["oak wood"]: 1500,
					["aspen wood"]: 690,
					["mithril bar"]: 240,
				},
				level: 3,
				popIncrease: 200,
			},
			{
				cost: {
					gold: 9800,
					["aspen wood"]: 6900,
					["mithril bar"]: 580,
					["pyrite bar"]: 380,
				},
				level: 3,
				popIncrease: 260,
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
			const updatedUser = await user.save();
			return updatedUser;
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
					gold: 1940,
					["bronze bar"]: 220,
					["iron bar"]: 260,
					["steel bar"]: 200
				},
				level: 2,
				produce: "mithril ore",
				productionRate: 3,
			},
			{
				cost: {
					gold: 8800,
					["mithril bar"]: 510,
				},
				level: 3,
				produce: "burite ore",
				productionRate: 4,
			},
			{
				cost: {
					gold: 99999999999,
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
					gold: 390,
					["oak wood"]: 160,
					["copper ore"]: 95,
				},
				level: 1,
				produce: "yew wood",
				productionRate: 2,
			},
			{
				cost: {
					gold: 2800,
					["oak wood"]: 250,
					["yew wood"]: 250,
				},
				level: 2,
				produce: "barlind wood",
				productionRate: 3,
			},
			{
				cost: {
					gold: 7800,
					["oak wood"]: 750,
					["barlind wood"]: 750,
				},
				level: 3,
				produce: "aspen wood",
				productionRate: 4,
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
			{
				cost: {
					gold: 5650,
					["barlind wood"]: 575,
					["mithril ore"]: 520,
					["steel bar"]: 490,
				},
				level: 3,
				craftables: ["mithril bar"],
			},
			{
				cost: {
					gold: 11650,
					["aspen wood"]: 700,
					["obsidian ore"]: 190,
					["mithril bar"]: 490,
				},
				level: 4,
				craftables: ["pyrite bar"],
			},
		],
	},
	blacksmith: {
		name: "blacksmith",
		levels: [
			{
				cost: {
					gold: 30,
					["oak wood"]: 10,
					["bronze bar"]: 10,
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
			{
				cost: {
					gold: 12000,
					["yew wood"]: 2400,
					["aspen wood"]: 2100,
					["iron bar"]: 900,
					["steel bar"]: 1800,
					["mithril bar"]: 600,
				},
				level: 3,
				craftables: ["mithril sword", "aspen longbow",
					"mithril helmet", "mithril platemail", "mithril leggings"],
			},
			{
				cost: {
					gold: 12000,
					["yew wood"]: 2400,
					["aspen wood"]: 2100,
					["iron bar"]: 900,
					["steel bar"]: 1800,
					["mithril bar"]: 700,
					["obsidian ore"]: 90,
				},
				level: 3,
				craftables: ["mithril sword", "aspen longbow",
					"mithril helmet", "mithril platemail", "mithril leggings"],
			},
			{
				cost: {
					gold: 23000,
					["oak wood"]: 5400,
					["aspen wood"]: 4100,
					["steel bar"]: 4500,
					["mithril bar"]: 1200,
					["pyrite bar"]: 800,
				},
				level: 4,
				craftables: ["pyrite sword", "ancient longbow",
					"pyrite helmet", "pyrite platemail", "pyrite leggings"],
			},
		],
	},
	armorer: {
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
	senate: {
		name: "senate",
		unique: true,
		levels: [
			{
				cost: {
					gold: 300,
					["iron bar"]: 60,
					["oak wood"]: 60,
					["yew wood"]: 60,
				},
				level: 0,
			},
			{
				cost: {
					gold: 2900,
					["steel bar"]: 650,
					["oak wood"]: 650,
					["yew wood"]: 650,
				},
				level: 1,
			},
			{
				cost: {
					gold: 9300,
					["oak wood"]: 1000,
					["yew wood"]: 1000,
					["barlind wood"]: 1000,
					["steel bar"]: 700,
					["mithril bar"]: 500,
				},
				level: 2,
			},
			{
				cost: {
					gold: 21000,
					["yew wood"]: 3500,
					["barlind wood"]: 3500,
					["aspen wood"]: 3500,
					["mithril bar"]: 2000,
					["pyrite bar"]: 1600,
					["obsidian ore"]: 350,
				},
				level: 3,
			},
			{
				cost: {
					gold: 50000,
					["yew wood"]: 5000,
					["barlind wood"]: 5000,
					["aspen wood"]: 5000,
					["mithril bar"]: 4000,
					["pyrite bar"]: 3200,
					["obsidian ore"]: 700,
				},
				level: 4,
			},
			{
				cost: {
					gold: 75000,
					["yew wood"]: 10000,
					["barlind wood"]: 10000,
					["aspen wood"]: 10000,
					["mithril bar"]: 6000,
					["pyrite bar"]: 4000,
					["obsidian ore"]: 1500,
				},
				level: 5,
			},
			{
				cost: {
					gold: 100000,
					["yew wood"]: 25000,
					["barlind wood"]: 25000,
					["aspen wood"]: 25000,
					["mithril bar"]: 15000,
					["pyrite bar"]: 10000,
					["obsidian ore"]: 5000,
				},
				level: 6,
			},
		],
		execute: function(user) {
			// Add the lastCollected and producing to new mine
			return user.updateMaxBuildings();
		},
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
			{
				cost: {
					gold: 800,
					["yew wood"]: 280,
					["iron bar"]: 280,
				},
				level: 2,
			},
			{
				cost: {
					gold: 1500,
					["yew wood"]: 350,
					["iron bar"]: 350,
				},
				level: 3,
			},
			{
				cost: {
					gold: 2100,
					["yew wood"]: 440,
					["iron bar"]: 440,
				},
				level: 4,
			},
			{
				cost: {
					gold: 2600,
					["yew wood"]: 550,
					["iron bar"]: 550,
				},
				level: 5,
			},
			{
				cost: {
					gold: 3400,
					["yew wood"]: 690,
					["iron bar"]: 690,
				},
				level: 6,
			},
			{
				cost: {
					gold: 4500,
					["yew wood"]: 750,
					["iron bar"]: 750,
				},
				level: 7,
			},
		],
	},
	["tax office"]: {
		name: "tax office",
		levels: [
			{
				cost: {
					gold: 50,
					["copper ore"]: 3,
				},
				level: 0,

			},
			{
				cost: {
					gold: 1000,
					["yew wood"]: 180,
					["iron bar"]: 180,
				},
				level: 1,
			},
			{
				cost: {
					gold: 10000,
					["yew wood"]: 280,
					["iron bar"]: 280,
				},
				level: 2,
			},
			{
				cost: {
					gold: 100000,
					["yew wood"]: 350,
					["iron bar"]: 350,
				},
				level: 3,
			},
			{
				cost: {
					gold: 1000000,
					["yew wood"]: 440,
					["iron bar"]: 440,
				},
				level: 4,
			},
			{
				cost: {
					gold: 10000000,
					["yew wood"]: 550,
					["iron bar"]: 550,
				},
				level: 5,
			},
			{
				cost: {
					gold: 100000000,
					["yew wood"]: 690,
					["iron bar"]: 690,
				},
				level: 6,
			},
			{
				cost: {
					gold: 1000000000,
					["yew wood"]: 750,
					["iron bar"]: 750,
				},
				level: 7,
			},
		],
		execute: async (user) => {
			return await user.setLastCollected("tax office", new Date(new Date() - 1000 * 60 * 5));
		},
	},
};