const { questHelper } = require("../../quest-helper");
const allItems = require("../../../items/all-items");
const allUnits = require("../../../recruit/all-units");

module.exports = {

	// CHILD SUPPORT
	childSupport: {
		name: "Child Support",
		obtaining: {
			area: "Fishing village",
			chance: 1,
		},
		intro: "A Strange Woman is standing by an orphan home asking strangers for help.",
		description: "'Hello there kind sir! Would you please help me out? I want to become a daycare nanny, however I need some soldiers! May I please borrow yours? They look like fine strong men!'\n\n*\\*You look strangely at her to why she would need soldiers to start a daycare center\\**\n\nShe does not seem affected by the weird look and continues: 'Would you please lend me some soldiers so I can start a daycare center? I would really, really like to work with children again!'",
		objective: "Provide the Strange Woman some soldiers\nPeasants: 10\nBronze swords: 10\nEnter the command `!quest %questIndex%` when you are finished.",
		reward: "Gold: 230\nLarge Healing Potion: 10",
		winDescription: "The Strange Lady thanks you for the soldiers and you decide to take the opportunity to ask her why she would need them to start a daycare center.\n\n*\\*She looks quickly around herself before moving a step closer and lowering her voice\\**\n\n'Well you see...It is because of HIM'\n'Him who?'\n'You know..'\n'I know?'\n'The Bandit King! I once had a magnificent orphan home here, supported by Julius Banethus himself! This was before he got the nickname The Bandit King. He was once a young, handsome and generous king, supporting his people.'\n\n*\\*She stares out the window with an empty look in her face.\\**\n\n'After the unfortunate accident, children of the village started disappearing. One day as many as three children went missing and Julius came down to me in person and was concerned about the orphans. He told me that the whole situation was out of control and that he wanted to bring the children back to his Castle, as there are better protection for them there!'\n\n'I did not want to do it, but he managed to convince me otherwise... He seemed so good-hearted back then, before he started terrorizing his people. That is the last time I saw those poor, poor children.'\n\n*\\*She glares sadly out the window before she out of nowhere puts on a weird smile and waves goodbye\\**",
		questKeySequence: ["Grassy Plains", "childSupport"],

		// Returns false if the quest description is shown, or true if the quest is being completed
		execute: async function(user) {
			const questResponse = questHelper(user, this.name);
			if(!questResponse) return false;

			// Does user have the pre-req?
			if(!(user.army.units.barracks.peasant >= 10)) return false;
			if(!(user.army.armory.weapon["bronze sword"] >= 10)) return false;

			// Remove the peasants and weapons!!!!
			user.removeItem(allItems["bronze sword"], false, 10);
			user.addOrRemoveUnits(allUnits["peasant"], -10, true);

			// Get reward
			user.gainManyResources({
				gold: 230,
			});
			user.buyItem({ name: "Large Healing Potion" }, 5);

			user.removeQuest(this.name);

			await user.save();

			return true;
		},
	},
};