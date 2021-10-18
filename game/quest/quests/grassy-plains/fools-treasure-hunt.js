const { questHelper } = require("../../quest-helper");

module.exports = {
	// A FOOLS TREASURE HUNT

	lostMap: {
		name: "A Lost Map",
		obtaining: {
			area: "Bandit Camp",
			chance: 1,
		},
		pve: [{
			name: "Bandit Camp",
			completed: false,
			chance: 0.4,
		}],
		found: "You found the second half of the Treasure Map",
		notFound: "You look around for the second half of the Treasure Map, but found nothing",
		intro: "You searched the encampment and found a **Torn Piece of Paper** with some scriblings on it.",
		description: "After a closer inspection of the paper you notice that it is a worn out piece of a map with directions written on it. Only some of the directions are present as big parts of the map has been torn off. On top of the map it is written *'...mains of the Creat...'* in big red letters, however the rest of the text is unfortuneatly missing.\n\nIt seems like you need the second part of the Map to be able to find what the map directs to.",
		objective: "Raid **Bandit Camp** until you find the missing pieces of the Treasure Map",
		reward: "Treasure Map: 1",
		winDescription: "You successfully patch the pieces together, creating a damaged treasure map.\n\nThe text is still incomplete but shows *'...mains of the Creat...'* and *'...easure no one finds...'*.\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "lostMap"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Add next quest
			const newQuest = {
				name: "The Lost Hut",
				started: false,
				questKeySequence: ["Grassy Plains", "lostHut"],
				pve: [{
					name: "Forest",
					completed: false,
					chance: 0.30,
				}],
			};
			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	lostHut: {
		name: "The Lost Hut",
		pve: [{
			name: "Forest",
			completed: false,
			chance: 0.35,
		}],
		found: "You found an old hut in the middle of the darkest part of the Forest",
		notFound: "You search around but find no signs of the building",
		description: "The Treasure Map is in very rough shape making it diffcult to read the faded directions. After careful investigation, you figure out it leads to some sort of building deep inside of the **Forest**, however its exact location is not possible to understand.",
		objective: "Search the **Forest** for the building drawn on the map",
		reward: "Oak wood: 40\nYew wood: 40",
		winDescription: "The old hut is in terrible shape, and it is obvious that no one has been taking care of the surrounding overgrowth for years. As you make your way towards the hut you hear noises inside of it. Not human voices, but small screeches and rattle noises. You sneak up to a small dusty window and peak through it.\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "lostMap"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({
				["oak wood"]: 40,
				["yew wood"]: 40,
			});

			// Add next quest
			const newQuest = {
				name: "A Pack of Implings",
				started: false,
				questKeySequence: ["Grassy Plains", "packOfImplings"],
				pve: [{
					name: "Pack of Implings",
					completed: false,
					chance: 1,
					unique: true,
				}],
			};
			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	packOfImplings: {
		name: "A Pack of Implings",
		pve: [{
			name: "Pack of Implings",
			completed: false,
			chance: 1,
			unique: true,
		}],
		found: "You enter the main room in the hut",
		description: "The hut is filled with several implings, small vile creatures made by the devil himself! The treasure must be inside of the hut, but there is no way to sneak in unnoticed... \n\nThere is only one solution to get to the treasure!",
		objective: "Defeat the Pack of Implings! (`!hunt pack of implings`)",
		reward: "Gold: 250",
		winDescription: "The dead Implings are soaked in blood and spread across the floor. Exhausted from the battle you start looking around the old hut for signs of the treasure. \n\nThere are scratches along the walls, shattered vials on the shelves and blood stained on the floor. Somehow everything seems burnt... It must've been the implings. Surprisingly, the house has not been burned down.\n\nAs you strafe across the floor you stumble on a piece of wood sticking up from the floor. You lift it up and notice someone has been digging in the dirt underneath.\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "packOfImplings"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "Pack of Implings" }]);
			if(!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({
				gold: 250,
			});

			// Add next quest
			const newQuest = {
				name: "Digging for Treasure",
				started: false,
				questKeySequence: ["Grassy Plains", "diggingForTreasure"],
			};
			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	diggingForTreasure: {
		name: "Digging for Treasure",
		description: "The floor is full of mud, ash and stones making digging quite the challenge. You need to craft proper equipment to get anywhere in this rough earth.",
		objective: "Gather 50 iron bars and 40 yew wood to craft digging equipment",
		reward: "Gold: 320",
		winDescription: "With the proper equipment you start digging into the earth. \n\nAs you get deeper, you come across an increasingly amount of what seems to be small bones covered in thick layers of ash. \n\nA lot of sweat later a glimmer of shiny metal emerge from the ashes. You pick up a round, solid Gold Medallion. With a quick stroke, you remove the dirt surrounding it to find some letters engraved into the shiny object. It is a beautiful piece and may be worth some nice gold on the market, but you decide to keep it. \n\nAfter several hours of digging you find nothing but bones and ash. \n\nWith a *sigh* you leave the old hut with nothing but a shiny Golden Medallion engraved with the letters **C.M.**",
		questKeySequence: ["Grassy Plains", "diggingForTreasure"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does the user have sufficient resources?
			if(!(user.resources["yew wood"] >= 30)) return false;
			if(!(user.resources["iron bar"] >= 50)) return false;

			// Consume the resources
			user.removeManyResources({
				"yew wood": 40,
				"iron bar": 50,
			});

			// Get reward
			user.gainManyResources({
				gold: 320,
			});

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};