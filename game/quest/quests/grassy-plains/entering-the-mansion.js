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
        description: "'You know... I once knew Julius Banethus, the person now known as the Bandit King.He used to be an honorable man, who cared about his people! Julius and his wife Migreth used to come by me quite frequently back in the days to get keys crafted, and we ended up becoming quite good friends!'\n\n*\\*A smile appeared accross his face, but when he continued his face turned dark\\**\n\n'This was when Migreth was still alive. She was expecting a child and was going to conceive it out in the Forest where they had a magnificent Cabin together. No one knows what really happened there, but the Cabin got set on fire and Migreth nor the child made it out alive. Poor Julius was devastated and after a while he could not stand it anymore and left the country for a long time. When he came back...'\n\n*\\*He paused and the look on his face was that of a broken man\\**\n\n'Oh well, you told me you wanted that key made, huh? I need a few things for that to happen. First of all I need some Obsidian bars to craft the key, but only Morith the Blacksmith knows the craft, he is an older man, but still very sharp and daring. Unfortuneatly, no one has seen him for quite a while so you better get prepared for a little searching\nSecondly, I need the key Mold. This one will also be a bit tricky, but you can talk with Grethel, she may know how to get it. Good luck!'\n\n*\\*You thank the Blacksmith and leaves the blacksmith\\**\n**Two new quests are available**",
        objective: "Get the Key Mold and the Obsidian bars",
        reward: "Key to the Mansion: 1",
        winDescription: "'Perfect! This is exactly what I need to create the key! Feel free to sit and wait while I carft it.'\n\n*\\*You sat down by an old table in the corner of the house and watched for a few hours while Ahred crafted the key\\**'There we go, this should do it!'\n\n*\\*Ahred hands you the key\\**'Careful, it is still a bit hot!'\n\n*\\*You take the key deeply impressed. It is really a beautiful key!\\**\n\n'Thank you so much for your help, Ahred! If I can ever repay you, please let me know!'\n\n'Oh, don't worry about that! Just remember, I don't know what business you have with the Bandit King, but don't forget that he was once a very king and honorable man, and I believe that man is still there inside of him somewhere!'\n\n*\\*You shake Ahreds hand in gratitude and leave the locksmith with a shiny freshly-made obsidian key. Now it's time to see if it actually works!\\**",
        questKeySequence: ["Grassy Plains", "keyToMansion"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;


            // Has the user completed the two quests
            if(!(user.completedQuests.includes("Melting Obsidian")) && !(user.completedQuests.includes("Grethel's Mission"))) return false;

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