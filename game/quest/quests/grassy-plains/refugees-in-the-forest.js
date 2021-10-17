const { questHelper } = require("../../quest-helper");
const allItems = require("../../../items/all-items");

module.exports = {

	// Refugees in the forest
	refugeesInForest: {
		name: "Refugees in the Forest",
		obtaining: {
			area: "Forest",
			chance: 1,
		},
		intro: "As you chase a boar deeper into the Forest you come across an encampment.",
		description: "You are greeted by worried looks as you enter the encampment. There are several tents across the area, but the people seems to be in rough shape. A tall muscular man comes up to you. He has an aggressive look on his face.\n\n'Hello! My name is Isaac, who are you and where do you come from stranger? Speak!'\n\n'My name is %username%, and I come from an Empire in the rising about a day's travel from here. I was just hunting for Boars and stumbled across the encampment, I want no harm!'\n\n*\\*His face breaks out in a small but firm smile\\**\n\n'As long as you are no friend of that Bandit King, then you are more than welcome here! We have fled his tyranny to start a new life here in the woods. It is a place where people can feel safe, and the children can run freely!'\n\n*\\*He shows you around the encampment\\**\n\n'As you can tell we are in rough shape, The Bandit King took everything from us so we had no choice but to start fresh.\nWe could really need your help! If your Empire could provide us some lumber and ore, then it would help us build proper homes before the winter arrives!'",
		objective: "Provide the encampment some raw materials:\nOak wood: 70\nYew wood: 30\nCopper ore: 50\n\nEnter the command `!quest %questIndex%` to deliver the resources.",
		reward: "Leggings of the Dawn: 1",
		winDescription: "'Thank you so much, %username%! These materials will come to good use, we promise you that! I know that you have already done so much for us, but may we ask you for one last favour?\n**A new quest is available**'",
		questKeySequence: ["Grassy Plains", "refugeesInForest"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does user have the pre-req?
			if(!(user.resources["oak wood"] >= 70)) return false;
			if(!(user.resources["yew wood"] >= 30)) return false;
			if(!(user.resources["copper ore"] >= 50)) return false;

			// Remove the peasants and weapons!!!!
			user.removeManyResources({
				"oak wood": 70,
				"yew wood": 30,
				"copper ore": 50,
			});

			// Get reward
			user.addItem(allItems["leggings of the dawn"], 1);

			// Add next quest
			const newQuest = {
				name: "Dealing with Wolves",
				started: false,
				questKeySequence: ["Grassy Plains", "dealingWithWolves"],
				pve: [{
					name: "Forest",
					completed: false,
					chance: 0.33,
				}],
			};
			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	dealingWithWolves: {
		name: "Dealing with Wolves",
		found: "You found some fresh Wolf Tracks\n**A new quest is available!**",
		notFound: "You found no signs of the Wolf Pack. Keep looking!",
		foundNewQuest: async (user) => {
			// If you have not found The Wolf Pack already
			if(!user.completedQuests.includes("The Wolf Pack") && !user.quests.find(startedQuests => startedQuests.name === "The Wolf Pack")) {
				// Add next quest
				const newQuest = {
					name: "The Wolf Pack",
					started: false,
					questKeySequence: ["Grassy Plains", "wolfPack"],
					pve: [{
						name: "Pack of Wolves",
						completed: false,
						chance: 1,
						unique: true,
					}],
				};
				user.addNewQuest(newQuest);

				await user.save();
				return;
			}

			// When you have finished The Wolf Pack, then you get The Alpha Wolf
			if(!user.completedQuests.includes("The Alpha Wolf") && !user.quests.find(startedQuests => startedQuests.name === "The Alpha Wolf")) {
				// Add next quest
				const newQuest = {
					name: "The Alpha Wolf",
					started: false,
					questKeySequence: ["Grassy Plains", "alphaWolf"],
					pve: [{
						name: "The Alpha Wolf",
						completed: false,
						chance: 1,
						unique: true,
					}],
				};
				user.addNewQuest(newQuest);

				await user.save();

				return;
			}

		},
		pve: [{
			name: "Forest",
			completed: false,
			chance: 0.33,
		}],
		description: "'A few days ago one of the women of our encampment got killed by a ferocious pack of wolves!'\n\n*\\*A sad look inhabitates Isaacs face as he stares empty into the Forest. With an effort he continues.\\**\n\n'You can imagine how it startled the people. They are now afraid to walk away from the encampment, which makes it impossible to gather enough food for everyone. After the accident the only person I have seen dare enter the Forest was an old Blacksmith who was heading for the Cave.'\n\n'Please kill the Pack of Wolves, and bring me the Alpha Male's Head'",
		objective: "Kill the Pack of Wolves that is lurking around in the Forest and bring back the head of the Alpha Wolf",
		reward: "Kings Platemail: 1",
		winDescription: "You arrive at the Encampment and show them the Wolf Head.\n\n*\\*The people of the Encampment cheers in celebration and Isaac comes out from the croud with a big smile on his face\\**\n\n'You once again saved our people, %username%! We are forever grateful, and if we can ever repay the debt, do not hesitate one bit to ask!'",
		questKeySequence: ["Grassy Plains", "dealingWithWolves"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does user have the pre-req?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			if(!user.completedQuests.includes("The Wolf Pack") || !user.completedQuests.includes("The Alpha Wolf")) return false;

			// Get reward
			user.addItem(allItems["kings platemail"], 1);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	wolfPack: {
		name: "The Wolf Pack",
		found: "You search among the dead wolves for the Alpha Wolf",
		pve: [{
			name: "Pack of Wolves",
			completed: false,
			chance: 1,
			unique: true,
		}],
		description: "You follow the footsteps and very soon you see a Pack of Wolves ahead",
		objective: "Kill the Pack of Wolves (`!hunt pack of wolves`)",
		reward: false,
		winDescription: "You did not find the Alpha Wolf among the pack. Better go back to the Forest and search some more.",
		questKeySequence: ["Grassy Plains", "wolfPack"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "Pack of Wolves" }]);
			if(!questResponse) return false;

			// Does user have the pre-req?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;


			// Refresh the pve hunt in the forest
			user.refreshQuestPve("Dealing with Wolves");

			// Get reward

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	alphaWolf: {
		name: "The Alpha Wolf",
		found: "You cut off the Alpha Wolf's head to bring back to the encampment",
		pve: [{
			name: "The Alpha Wolf",
			completed: false,
			chance: 1,
			unique: true,
		}],
		description: "You follow the footsteps and very soon you see a Pack of Wolves ahead. It is clear that this is the Pack you have been looking for. There is a massive gray Wolf leading the pack through the Forest.",
		objective: "Kill the Alpha Wolf! (`!hunt the alpha wolf`)",
		reward: false,
		winDescription: "With the Head of the Alpha Wolf you start heading back to the encampment to show them the Wolf Head.",
		questKeySequence: ["Grassy Plains", "alphaWolf"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "The Alpha Wolf" }]);
			if(!questResponse) return false;

			// Does user have the pre-req?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};