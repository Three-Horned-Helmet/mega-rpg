const { questHelper } = require("../quest-helper");
const allUnits = require("../../recruit/all-units");
const allItems = require("../../items/all-items");

module.exports = {
	buildMine: {
		name: "Build a Mine",
		description: "Welcome to Mega-RPG %username%, where only the sky's the limit!\n\nYour first objective is to __build a Mine__ and __collect 5 copper ore__. \n\nYou can build a Mine with the command `!build mine` and it will passively collect ores depending on the level of the Mine. A level 0 Mine will collect 1 copper ore per minute, and can be collected with the command `!collect`. Mines are crucial for rapid expansion and in production of an unbeatable army! \nType `!quest` when you're finshed",
		objective: "Build: Mine level 0\nCollect: 5 Copper Ore.\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Gold: 30\nCopper Ore: 5",
		winDescription: "A Mine will help you build new structures in your empire! To see the different available buildings type the command `!build`. If you are not pleased with one of your buildings you can remove it with the command `!destroy <building_name>`.\n\n**A new quest is available**. To check it out, type `!quest`",
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
			user.gainManyResources({
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

			await user.save();

			return true;
		},
	},
	buildLumbermill: {
		name: "Build a Lumbermill",
		description: "You have now set up a production of copper ore, however some buildings, units and items require wood as well to be made. Your next goal is to __build a Lumbermill__ and collect __5 Oak wood__. \n\nYou can build a lumbermill with the command `!build lumbermill` and it will passively collect wood depending on the level of the lumbermill. A level 0 lumbermill will collect 1 oak wood per minute, and can be collected with the command `!collect`. Lumbermill are crucial in obtaining certain buildings, items or units!",
		objective: "Build: Lumbermill level 0\nCollect: 5 Oak Wood\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Gold: 35\nOak Wood: 10",
		winDescription: "With the Lumbermill set up you are now able to start expanding your kingdom! To see all buildings in your kingdom use the command `!grid`.\n\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "buildLumbermill"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have a lumbermill
			if(!user.empire.find(b => b.name === "lumbermill")) return false;

			// Does the user have the required copper ore
			if(!(user.resources["oak wood"] >= 5)) return false;

			// Get reward
			user.gainManyResources({
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

			await user.save();

			return true;
		},
	},
	exploreSurroundings: {
		name: "Explore your Surroundings",
		description: "You have now successfully started production of ores and lumber in your empire and it is time to explore your empire's surroundings. Try and find some nearby sources of income. \n\nYou can explore with the command `!explore` and you will have a chance of finding different areas that you can interact with around your empire.",
		objective: "Explore 'River'\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Gold: 25\nCopper Ore: 5",
		winDescription: "With the 'River' explored you can go fishing in it with the command `!fish`. This is an excellent source of gold! There are several available areas that you can explore and interact with, so keep exploring and see what you find! To see all your explored areas use the command `!look`.\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "exploreSurroundings"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Has the user explored River
			if(!user.world.locations["Grassy Plains"].explored.find(area => area === "River")) return false;

			// Get reward
			user.gainManyResources({
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

			await user.save();

			return true;
		},
	},
	buildShop: {
		name: "Build a shop",
		description: "Your hero will lose hp when fighting, and thus needs to get healed back up. To do this you can buy healing potions from a shop. Your goal is to build a shop and buy a small healing potion\n\nYou can build a shop with the command `!build shop`, buy a small healing potion with the command `!buy small healing potion`.",
		objective: "Build a shop level 0.\nBuy a Small Healing Potion.\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Gold: 20\nBronze Sword: 1",
		winDescription: "A higher leveled shop will contain several items. To see all the different items in the shop use the command `!buy`. Your newly bought Healing potion can be used with the command `!use small healing potions` if your hero has taken damage. You can also use shortcuts to save time like `!buy shp`. See available shortcuts with the command `!buy shortcuts`. Make sure to not let your hero die as it will lose experience and possibly ranks.\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "buildShop"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = await questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have a lumbermill
			if(!user.empire.find(b => b.name === "shop")) return false;

			// Get reward
			user.gainManyResources({
				gold: 20,
			});

			await user.addItem(allItems["bronze sword"], 1);

			// Add next quest
			const newQuest = {
				name: "Preparing Your Hero",
				started: false,
				questKeySequence: ["gettingStarted", "preparingYourHero"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	preparingYourHero: {
		name: "Preparing Your Hero",
		description: "The newly acquired weapon can be equipped by your hero to increase its combat potency. Equip the Bronze Sword on your hero with the command `!equip bronze sword`.",
		objective: "Equip a Bronze Sword on your hero.\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Bronze Platemail: 1.",
		winDescription: "Your hero is an experienced fighter and wield weaponry more efficient and with higher combat capabilities compared to your army. You can see your hero's stats with the command `!profile` or `!army`.\n**A new quest is available**",
		questKeySequence: ["gettingStarted", "buildShop"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = await questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have a lumbermill
			if(!user.empire.find(b => b.name === "shop")) return false;

			// Get reward
			await user.addItem(allItems["bronze platemail"], 1);

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
		objective: "Craft 3 Bronze Swords\nGet an army of 10 Peasants (use `!army` to see your peasant and equipment).",
		reward: "Peasant: 5\nBronze Helmet: 5\nBronze Leggings: 5",
		winDescription: "The weaponry is automatically worn by your army so you dont have to worry about that, just make sure you have enough equipment for all your units to improve their fighting capabilities. Don't forget to also build some farms to increase your max population allowing more units to be recruited. With an army well prepared you can `!explore` until you find an encampment to `!raid` and gain valuable resources and experience! \n\nHint: To see all available crafts type `!craft` and to see all available recruits type `!recruit`.\n**A new quest is available**",
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
			user.addItem(allItems["bronze helmet"], 5);
			user.addItem(allItems["bronze leggings"], 5);
			// // Add next quest
			const newQuest = {
				name: "Upgrade Mine",
				started: false,
				questKeySequence: ["gettingStarted", "upgradeMine"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	upgradeMine: {
		name: "Upgrade Mine",
		description: "Now that your empire is starting to take form, you can go ahead and aim towards upgrading your buildings. To upgrade a building you can type the command `!build <buildingName> -u`. Upgrade your Mine to increase your ore production and to access new resources.",
		objective: "Upgrade your Mine to level 1. It can be achieved with the command `!build mine -u`",
		reward: "Gold: 90\nIron ore: 20",
		winDescription: "With the newly built Mine you can now start producing Iron Ore. You can do this with the command `!produce iron`. To see all your available productions you can use the command `!produce`.",
		questKeySequence: ["gettingStarted", "upgradeMine"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have the enough bronze swords
			if(!user.empire.find(b => b.name === "mine" && b.level === 1)) return false;

			// Get reward
			user.gainManyResources({
				gold: 90,
				"iron ore": 20
			});

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