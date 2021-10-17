const { questHelper } = require("../../quest-helper");
// const allItems = require("../../items/all-items");

module.exports = {
	footprintsInTheDark: {
		name: "Footprints in the Dark",
		requirement: {
			building: "lumbermill",
			level: 1,
		},
		author: "Sindre Heldrup",
		intro: "There are strange noises in the dark. From one of the street lights a shadow of the leading lumberjack can be seen running through the streets!",
		description: "You wake up in the night, the leading lumberjack frantically knocking at your door.\n\n%username%: 'Damn, I thought I made it clear we were done with this sort of business'.\n\n*\\*You open the door, before the lumberjack barges in, clearly agitated.\\**\n\n%username%: 'Listen, I thought I made it clear I am not interes...'\n\nLumberjack: 'SOMEONE JUST SABOTAGED THE PRODUCTION, THE LUMBERMILL IS IN TATTERS!'\n\n*\\*You quickly regain your wits\\**\n\n%username%: 'What do you mean someone sabotaged the production?'\n\nLumberjack: 'I was awoken by loud noises of collapsing and cracking wood. I quickly gather a couple of sturdy men and went out to check it. Arriving at the lumbermill we found broken axes, planks, and the main saw being gone. We have no idea who did it as the perpetrators were already gone by the time we got there.'\n\nYou follow him to the area and start investigating the Lumbermill. It is indeed in tatters, clearly showing signs of a focused attack to hinder the production. There are a mix of large footprints from the lumberjacks in the nearby area, but there are also some smaller and lighter footprints.\n\n**You are presented with __two__ choices:**\n```diff\nChoice 1:\n- Blame the lumberjacks for sabotaging the production to get some vacation. (!quest %questIndex% choice 1)\n\nChoice 2:\n- Drop the sleep and further investigate the light footprints to possibly discover some more clues as to what happened. (!quest %questIndex% choice 2)\n```",
		winDescription: "",
		winChoice1: "You think: 'Damn lumberjacks trying to get lazy with me, I'll show em!'\n\n*- Your Lumbermill's level decreased back to 0*\n*- Your hero gets his beauty sleep and regain 500 hp*",
		winChoice2: "You decide to trust the lumberjacks, light a torch and take a closer look at the light and small footprints.\n**A new quest is available**",
		questKeySequence: ["Building Quests", "footprintsInTheDark"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user, choice) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse || !choice) return false;

			const choiceNumber = parseInt(choice[1]);
			// Only 2 answers possible
			if (!(choiceNumber <= 2 && choiceNumber >= 1)) return false;

			user.removeQuest(this.name);

			if (choiceNumber === 1) {
				user.healHero(500);
				user.changeBuildingLevel("lumbermill", 1, -1);
				this.winDescription = this.winChoice1;
			}
			else if (choiceNumber === 2) {
				this.winDescription = this.winChoice2;

				const newQuest = {
					name: "Finding the Saboteurs",
					started: false,
					questKeySequence: ["Building Quests", "findingSaboteurs"],
					pve: [{
						name: "Forest",
						completed: false,
						chance: 0.25,
					}],
				};

				user.addNewQuest(newQuest);
			}

			user.save();

			return true;
		},
	},
	findingSaboteurs: {
		name: "Finding the Saboteurs",
		author: "Sindre Heldrup",
		pve: [{
			name: "Forest",
			completed: false,
			chance: 0.35,
		}],
		found: "While following the trail you hear a twig cracking",
		notFound: "You lost track of the footsteps and got lost. Maybe it is better to go back and try again?",
		description: "The footprints lead away from the Lumbermill, and you decide to follow them alone to make sure the lumberjacks were telling the truth and they had nothing to do with destruction. You bring your equipment and set out into the forest.",
		winDescription: "You turn to the noise, quickly drawing your weapon! Walking a step toward the source of the sound you feel a sharp pain at the back of the head. The world turns black as you lose consciousness.\n**A new quest is available**",
		objective: "Follow the footsteps into the **Forest**",
		reward: "Oak wood: 40\n",
		questKeySequence: ["Building Quests", "findingSaboteurs"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user, choice) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse || !choice) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({
				"oak wood": 40,
			});

			// Add next quest
			const newQuest = {
				name: "The Wood Elves",
				started: false,
				questKeySequence: ["Building Quests", "woodElves"],
			};
			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},

	woodElves: {
		name: "The Wood Elves",
		author: "Sindre Heldrup",
		description: "You wake up by a fire, feeling your hands tied together, but otherwise feeling fine apart from a dull pain at the back of your head. You squint your eyes due to the light emanating from the fire, looking around you. A bunch of what appears to be elves are clustered around you, looking at you with curious eyes.\n\nYou think: 'What’s the matter with them, have they never seen a handsome man before.'\n\nA voice rises above the murmur from the crowd: 'Bring forth the human'.\n\nYou are brought in front of a tall and slender elf sitting on a wooden throne elevated by a wooden platform. His hair is silver, his eyes shining with wisdom and age, and his body covered with a clothing of green and brown. \n\nHe asks you: 'Why were you out in our wood at the middle of the night Human?'\n\n**Three answers spring to your mind:**\n```diff\nChoice 1:\n- 'Whatever, I’ll do what I want.' Uttering the words you also decide to flip him off to prove how much of a badass you really are. (!quest %questIndex% choice 1)\n\nChoice 2:\n- 'I just awoke in the night and thought it was a fantastic idea to rise from bed and take a quick stroll in the wood. You know, just for fun, me being such a dedicated nature lover.' (!quest %questIndex% choice 2)\n\nChoice 3:\n- 'My lumbermill was raided and I was following the tracks when I was ambushed.' (!quest %questIndex% choice 3)\n```",
		winDescription: "",
		winChoice1: "The elf on the throne looks at you with disgust written all over his face. \n\nIn a loud and clear voice he says: 'Off with his head'.\n\nYou decide to do what is heroic and burp while the axe is swinging toward your neck. 'I do not think anyone has died while burping before, I’m such a bada...'\n\n*- Your hero died*\n*- Your Lumbermill's level decreased back to 0*",
		winChoice2: "The elf on the throne look at you with raised eyebrows.\n\nHe says: 'Do you really think I will believe a human would take a walk through the woods by themselves for the beauty of the forest? Answer me, but do not lie to me again Human. This is your one and only warning.'\n**A new quest is available**",
		winChoice3: "*\\*The Elven Lord looks at you with a serious face.\\**\n\nHe says: 'Now that is honesty if I’ve ever seen it. I appreciate that. Because of that I will provide you with the answers you seek.'\n**A new quest is available**",
		questKeySequence: ["Building Quests", "woodElves"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user, choice) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse || !choice) return false;

			const choiceNumber = parseInt(choice[1]);
			// Only 2 answers possible
			if (!(choiceNumber <= 3 && choiceNumber >= 1)) return false;

			user.removeQuest(this.name);

			if (choiceNumber === 1) {
				await user.heroHpLoss(1);
				user.changeBuildingLevel("lumbermill", 1, -1);
				this.winDescription = this.winChoice1;
			}
			else if (choiceNumber === 2) {
				this.winDescription = this.winChoice2;

				const newQuest = {
					name: "Lies are not Tollerated",
					started: false,
					questKeySequence: ["Building Quests", "liesNotTollerated"],
				};

				user.addNewQuest(newQuest);
			}
			else if (choiceNumber === 3) {
				this.winDescription = this.winChoice3;

				const newQuest = {
					name: "A New Start",
					started: false,
					questKeySequence: ["Building Quests", "newStart"],
				};

				user.addNewQuest(newQuest);
			}

			user.save();

			return true;
		},
	},
	liesNotTollerated: {
		name: "Lies are not Tollerated",
		author: "Sindre Heldrup",
		description: "*\\*The elf on the throne look at you with raised eyebrows.\\**\n\nHe says: 'Do you really think I will believe a human would take a walk through the woods by themselves for the beauty of the forest? Answer me, but do not lie to me again Human. This is your one and only warning.'\n\n**You think of two possible answers:**\n```diff\nChoice 1:\n- 'No, really, I do love the forest with all my heart and taking random walks in it during the night is my life’s true calling. You know, the woods are basically my second home!' (!quest %questIndex% choice 1)\n\nChoice 2:\n- 'My Lumbermill was raided and I were following the tracks when I was ambushed.' (!quest %questIndex% choice 2)\n```",
		winDescription: "",
		winChoice1: "You buckle down on your answer: 'No, really, I do love the forest with all my heart and taking random walks in it during the night is my life’s true calling. You know, the woods are basi...'\n\n*\\*The Elven Lord points to his mouth and you are gagged before being able to finish your love ballad of the forest.\\**\n\nThe Elven Lord: 'Off with his head.'\n\n*- Your hero died*\n*- Your Lumbermill's level decreased back to 0*",
		winChoice2: "*\\*The Elven Lord looks at you with a serious face.\\**\n\nHe says: 'Now that is honesty if I’ve ever seen it. I appreciate that. Because of that I will provide you with the answers you seek.'\n**A new quest is available**",
		questKeySequence: ["Building Quests", "liesNotTollerated"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user, choice) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse || !choice) return false;

			const choiceNumber = parseInt(choice[1]);
			// Only 2 answers possible
			if (!(choiceNumber <= 2 && choiceNumber >= 1)) return false;

			user.removeQuest(this.name);

			if (choiceNumber === 1) {
				await user.heroHpLoss(1);
				user.changeBuildingLevel("lumbermill", 1, -1);
				this.winDescription = this.winChoice1;
			}
			else if (choiceNumber === 2) {
				this.winDescription = this.winChoice2;

				const newQuest = {
					name: "A New Start",
					started: false,
					questKeySequence: ["Building Quests", "newStart"],
				};

				user.addNewQuest(newQuest);
			}

			user.save();

			return true;
		},
	},

	newStart: {
		name: "A New Start",
		author: "Sindre Heldrup",
		description: "You look at the Elven Lord expectantly hoping he is about to give you the answers of how to strike it off with that hot bartender you’ve been staring down every night for the past month.\n\nHe continues: 'It was some of my hunters, returning from a hunt but noticing a section of the forest missing, chopped down by your lumberjacks...'\n\nYou look at him with disappointment written all over your face as you realize he won’t provide you with a brilliant strategy to strike it off with the bartender. \n\nHe says: 'Yes, I can see the disappointment in your face, I realize a great deal of materials and equipment were destroyed by my elves...'\n\n*\\*You quickly nod, feeling relief he can’t read your mind.\\**\n\nHe says: 'We do not wish for bad blood between our two people, and therefore I __offer__ to help you replace the equipment lost and rebuild what we destroyed. However, I will not punish the hunters, nor can I guarantee it never happens again. But this time we will make up for it, as a sign of good faith. Give your answer by tomorrow!'\n\n**You return to your village and think about your options, identifying three possible routes to take:**\n```diff\nChoice 1:\n- Do nothing and go back to sleep. Damn, but you feel very tired already. If you catch some good hours before the days works you can possibly go to the bar in the evening and stare down the bartender some more. Tempting. (!quest %questIndex% choice 1)\n\nChoice 2:\n- Rouse your warriors, those elves must be punished! (!quest %questIndex% choice 2)\n\nChoice 3:\n- You return the following night to the designated area, meeting the Elven Lord and accept his offer to help you rebuild and replace the equipment. (!quest %questIndex% choice 3)\n```",
		winDescription: "",
		winChoice1: "Your plan worked out nicely and you had a good nights rest.\n\n*- Your Hero gained 200 hp *\n",
		winChoice2: "You gather up your army to attack the Wood Elves.\n**A new quest is available**",
		winChoice3: "Through the elven expertise they manage to raise the Lumbermill to a higher standard than before. \n\nYou shake the hand of the Elven Lord, promising peace between your people and them, the Elven Lord giving his assurances that he will try to keep elves from attacking the Lumbermill in rage.\n\n*- Your Lumbermill gained an additional level and is now level 2!*\n",
		questKeySequence: ["Building Quests", "newStart"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user, choice) {
			const questResponse = questHelper(user, this.name);
			if (!questResponse || !choice) return false;

			const choiceNumber = parseInt(choice[1]);
			// Only 2 answers possible
			if (!(choiceNumber <= 3 && choiceNumber >= 1)) return false;

			user.removeQuest(this.name);

			if (choiceNumber === 1) {
				user.healHero(200);
				this.winDescription = this.winChoice1;
			}
			else if (choiceNumber === 2) {
				this.winDescription = this.winChoice2;

				const newQuest = {
					name: "A Battle for the Wood",
					started: false,
					questKeySequence: ["Building Quests", "battleForWood"],
					pve: [{
						name: "Wood Elves",
						completed: false,
						chance: 1,
						unique: true,
					}],
				};

				user.addNewQuest(newQuest);
			}
			else if (choiceNumber === 3) {
				this.winDescription = this.winChoice3;

				user.changeBuildingLevel("lumbermill", 1, 1);
			}

			user.save();

			return true;
		},
	},

	battleForWood: {
		name: "A Battle for the Wood",
		author: "Sindre Heldrup",
		pve: [{
			name: "Wood Elves",
			completed: false,
			chance: 1,
			unique: true,
		}],
		found: "The Elven Lord falls to the ground",
		description: "You gather your men and set off into the woods as day breaks in search of those nasty elves. After a couple of hours a wild elf appears. You, still feeling the nick at your honor from being knocked unconscious by the elves pick up a rock and throw it at the elf. The wild elf disappears.\n\nYou lead the men further into the forest and discover the elven village",
		winDescription: "They fight valiantly yet are utterly crushed by the might of your force.\nThe elves lord is brought to you alive. \n\nThe elven lord: 'How could you do this, I thought we had an agreem...'\n\nYou cut him off. Literally. By the head. \n\nSeeing his silvery hair now painted in red, your pride saved for now, you head back to the village to take a good long sip of a well-deserved beer while staring down the poor bartender. An honest day of work, and now the lumbermill is once again safe from nasty silver haired elves trying to feed you information apart from how to hit on a hot bartender.\n\n*\\*Your Lumbermill is still in ruins and is set back to level 0\\**",
		objective: "Defeat the Wood Elves (`!raid wood elves`)",
		reward: "Oak wood: 70\nYew wood: 20\n",
		questKeySequence: ["Building Quests", "battleForWood"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user, choice) {
			const questResponse = await questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "Wood Elves" }]);
			if (!questResponse || !choice) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if (userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({
				"oak wood": 70,
				"yew wood": 20,
			});

			user.changeBuildingLevel("lumbermill", 1, -1);

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};
