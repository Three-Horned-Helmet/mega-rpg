module.exports = {
    buildMine: {
        name: "Build a Mine",
        description: "Welcome to MEGA RPG, where your goal is to create the largest empire and conquer the world! Now let's get you started!\n\n Your first objective is to __build a mine__ and __collect 5 copper ore__. \n\nYou can build a mine with the command `!build mine` and the mine will passively collect ores depending on the level of the mine. A level 0 mine will collect 1 copper ore per minute, and this ore can be collected with the command `!collect`. Mines are crutial for rapid expansion of the kingdom and in producing an unbeatable army!",
        objective: "Build: Mine level 0\n Collect: 5 Copper Ore",
        reward: "Gold: 20\nCopper Ore: 5",
        questKeySequence: ["gettingStarted", "buildMine"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does the user have a mine
            if(!user.empire.find(b => b.name === "mine")) return false;

            // Does the user have the required copper ore
            if(user.resources["copper ore"] < 5) return false;

            // Get reward
            await user.gainManyResources({
                gold: 20,
                ["copper ore"]: 5,
            });

            // Add next quest
            const newQuest = {
                name: "Build a Lumbermill",
                started: false,
                questKeySequence: ["gettingStarted", "buildLumbermill"],
            };

            await user.addNewQuest(newQuest);
            await user.removeQuest(this.name);

            return true;
        },
    },
    buildLumbermill: {
        name: "Build a Lumbermill",
        description: "You have now set up a production of copper ore, however some buildings, units and items require wood as well to be made. Your next goal is to __build a Lumbermill__ and collect __5 oak wood__. \n\nYou can build a lumbermill with the command `!build lumbermill` and the lumbermill will passively collect wood depending on the level of the lumbermill. A level 0 lumbermill will collect 1 oak wood per minute, and this ore can be collected with the command `!collect`. Lumbermill are crutial for building certain buildings, items or units!",
        objective: "Build: Lumbermill level 0\n Collect: 5 Oak Wood",
        reward: "Gold: 25\nOak Wood: 10",
        questKeySequence: ["gettingStarted", "buildLumbermill"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does the user have a lumbermill
            if(!user.empire.find(b => b.name === "lumbermill")) return false;

            // Does the user have the required copper ore
            if(user.resources["oak wood"] < 5) return false;

            // Get reward
            await user.gainManyResources({
                gold: 25,
                ["oak wood"]: 10,
            });

            // // Add next quest
            // const newQuest = {
            //     name: "Build a Lumbermill",
            //     started: false,
            //     questKeySequence: ["starterQuests", "buildLumbermill"],
            // };

            // await user.addNewQuest(newQuest);
            await user.removeQuest(this.name);

            return true;
        },
    },
};

const questHelper = (user, questName) => {
    const quest = user.quests.find(q => q.name === questName);
    if(!quest) return console.error(`Did not find quest '${questName.name}' to user '${user.account.username}'`);

    if(!quest.started) {
        console.log(quest, "!STARTED");
        user.startQuest(questName);
        return false;
    }
    return true;
};

// module.exports = starterQuests;