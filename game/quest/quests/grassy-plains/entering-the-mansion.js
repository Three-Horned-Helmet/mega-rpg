const { questHelper } = require("../../quest-helper");

module.exports = {

    // ENTERING THE MANSION
    enteringMansion: {
        name: "Entering the Mansion",
        obtaining: {
            area: "Mansion Courtyard",
            chance: 1,
        },
        pve: [{
            name: "Fishing Village",
            completed: false,
            chance: 0.5,
        }],
        found: "While looking through the Village for someone who knows how to get into the Mansion, you stumble upon a sign with the text 'Locksmith Ahred'",
        intro: "You try to open the door into the Mansion, but it is locked.",
        description: "With the help of your soldiers you try to open the door into the Masion with brute force, but it does not bulge. It must be stronger forces keeping the door shut. You command your men to surround the Mansion to find an alternative way in, but without any luck.\n\n'There must be someone who knows how to get into the Mansion, but who?'",
        objective: "Find someone who knows how to get into the Mansion",
        reward: "Gold: 300",
        winDescription: "You open the door into the Locksmith and find a tall slim man with a long beard sitting behnd the counter. He seems quite old.\n\n'Good day to you Sir! My name is Ahred, and what brings you to my Locksmith?'\n\n'I was looking for a way to get into the Bandits Mansion and was wondering if you would be able to help out?'\n\n*\\*Ahred meets you with a surprised look\\**'Oooh, so you are going to pick a bone with the Bandit King, huh? It is about time! I may be able to help you out, but it will not be easy!'\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "enteringMansion"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;


            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;


            // Get reward
            await user.gainManyResources({
                gold: 300,
            });

            // Add next quest
            const newQuest = {
                name: "The Key to the Mansion",
                started: false,
                questKeySequence: ["Grassy Plains", "keyToMansion"],
            };

            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            user.save();

            return true;
        },
    },

     // ENTERING THE MANSION
     keyToMansion: {
        name: "The Key to the Mansion",
        description: "",
        objective: "",
        reward: "Key to the Mansion: 1",
        winDescription: "",
        questKeySequence: ["Grassy Plains", "keyToMansion"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;


            // Has the user completed the two quests
            if(!(user.completedQuests.includes("Melting Obsidian")) && !(user.completedQuests.includes("Mirgreth's Mission"))) return false;

            // Get reward
            // await user.gainManyResources({
            //     gold: 300,
            // });

            user.removeQuest(this.name);

            user.save();

            return true;
        },
    },
};