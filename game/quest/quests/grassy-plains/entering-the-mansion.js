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
            const newQuests = [{
                name: "Finding Morith",
                started: false,
                questKeySequence: ["Building Quests", "findingMorith"],
                pve: [{
                    name: "Cave",
                    completed: false,
                    chance: 0.2,
                }],
            }];
            const questResponse = questHelper(user, this.name, false, newQuests);
            if(!questResponse) return false;

            // Has the user completed the two quests
            if(!(user.completedQuests.includes("Melting Obsidian")) && !(user.completedQuests.includes("Grethel's Mission"))) return false;

            user.removeQuest(this.name);

            user.save();

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
        found: "While venturing into the Cave you find an old bulky gentalman inspecting some rocks",
        description: "You need to find Morith the Blacksmith, the only smith in the area that is able to craft Obsidian Bars. He is an old bulky man, last seen a few weeks ago.",
        objective: "Find Morith",
        reward: false,
        winDescription: "'Hello there! Are you by any chance Morith the Blacksmith?'\n\n*\\*The old man turned around, clearly baffled by the pressence of others\\**\n\n'Oh hello... Yes, I am Morith, who are you?'\n'I need your help! Ahred needs some Obsidian to craft a key, and he told me you are the only person in this area that knows how to melt Obsidian!'\n\n*\\*Morith sends you a judging look\\**\n\n'It must be a pretty special key he is crafting, huh?'\n\n*\\*You decides to not answer the question and Morith breaks the silence.\\**\n\n'I assume I can help you, but  I need some help from you first!'\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "findingMorith"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;


            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;


            // Get reward
            // await user.gainManyResources({
            //     gold: 300,
            // });

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

            user.save();

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
        winDescription: "You go to inspect the rocks, and there is no doubt Rubinite with its shiny red glimmer and a tint of black. As you head back to Morith you notice that you are in a familiar place. \n\nThere are Mens clothing around the rocky floor, and food in the process of rotting. You take a good look around to see if you can find anything of value. You find some papers with scribings and arrows and it seems to be of a large Courtyard with a building in the middle. You look further around but find nothing of interest and decides to get back to Morith.\n\n*\\*A while later you meet Morith by the entrance of the Cave\\**\n\n'Oh good, you found some Rubinite where did you find it?'\n'I found it by a room in the Cave that seemed abandoned a while ago. Now that you have your Rubinite, will you help me get some Obsidian Bars?'\n'Yes of course, I always keep my promises!'\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "rubinite"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;


            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;


            // Get reward
            // await user.gainManyResources({
            //     gold: 300,
            // });

            // Add next quest
            const newQuest = {
                name: "Moriths Hidden Mine",
                started: false,
                questKeySequence: ["Grassy Plains", "morithsHiddenMine"],
            };

            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            user.save();

            return true;
        },
    },

    morithsHiddenMine: {
        name: "Moriths Hidden Mine",
        description: "",
        objective: "",
        reward: false,
        winDescription: "",
        questKeySequence: ["Grassy Plains", "morithsHiddenMine"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Get reward
            // await user.gainManyResources({
            //     gold: 300,
            // });

            // Add next quest
            // const newQuest = {
            //     name: "Rubinite",
            //     started: false,
            //     questKeySequence: ["Grassy Plains", "rubinite"],
            //     pve: [{
            //         name: "Cave",
            //         completed: false,
            //         chance: 0.25,
            //     }],
            // };

            // user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            user.save();

            return true;
        },
    },
};