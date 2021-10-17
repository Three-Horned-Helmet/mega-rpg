const { questHelper } = require("../../quest-helper");
const allItems = require("../../../items/all-items");


module.exports = {
	// THE MYSTERY MINE
	meetingBugbear: {
		name: "A Meeting with Bugbear",
		obtaining: {
			area: "Collapsed Mine",
			chance: 0.33,
		},
		intro: "As you venture deeper into the Collapsed Mine you hear some strange squeals.",
		pve: [{
			name: "Bugbear",
			completed: false,
			chance: 1,
			unique: true,
		}],
		found: "*\\*Bugbear is covered in blood and falls to his knees\\**",
		description: "You silently move closer to the squealing. As you round the corner you see a tall, crooked shadow inspecting a massive rock by the wall. A Goblin! You are surprised by the sight and move slowly away. The slippery stones makes you lose the balance and fall with a lound *\\*crack\\**.\n\n'Yeeek! What do we have here!', *\\*squeeal\\**, 'Is it a puny human disturbing busy Bugbear?' *\\*shriiiek\\** 'What business does a human have in this Collapsed Mine?'\n\n'I... I was just hunting for Spiders when I heard your squealing!'\n\n'You better leave working Bugbear alone' *\\*reeek\\** 'Little Human is lucky hungry Bugbear is busy, else you would greet the red man! Run now! Leave! Now!' *\\*yiiik\\**\n\n*You take on Bugbears advice and run out of the Mine to greet the warm sunlight outside!*\n\n'What is a dangerous Goblin doing in this area? It can not be safe to let him stay... I need to end him before he starts making mischief!'",
		objective: "Gather your full strength and attack Bugbear! (`!raid bugbear`)",
		reward: "Gold: 440",
		winDescription: "'You... Defeated... Dying Bugbear... I just... Wanted... Stone... The... Smell...'\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "meetingBugbear"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "Bugbear" }]);
			if(!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({
				gold: 440,
			});

			// Add next quest
			const newQuest = {
				name: "The Rock",
				started: false,
				questKeySequence: ["Grassy Plains", "theRock"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	theRock: {
		name: "The Rock",
		description: "At Bugbears last breath he twitches his muscles to move his arm a little closer to the giant rock he had been intensely observing earlier. \n\nYou move closer to inspect it and notice a round hole that could fit a large coin of some sorts. With the grown mans force you try to move the rock, but it does not bulge. 'I wonder what could be in there...'",
		objective: "Find a way to remove the rock",
		reward: "Iron ore: 50",
		winDescription: "You try to put the *C.M.* Gold Medallion into the hole.\n\n\\**Click*\\*\n\n*The large rock starts moving to the side leaving an entrance behind it.*\n\nYou move through the entrance to be amazed by the sight of a large chamber filled with small rotten corpses and all sorts of weaponry.\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "theRock"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			if(!user.completedQuests.includes("Digging for Treasure")) return false;

			// Get reward
			user.gainManyResources({
				"iron ore": 50,
			});

			// Add next quest
			const newQuest = {
				name: "Chamber of Weaponry",
				started: false,
				questKeySequence: ["Grassy Plains", "chamberOfWeaponry"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
	chamberOfWeaponry: {
		name: "Chamber of Weaponry",
		description: "As you walk around the chamber you notice the blood stained walls and the stench of rotten flesh. Among the mess you find some valuable artifact items and decides to pick them up. Even though they are very old, they are in perfect condition.",
		objective: "Bring home the treasure.",
		reward: "Gold: 1300\nBauxite Daggers: 1\nThree Horned Helmet: 1",
		winDescription: "You decide to take the valuables and leave the Chamber, wondering what the place may have been used for...",
		questKeySequence: ["Grassy Plains", "chamberOfWeaponry"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Get reward
			user.gainManyResources({
				"gold": 1300,
			});
			user.addItem(allItems["bauxite daggers"], 1);
			user.addItem(allItems["three horned helmet"], 1);

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};

