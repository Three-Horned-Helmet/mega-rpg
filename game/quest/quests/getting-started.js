const { questHelper } = require("../quest-helper");
const allUnits = require("../../recruit/all-units");
const allItems = require("../../items/all-items");

module.exports = {
	buildMine: {
		name: "Build a Mine",
		description: "Welcome to Mega-RPG %username%, where your goal is to create the largest empire and conquer the world! Now let's get you started!\n\n Your first objective is to __build a Mine__ and __collect 5 copper ore__. \n\nYou can build a Mine with the command `!build mine` and it will passively collect ores depending on the level of the Mine. A level 0 Mine will collect 1 copper ore per minute, and can be collected with the command `!collect`. Mines are crucial for rapid expansion and in production of an unbeatable army!",
		objective: "Build: Mine level 0\nCollect: 5 Copper Ore.\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Gold: 30\nCopper Ore: 5",
		winDescription: "A Mine will help you build new structures in your empire! To see the different available buildings type the command `!build`.\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "buildMine"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have a mine
			if(!user.empire.find(b => b.name === "mine")) return false;

			// Does the user have the required copper ore
			if(!(user.resources["copper ore"] >= 5)) return false;

			// Get reward
			await user.gainManyResources({
				gold: 30,
				["copper ore"]: 5,
			});

			// Add next quest
			const newQuest = {
				name: "Build a Lumbermill",
				started: false,
				questKeySequence: ["gettingStarted", "buildLumbermill"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			user.save();

			return true;
		},
	},
	buildLumbermill: {
		name: "Build a Lumbermill",
		description: "You have now set up a production of copper ore, however some buildings, units and items require wood as well to be made. Your next goal is to __build a Lumbermill__ and collect 7 oak wood__. \n\nYou can build a lumbermill with the command `!build lumbermill` and it will passively collect wood depending on the level of the lumbermill. A level 0 lumbermill will collect 1 oak wood per minute, and can be collected with the command `!collect`. Lumbermill are crucial in obtaining certain buildings, items or units!",
		objective: "Build: Lumbermill level 0\nCollect: 7 Oak Wood\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Gold: 35\nOak Wood: 10",
		winDescription: "With the Lumbermill set up you are now able to start expanding your kingdom! You can __upgrade__ buildings using the command prefix `-u`: `!build <buildingName> -u`. e.g. `!build lumbermill -u`. A higher leveled production building will be able to produce different resources. You can see display all available production and change it with the command `!produce`.\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "buildLumbermill"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have a lumbermill
			if(!user.empire.find(b => b.name === "lumbermill")) return false;

			// Does the user have the required copper ore
			if(!(user.resources["oak wood"] >= 7)) return false;

			// Get reward
			await user.gainManyResources({
				gold: 35,
				["oak wood"]: 10,
			});

			// Add next quest
			const newQuest = {
				name: "Explore your Surroundings",
				started: false,
				questKeySequence: ["gettingStarted", "exploreSurroundings"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			user.save();

			return true;
		},
	},
	exploreSurroundings: {
		name: "Explore your Surroundings",
		description: "You have now successfully started production of ores and lumber in your empire and it is time to explore your empire's surroundings. Try and find some nearby sources of income. \n\nYou can explore with the command `!explore` and you will have a chance of finding different areas that you can interact with around your empire.",
		objective: "Explore 'River'",
		reward: "Gold: 25\nCopper Ore: 5\nEnter the command `!quest %questIndex%` when you are finished.",
		winDescription: "With the 'River' explored you can go fishing in it with the command `!fish`. This is an excellent source of gold! There are several available areas that you can explore and interact with, so keep exploring and see what you find!\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "exploreSurroundings"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Has the user explored River
			if(!user.world.locations["Grassy Plains"].explored.find(area => area === "River")) return false;

			// Get reward
			await user.gainManyResources({
				gold: 25,
				["copper ore"]: 5,
			});

			// Add next quest
			const newQuest = {
				name: "Build a shop",
				started: false,
				questKeySequence: ["gettingStarted", "buildShop"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			user.save();

			return true;
		},
	},
	buildShop: {
		name: "Build a shop",
		description: "Your hero will lose hp when fighting, and thus needs to get healed back up. To do this you can buy healing potions from a shop. Your goal is to build a shop and buy a small healing potion\n\nYou can build a shop with the command `!build shop`, buy a small healing potion with the command `!buy small healing potion` and use it with the command `!use small healing potion`.",
		objective: "Build a shop level 0\nBuy a small healing potion",
		reward: "Gold: 20\nEnter the command `!quest %questIndex%` when you are finished.",
		winDescription: "You can also use shortcuts to save time like `!buy shp`. See available shortcuts with the command `!buy shortcuts`. Make sure to not let your hero die as it will lose experience and possibly ranks.\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "buildShop"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = await questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have a lumbermill
			if(!user.empire.find(b => b.name === "shop")) return false;

			// Get reward
			await user.gainManyResources({
				gold: 20,
			});

			// Add next quest
			const newQuest = {
				name: "Recruit an Army",
				started: false,
				questKeySequence: ["gettingStarted", "recruitArmy"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	recruitArmy: {
		name: "Recruit an Army",
		description: "With the exploration of the nearby areas you will find animals to hunt, hostile encampments, minibosses, dungeons or even new quests areas! To prepare you for the enemies around your empire you will have to recruit an army to deal with these dangers. Your objective is to build a Forge, Blacksmith and Barracks to produce an army that can raid nearby encampments. \n\nYou can build Forge, Blacksmith and Barracks with `!build forge`, `!build blacksmith` and `!build barracks`, respectively. A Forge enables you to can craft bronze bars `!craft bronze bar 1`, Blacksmith can use the bronze bars to craft weaponry `!craft bronze sword 1` and a Barracks can be used to produce soldiers that can use the crafted equipment `!recruit peasant 1`",
		objective: "Craft 3 Bronze Swords\nGet an army of 10 Peasants",
		reward: "Peasant: 5\nBronze Helmet: 5\nBronze Leggings: 5",
		winDescription: "The weaponry is automatically worn by your army so you dont have to worry about that, just make sure you have enough equipment for all your units to improve their fighting capabilities. You can equip an item on the Hero with the command `!equip bronze sword`. Equiping an item on a Hero makes the item more powerful as your Hero is a more experienced fighter than your army. Don't forget to also build some farms to increase your max population allowing more units to be recruited. With an army well prepared you can `!explore` until you find an encampment to `!raid` and gain valuable resources and experience!",
		questKeySequence: ["gettingStarted", "recruitArmy"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have the enough bronze swords
			if(!(user.army.armory.weapon["bronze sword"] >= 3)) return false;

			// Does the user have the enough peasants
			if(!(user.army.units.barracks.peasant >= 10)) return false;

			// Get reward
			user.addOrRemoveUnits(allUnits["peasant"], 5, true);
			await user.save();
			await user.addItem(allItems["bronze helmet"], 5);
			await user.addItem(allItems["bronze leggings"], 5);
			// // Add next quest
			// const newQuest = {
			//     name: "Build a Lumbermill",
			//     started: false,
			//     questKeySequence: ["gettingStarted", "buildLumbermill"],
			// };

			// await user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};