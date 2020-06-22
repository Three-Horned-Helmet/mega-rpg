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
            const questResponse = await questHelper(user, this.name);
            if(!questResponse || !choice) {
                return false;
            }

            const choiceNumber = parseInt(choice[1]);
            // Only 2 answers possible
            if(!(choiceNumber <= 2 && choiceNumber >= 1)) return false;

            user.removeQuest(this.name);

            if(choiceNumber === 1) {
                user.healHero(500);
                user.decreaseBuildingLevel("lumbermill", 1, 1);
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

            await user.save();

            return true;
        },
    },
    findingSaboteurs: {
        name: "Finding the Saboteurs",
        author: "Sindre Heldrup",
        pve: [{
            name: "Forest",
            completed: false,
            chance: 0.25,
        }],
        found: "While following the trail you hear a twig cracking",
        notFound: "You lost track of the footsteps and got lost. Maybe it is better to go back and try again?",
        description: "The footprints lead away from the Lumbermill, and you decide to follow them alone to make sure the lumberjacks were telling the truth and they had nothing to do with destruction. You bring your equipment and set out into the forest.",
        winDescription: "You turn to the noise, quickly drawing your weapon! Walking a step toward the source of the sound you feel a sharp pain at the back of the head. The world turns black as you lose consciousness.",
        objective: "Follow the footsteps into the **Forest**",
        reward: "Oak wood: 30\n",
        questKeySequence: ["Building Quests", "findingSaboteurs"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user, choice) {
            const questResponse = await questHelper(user, this.name);
            if(!questResponse || !choice) {
                return false;
            }

       // Has the user completed the PvE requirements?
       const userQuest = user.quests.find(q => q.name === this.name);
       if(userQuest.pve.find(raid => !raid.completed)) return false;

       // Get reward
       await user.gainManyResources({
           gold: 70,
       });

       // Add next quest
    //    const newQuest = {
    //        name: "Confronting the Bandits",
    //        started: false,
    //        questKeySequence: ["Grassy Plains", "confrontingBandits"],
    //        pve: [{
    //            name: "Confront Bandits",
    //            completed: false,
    //            chance: 1,
    //            unique: true,
    //        }],
    //    };
    //    user.addNewQuest(newQuest);
       user.removeQuest(this.name);

       await user.save();

            return true;
        },
    },
};

// "You wake up by a fire, feeling your hands tied together, but otherwise feeling fine apart from a dull pain at the back of your head. You squint your eyes due to the light emanating from the fire, looking around you. A bunch of what appears to be elves are clustered around you, looking at you with curious eyes.\n\You think: What’s the matter with them, have they never seen a handsome man before.\n\nA voice rises above the murmur from the crowd: 'Bring forth the human'.\n\nYou are brought in front of a tall and slender elf sitting on a wooden throne elevated by a wooden platform. His hair is silver, his eyes shining with wisdom and age, and his body covered with a clothing of green and brown. \n\nHe asks you: 'Why were you out in our wood at the middle of the night Human?'\n\nThree answers spring to your mind:"

const questHelper = async (user, questName) => {
    const quest = user.quests.find(q => q.name === questName);
    if(!quest) return console.error(`Did not find quest '${questName.name}' to user '${user.account.username}'`);

    if(!quest.started) {
        await user.startQuest(questName);
        return false;
    }
    return true;
};
