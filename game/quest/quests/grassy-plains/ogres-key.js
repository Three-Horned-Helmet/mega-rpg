const { questHelper } = require("../../quest-helper");

module.exports = {

	// THE OGRE'S KEY
	strangeKey: {
		name: "A Strange Key",
		obtaining: {
			area: "C'Thun",
			chance: 1,
		},
		pve: [{
			name: "Cave",
			completed: false,
			chance: 0.33,
		}],
		found: "",
		notFound: "",
		intro: "You go through C'Thuns pockets to find any valuables and a glimmer of gold catches your eyes",
		description: "You pick up a beautiful solid gold key from the Ogre's pocket. You can't believe your eyes, how can an Ogre be in possession of such a valuable item? The Ogre's Cave does not even have any items with a lock on it! Bewildred about the key you put it in the pocket and think to yourself:\n\n'I wonder what the engravings on the key stands for... hmmm... **C.M.**?'",
		objective: "Find out what the key is meant for",
		reward: "Gold: 200\n",
		winDescription: "\n**A new quest is available**",
		questKeySequence: ["Grassy Plains", "strangeKey"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Has the user completed the PvE requirements?
			const userQuest = user.quests.find(q => q.name === this.name);
			if(userQuest.pve.find(raid => !raid.completed)) return false;

			// Get reward
			user.gainManyResources({ gold: 200 });

			// Add next quest
			// const newQuest = {
			//     name: "Confronting the Bandits",
			//     started: false,
			//     questKeySequence: ["Grassy Plains", "confrontingBandits"],
			//     pve: [{
			//         name: "Confront Bandits",
			//         completed: false,
			//         chance: 1,
			//         unique: true,
			//     }],
			// };
			// user.addNewQuest(newQuest);
			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};