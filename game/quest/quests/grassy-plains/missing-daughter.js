const { questHelper } = require("../../quest-helper");
const allItems = require("../../../items/all-items");

module.exports = {

	// THE MISSING DAUGHTER SAGA
	missingDaughter: {
		name: "Missing Daughter",
		obtaining: {
			area: "Fishing village",
			chance: 0.5,
		},
		pve: [{
			name: "Cave",
			completed: false,
			chance: 0.33,
		}],
		found: "You found a torn up doll",
		notFound: "You searched around the Cave but found no signs of the young womans daughter. Maybe she is futher in?",
		intro: "You found a Young Woman begging for help in one of the houses of the Village",
		description: "'Please sir! I need your help', cried the Young Woman. 'My daughter is missing! She was playing with her doll about a day ago when some of the other kids started making fun of her. She got upset ran away in the direction of the **Cave**. I have always told her not to go near that dangerous area! There has been several kids missing after those damned bandits started inhabiting the Cave.'\n\n*\\*The young woman walks up close to you.\\**\n\n'When I came looking for her, she was nowhere to be found. It is probably those damned bandits! They have been staying at the Cave for a while now, but I don't dare go in there alone, the Cave is too enormous and I can only imagine what they will do to a young woman like me.'\n\n*\\*She grabs your arm forcefully!\\**\n\n'Will you please go and look for her and if you find those bandits teach them a lesson! My poor, poor, little girl! All by herself, she must be so afraid!'\n\n*\\*The tears are rolling down her face in despair...\\** \n**You think to yourself... 'Here comes the rape train!'**",
		objective: "Hunt the **Cave** until you find any signs of her daughter",
		reward: "Gold: 220\n",
		winDescription: "The torn up doll must belong to the Young Woman's daughter. You better confront those bandits about the missing children of the village and bring back the poor little girl to her mother.\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "missingDaughter"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({ gold: 220 });

			// Add next quest
			const newQuest = {
				name: "Confronting the Bandits",
				started: false,
				questKeySequence: ["Grassy Plains", "confrontingBandits"],
				pve: [{
					name: "Confront Bandits",
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
	confrontingBandits: {
		name: "Confronting the Bandits",
		pve: [{
			name: "Confront Bandits",
			completed: false,
			chance: 1,
			unique: true,
		}],
		found: "*\\*The bandits falls to their knees begging for their lives\\**",
		description: "You venture deeper into the Cave until you hear some noises.\n\nBandit 1: '... must've brought back the little shit. We better get rid of it!'\nBandit 2: 'You mean to kill it?'\nBandit 1: 'I don't see any other choice either, let us do it tonight!'\nBandit 3: 'But are we even able to...'\nBandit 3: 'Shhhh! I think I hear someone out in the hall! HELLO? IS ANYONE THERE?'\n\n*\\*You rapid but quietly move out of the Cave\\**\n\n'There are way too many of them, I better come back with some more men to take them down!'",
		objective: "Gather your full strength and attack the bandits! (`!raid confront bandits`)",
		reward: "Iron sword: 10",
		winDescription: "%username%: 'WHERE HAVE YOU TAKEN THE LITTLE GIRL?'\nBandit 1: 'What little girl? What are you talking about?'\n%username%: 'There was a little girl running towards the Cave a day ago, and now she is gone! WHERE HAVE YOU TAKEN HER?\nBandit 1: 'I... I don't know what you are talking about! There has not been anyone around here since we came a few months ago!'\nBandit 2: 'Yes, we swear! I know we are bandits and all, but we would never take a little girl!'\n%username%: 'LIARS!'\nBandit 1: 'Look, there are nothing in here that shows any signs of a girl, alright?'\n\n*\\*You look around the room and notices nothing more than a few pieces of mens clothing, food and some trash along the walls. Among the trash you see a strange shiny horn-like item, but before you can take a better look one of bandits bursts out!\\**\n\nBandit 3: 'One day ago you said? I may have seen the little girl! I heard a loud scream and when I went to look I noticed a small shadow sliding across the forest! Maybe that was her?'\nBandit 1: 'It must have been! We promise you we have never touched any young girls ever!'\nBandit 4: '...'\n\n*\\*You decide to believe them, and leave to bring back the terrible news to the Young Lady at the Fishing Village\\**\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "confrontingBandits"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = await questHelper(user, this.name, [{ currentLocation: "Grassy Plains", place: "Confront Bandits" }]);
			if(!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.addItem(allItems["iron sword"], 10);


			// Add next quest
			const newQuest = {
				name: "Return the Bad News",
				started: false,
				questKeySequence: ["Grassy Plains", "returnBadNews"],
			};

			user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			user.save();

			return true;
		},
	},
	returnBadNews: {
		name: "Return the Bad News",
		description: "You need to deliver the bad news to the Young Woman in the Fishing Village. Hopefully she will take it alright.",
		objective: "Return to the fishing village (`!quest return the bad news`)",
		reward: "Black Granite Mace: 1",
		winDescription: "'Oh my poor little girl!', *\\*sobs\\** Young Woman. 'She must be so afraid all by herself in the forest! What can have happened to her... It... It must have been that damned Bandit King!'\n\n*\\*She got up and her teared up face is red of anger\\**\n\n'He was once a nice and honorable man that walked the streets of this village, until he lost his wife in a terrible accident and disappeared for several months! He suddenly returned one day but was beyond recognition. He started terrorizing the the village, and no one has been able to stand up to him since!'\n\n*\\*She grabs a black mace from the wall and falls to the knees in front of you\\**\n\n'Thank you for doing what you can to help me. Here... Take this Mace as a token of gratitude, it once belonged to my father who was a skilled blacksmith. You may have better use for it than me...'\n\n*\\*As you walk out the door you turn around and sees her face once again teared up in hulking in despair on the floor\\**\n\n**You think to yourself: 'What a strange lady'**",
		questKeySequence: ["Grassy Plains", "confrontingBandits"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Get reward
			user.addItem(allItems["black granite mace"], 1);

			user.removeQuest(this.name);

			user.save();

			return true;
		},
	},
};