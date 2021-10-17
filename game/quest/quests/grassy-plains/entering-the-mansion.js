const { questHelper } = require("../../quest-helper");
const allItems = require("../../../items/all-items");

module.exports = {

	// ENTERING THE MANSION
	enteringMansion: {
		name: "Entering the Mansion",
		obtaining: {
			area: "Mansion's Courtyard",
			chance: 1,
		},
		pve: [{
			name: "Fishing village",
			completed: false,
			chance: 0.6,
		}],
		found: "While looking through the Village for someone who knows how to get into the Mansion, you stumble upon a sign with the text 'Locksmith Ahred'",
		intro: "You try to open the door into the Mansion, but it is locked.",
		description: "With the help of your soldiers you try to open the Mansion's door using brute force, but it does not bulge. It must be stronger forces keeping the door shut. You command your men to surround the Mansion to find an alternative way in, but without any luck.\n\n'There must be someone who knows how to get into the Mansion, but who?'",
		objective: "Find someone who knows how to get into the Mansion",
		reward: "Gold: 230",
		winDescription: "You open the door into the Locksmith and find a tall slim man with a long beard sitting behind the counter. He seems quite old.\n\n'Good day to you Sir! My name is Ahred, and what brings you to my Locksmith?'\n\n'I was looking for a way to get into the Bandits Mansion and was wondering if you would be able to help out?'\n\n*\\*Ahred meets you with a surprised look\\**\n\n'Oooh, so you are going to pick a bone with The Bandit King, huh? It's about time! I may be able to help you out, but it will not be easy!'\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "enteringMansion"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse) return false;


			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;


			// Get reward
			user.gainManyResources({
				gold: 230,
			});

			// Add next quest
			const newQuest = {
				name: "The Key to the Mansion",
				started: false,
				questKeySequence: ["Grassy Plains", "keyToMansion"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	keyToMansion: {
		name: "The Key to the Mansion",
		description: "'Huh, you know... I once knew Julius Banethus, the person now known as The Bandit King. He used to be an honorable man, who cared about his people! Julius and his wife Migreth used to come by quite frequently back in the days. I used to craft a lot of keys for them, and we became quite good friends!'\n\n*\\*A smile appeared across his face, but when he continued his face turned dark\\**\n\n'This was when Migreth was still alive. She was expecting a child and was going to conceive it in the Forest where they had a magnificent Cabin together. No one knows what really happened there, but the Cabin got set on fire and Migreth nor the child made it out alive. Poor Julius was devastated and after a while he could not stand it anymore and left the country for a long time. When he came back, huh...'\n\n*\\*He paused and his face revealed how heart-broken he was of the accident.\\**\n\n'Oh well enough about that! You told me you wanted that key made, huh? I need a few things for that to happen. First of all I need some Obsidian bars to craft the key, but only Morith the Blacksmith knows the craft, he is an older man, but still very sharp and daring. Unfortuneatly, no one has seen him for quite a while so you better get prepared for a little searching\n\nSecondly, I need the key Mold. This one will also be a bit tricky, but you can talk with Grethel. She lives by the river here in the Fishing Village, and may know how to get the Mold. Good luck!'\n\n*\\*You thank Ahred and leaves the blacksmith\\**\n**Two new quests are available**",
		objective: "Get the Key Mold and the Obsidian bars",
		reward: "Key to the Mansion: 1",
		winDescription: "'Perfect! This is exactly what I need to create the key! Feel free to sit and wait while I craft it.'\n\n*\\*You sit down by an old table in the corner of the workshop and watch silently while Ahred crafts the key. After a few hours he suddenly bursts out.\\**\n\n'There we go, this should do it!'\n\n*\\*Ahred hands you the key\\**\n\n'Careful, it is still a bit hot!'\n\n*\\*You take the key and is deeply impressed. It is a significant key!\\**\n\n'Thank you so much for your help, Ahred! If I can ever repay you, please let me know!'\n\n'Oh, don't worry about that! Just remember, I don't know what business you have with The Bandit King, but don't forget that he was once a very kind and honorable man! I believe that man is still there inside of him somewhere!'\n\n*\\*You shake Ahreds hand in gratitude and leave the locksmith with a shiny freshly-made obsidian key. Now it's time to see if it actually works!\\**\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "keyToMansion"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const newQuests = [{
				name: "Finding Morith",
				started: false,
				questKeySequence: ["Grassy Plains", "findingMorith"],
				pve: [{
					name: "Cave",
					completed: false,
					chance: 0.2,
				}],
			},
			{
				name: "Grethels Mission",
				started: false,
				questKeySequence: ["Grassy Plains", "grethelsMission"],
			}];

			const questResponse = questHelper(user, this.name, false, newQuests);
			if (!questResponse) return false;

			// Has the user completed the two quests
			if (!(user.completedQuests.includes("Moriths Hidden Mine")) || !(user.completedQuests.includes("The End of Grethels Mission"))) return false;

			// Add next quest
			const newQuest = {
				name: "Ending the reign of The Bandit King",
				started: false,
				questKeySequence: ["Grassy Plains", "endingReignOfBanditKing"],
				pve: [{
					name: "Bandit King",
					completed: false,
					chance: 1,
				}],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	endingReignOfBanditKing: {
		name: "Ending the reign of The Bandit King",
		pve: [{
			name: "Bandit King",
			completed: false,
			chance: 1,
		}],
		description: "Head to the Bandits Mansion and defeat The Bandit King.",
		objective: "Kill The Bandit King",
		reward: "Bandits Bandana: 1",
		winDescription: "The Bandit King lies on the floor soaked in blood. The impling with the green tail looks at him with disgust. As you walk over to The Bandit King he starts whispering something. You bend down to listen to what it is.\n\n'Help... Me... Mephisto...'\n\nThe Bandit King is suddenly set on fire as the impling gets a terrified look on his face and flies away!",
		questKeySequence: ["Grassy Plains", "endingReignOfBanditKing"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.addItem(allItems["bandits bandana"], 1);

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	// A QUEST FOR OBSIDIAN
	findingMorith: {
		name: "Finding Morith",
		pve: [{
			name: "Cave",
			completed: false,
			chance: 0.2,
		}],
		found: "While venturing into the Cave you find an old bulky gentleman inspecting some rocks",
		description: "You need to find Morith the Blacksmith, the only smith in the area that is able to craft Obsidian Bars. He is an old bulky man, last seen a few weeks ago.",
		objective: "Find Morith",
		reward: false,
		winDescription: "'Hello, are you by any chance Morith the Blacksmith?'\n\n*\\*The old man turns around, clearly baffled by the pressence of others\\**\n\n'Oh hello there... Yes, I am Morith, who are you?'\n'I need your help! Ahred needs some Obsidian to craft a key, and he told me you are the only person in this area that knows how to melt Obsidian Bars!'\n\n*\\*Morith sends you a judging look\\**\n\n'It must be a pretty special key he is crafting?'\n\n*\\*You decides to not answer the question and Morith breaks the silence.\\**\n\n'I assume I can help you, but I will not do it for free. Help me first with finding a special ore and I can help you out after!'\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "findingMorith"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse) return false;


			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;


			// Get reward
			user.gainManyResources({ gold: 300 });

			// Add next quest
			const newQuest = {
				name: "Rubinite",
				started: false,
				questKeySequence: ["Grassy Plains", "rubinite"],
				pve: [{
					name: "Cave",
					completed: false,
					chance: 0.25,
				}],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	rubinite: {
		name: "Rubinite",
		pve: [{
			name: "Cave",
			completed: false,
			chance: 0.25,
		}],
		found: "You notice a glimmer of red by some rocks.",
		description: "'I am looking for a new type of ore called Rubinite. It is  shiny red with a shade of black and should be present in this Cave. If you help me find it, then I will help you with the Obsidian.'",
		objective: "Find Rubinite in the Cave",
		reward: false,
		winDescription: "You go to inspect the rocks, and there is no doubt Rubinite with its shiny red glimmer and a shade of black. As you head back to Morith you enter a part of the Cave where it seems like someone has been living. \n\nThere are Mens clothing around the rocky floor, and food in the process of rotting. You take a good look around to see if you can find anything of value. You find some papers with scribings and arrows on it. At a closer inspection it seems to a drawing of a large Courtyard with a building in the middle. You look further around but find nothing of interest and decides to get back to Morith.\n\n*\\*A while later you meet Morith by the entrance of the Cave\\**\n\n'Oh good, you found some Rubinite where did you find it?'\n\n'I found it by a room in the Cave that seemed abandoned a while ago. Just follow the path to the right and take a left when you spot two massive boulders. Now that you have your Rubinite, will you help me get some Obsidian Bars?'\n\n'Oh... Yes of course...'\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "rubinite"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse) return false;


			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;


			// Get reward
			user.gainManyResources({ gold: 300 });

			// Add next quest
			const newQuest = {
				name: "Moriths Hidden Mine",
				started: false,
				questKeySequence: ["Grassy Plains", "morithsHiddenMine"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	morithsHiddenMine: {
		name: "Moriths Hidden Mine",
		description: "'To craft Obsidian Bars I need Obsidian Ore and Steel Bars. The Steel Bars should be rather easy to get, however the Obsidian Ore can only be found in a special Mine that I found on one of my adventures. Let me show you where it is.'\n\n*\\*You have explored Moriths Mine\\**\n\n'It is a dangerous Mine and you may stumble across some Vile Creatures in there, but you will also be able to find some Obsidian Ore. I am unfortunately too old to venture to the cave myself. Bring me some of that Ore and I will help you smelt some Obsidian Bars.'",
		objective: "Give 10 Obsidian Ore and 40 Steel Bars to Morith",
		reward: "Access to Moriths Mine\n\nObsidian Bars: 10",
		winDescription: "'Ohh... Perfect, let us head back to the Fishing Village to my workshop'\n\n*\\*You follow Morith back to his workshop, and watch as he crafts the Obsidian Bars\\**\n\n'Umm... Here they are, 10 Obsidian Bars of the finest quality! I am not sure what you will need them for, but in these strange times it is best not to ask too many questions. Good luck with them anyways...'\n\n*\\*You wave goodbye and leave Moriths Workshop with 10 Obsidian Bars\\**",
		questKeySequence: ["Grassy Plains", "morithsHiddenMine"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "Moriths Mine" }]);
			if (!questResponse) return false;

			if (!(user.resources["obsidian ore"] >= 10)) return false;
			if (!(user.resources["steel bar"] >= 40)) return false;

			// Remove resources
			user.removeManyResources({
				"obsidian ore": 10,
				"steel bar": 40,
			});

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},


	// GRETHELS MISSION
	grethelsMission: {
		name: "Grethels Mission",
		description: "You head over to Grethel's house in the outskirts of the Fishing Village. It is an old and broken-down building. You knock on the door, and is greeted by an old woman who seems to be doing fairly well for her age.\n\n'Are you Grethel by any chance? I was sent here by Ahred, he told me that you can help me craft a Key Mold to get into the Bandits Mansion.'\n\n'So you have some business with the King, is that so?'\n\n*\\*Grethel does not seem too pleased but she moves to the side and lets you into her home. After several minutes of silence she decides to speak.\\**\n\n'I understand that most people have an issue with Julius nowadays. You should know that he was once a nice and charming man, and I believe that he is still that same good man that he once was. He didn't turn evil until that...'\n\n*\\*She stoped her self and stood silently in her own thoughts for several minutes until she suddenly shrug her shoulders.\\**\n\n'Oh well, I can help you get the Key Mold but it will not be easy! First of all we need resources to craft the basis of the Key Mold, if you can fetch that, then I will plan how we can get a cast of the Mansion's Lock. Meet me here with the resources tonight!'\n\n*\\*You nod affirmatively\\**",
		objective: "Bring Grethel the following resources:\nGold: 200\nIron Bars: 40\nYew wood: 50",
		reward: false,
		winDescription: "'This is perfect!'\n\n*\\*Grethel creates an Unfinished Key Mold and hands it to you\\**\n\n'We will use this to create a Cast of the Key to the Mansion, I hope you are ready?'\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "grethelsMission"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse) return false;

			// Does the user have the resources?
			if (!(user.resources.gold >= 200)) return false;
			if (!(user.resources["iron bar"] >= 40)) return false;
			if (!(user.resources["yew wood"] >= 50)) return false;

			// Get reward
			user.gainManyResources({ gold: 300 });

			// Add next quest
			const newQuest = {
				name: "Entering the Courtyard",
				started: false,
				questKeySequence: ["Grassy Plains", "enteringCourtyard"],
				pve: [{
					name: "Mansion's Courtyard",
					completed: false,
					chance: 1,
				}],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	enteringCourtyard: {
		name: "Entering the Courtyard",
		pve: [{
			name: "Mansion's Courtyard",
			completed: false,
			chance: 1,
		}],
		found: "You approach the door to the Mansion.",
		description: "'We would have to get into the Mansion's Courtyard and get a Cast of the lock to the Mansion directly. The place is heavily guarded so it will be dangerous, but if we are lucky we will be able to sneak in while in the cover of the night. When we get to the Mansion's Main Door you need to use the Unfinished Key Mold to creat a Cast of the lock while I will keep a lookout for guards. I am more familiar with the place and know where the guards can come from if they spot us. Are you ready for it? '",
		objective: "Get into the Mansion's Courtyard",
		reward: "Gold: 300",
		winDescription: "'Quickly fetch the Mold and apply it to the Lock!', rushes Grethel.\n\n*\\*You fetch the Mold and begin working on the key print. After a short while you complete the Key Mold.\\**\n\n'Will this suffice Grethel?'\n\n*\\*You turn around and realize that Grethel is no where to be seen. You try to silently call for her, but there are no response. You suddenly hear a sound behind you, and quickly turn around!\\**\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "enteringCourtyard"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse) return false;


			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({
				gold: 300,
			});

			// Add next quest
			const newQuest = {
				name: "Courtyard Guards",
				started: false,
				questKeySequence: ["Grassy Plains", "courtyardGuards"],
				pve: [{
					name: "Courtyard Guards",
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

	courtyardGuards: {
		name: "Courtyard Guards",
		pve: [{
			name: "Courtyard Guards",
			completed: false,
			chance: 1,
			unique: true,
		}],
		found: "You hear some light footsteps running towards you!",
		description: "Four Mansion Guards are rushing aggressivly towards you with a grin on their faces!\n\n'HEEY! What you are you doing here on the King's property?!'\n\nYou quickly realise that there will be no way that you can come up with an excuse and decides to draw your weapon to prepare for battle!",
		objective: "Defeat the Courtyard Guards. (`!raid courtyard guards`)",
		reward: "Gold: 240",
		winDescription: "*\\*Grethel comes running around the corner with a horn-like item in her hands.\\**\n\n'RUN! QUICKLY! I think it may have heard all the noise you were making!'\n\n*\\*You follow her advice and start running towards the Mansion's Gate. As you leave you turn around and see a small red impling with a green tail rushing towards you. His mouth turns red, preparing to spit a fireball towards you!\n\n'GRETHEL WATC..!'\n\n*\\*Out of nowhere another smaller impling comes out from the forest and flies in front of the fireball. You hear a screech and it falls to the ground. You run as fast as your legs can carry you into the woods and away from the Mansion!\n\n*\\*You eventually get back to Grethels house.\\**\n\n'What the fuck where you doing, Grethel?! Why did you suddenly burst off??'\n\n*\\*She looks at you with a worried gaze\\**\n\n'I... I just needed to get something. Don't worry about it! Give me the Mold and I will complete it for you. Come back tomorrow morning and it should be finished!'\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "courtyardGuards"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "Courtyard Guards" }]);
			if (!questResponse) return false;


			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({
				gold: 240,
			});

			// Add next quest
			const newQuest = {
				name: "The End of Grethels Mission",
				started: false,
				questKeySequence: ["Grassy Plains", "endOfGrethelsMission"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	endOfGrethelsMission: {
		name: "The End of Grethels Mission",
		description: "You return the next day to a worried sight. Grethels house is smashed and there are burnmarks everywhere. You enter the house and see a large hole through the roof, and two big holes in the floor. There are blood stains and burnmarks everywhere. There are no signs of Grethel.",
		objective: "Search Grethels house for the Key Mold. (`!quest the end of grethels mission`)",
		reward: "Gold: 500\nFinished Key Mold: 1",
		winDescription: "You search the house and find the Key Mold hidden in one of the drawers of a broken desk. With the Finished Key Mold you leave the broken house.",
		questKeySequence: ["Grassy Plains", "endOfGrethelsMission"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse) return false;

			// Get reward
			user.gainManyResources({
				gold: 500,
			});

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};