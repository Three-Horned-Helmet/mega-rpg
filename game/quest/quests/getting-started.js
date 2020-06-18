const allUnits = require("../../recruit/all-units");
const allItems = require("../../items/all-items");

module.exports = {
    buildMine: {
        name: "Build a Mine",
        description: "Welcome to MEGA RPG, where your goal is to create the largest empire and conquer the world! Now let's get you started!\n\n Your first objective is to __build a Mine__ and __collect 5 copper ore__. \n\nYou can build a Mine with the command `!build mine` and it will passively collect ores depending on the level of the Mine. A level 0 Mine will collect 1 copper ore per minute, and can be collected with the command `!collect`. Mines are crucial for rapid expansion and in production of an unbeatable army!",
        objective: "Build: Mine level 0\n Collect: 5 Copper Ore",
        reward: "Gold: 20\nCopper Ore: 5",
        winDescription: "A Mine will help you build new structures in your empire!\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "buildMine"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does the user have a mine
            if(!user.empire.find(b => b.name === "mine")) return false;

            // Does the user have the required copper ore
            if(!(user.resources["copper ore"] >= 5)) return false;

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
        description: "You have now set up a production of copper ore, however some buildings, units and items require wood as well to be made. Your next goal is to __build a Lumbermill__ and collect __5 oak wood__. \n\nYou can build a lumbermill with the command `!build lumbermill` and it will passively collect wood depending on the level of the lumbermill. A level 0 lumbermill will collect 1 oak wood per minute, and can be collected with the command `!collect`. Lumbermill are crucial in obtaining certain buildings, items or units!",
        objective: "Build: Lumbermill level 0\n Collect: 5 Oak Wood",
        reward: "Gold: 25\nOak Wood: 10",
        winDescription: "With the Lumbermill set up you are now able to start expanding your kingdom!\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "buildLumbermill"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does the user have a lumbermill
            if(!user.empire.find(b => b.name === "lumbermill")) return false;

            // Does the user have the required copper ore
            if(!(user.resources["oak wood"] >= 5)) return false;

            // Get reward
            await user.gainManyResources({
                gold: 25,
                ["oak wood"]: 10,
            });

            // Add next quest
            const newQuest = {
                name: "Explore your Surroundings",
                started: false,
                questKeySequence: ["gettingStarted", "exploreSurroundings"],
            };

            await user.addNewQuest(newQuest);
            await user.removeQuest(this.name);

            return true;
        },
    },
    exploreSurroundings: {
        name: "Explore your Surroundings",
        description: "You have now successfully started your production in your empire and it is time to explore your empire's surroundings to try and find some nearby sources of income. \n\nYou can explore with the command `!explore` and you will have a chance of finding different areas that you can interact with around your empire",
        objective: "Explore 'River'",
        reward: "Gold: 35\nCopper Ore: 5",
        winDescription: "With the 'River' explored you can go fishing in it with the command `!fish`. This is an excellent source of gold!\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "exploreSurroundings"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Has the user explored River
            if(!user.world.locations["Grassy Plains"].explored.find(area => area === "River")) return false;

            // Get reward
            await user.gainManyResources({
                gold: 35,
                ["copper ore"]: 5,
            });

            // Add next quest
            const newQuest = {
                name: "Build a shop",
                started: false,
                questKeySequence: ["gettingStarted", "buildShop"],
            };

            await user.addNewQuest(newQuest);
            await user.removeQuest(this.name);

            return true;
        },
    },
    buildShop: {
        name: "Build a shop",
        description: "Your hero will lose hp when fighting, and thus needs to get healed back up. To do this you can buy healing potions from a shop. Your goal is to build a shop and buy a small healing potion\n\nYou can build a shop with the command `!build shop`, buy a small heal potion with the command `!buy small heal potion` and use it with the command `!use small heal potion`",
        objective: "Build a shop level 0\nBuy a small heal potion",
        reward: "Gold: 5",
        winDescription: "Make sure to not let your hero die as it will lose experience and possibly ranks\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "buildShop"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does the user have a lumbermill
            if(!user.empire.find(b => b.name === "shop")) return false;

            // Get reward
            await user.gainManyResources({
                gold: 5,
            });

               // Add next quest
               const newQuest = {
                name: "Recruit an Army",
                started: false,
                questKeySequence: ["gettingStarted", "recruitArmy"],
            };

            await user.addNewQuest(newQuest);
            await user.removeQuest(this.name);

            return true;
        },
    },
    recruitArmy: {
        name: "Recruit an Army",
        description: "With the exploration of the nearby areas you will find animals to hunt, hostile encampments, minibosses, dungeons or even new quests areas! To prepare you for the enemies around your empire you will have to recruit an army to deal with these dangers. Your objective is to build a Forge, Blacksmith and Barracks to produce an army that can raid nearby encampments. \n\nYou can build Forge, Blacksmith and Barracks with `!build forge`, `!build blacksmith` and `!build barracks`, respectively. A Forge enables you to can craft bronze bars `!craft bronze bar 1`, Blacksmith can use the bronze bars to craft weaponry `!craft bronze sword 1` and a Barracks can be used to produce soldiers that can use the crafted equipment `!recruit peasant 1`",
        objective: "Craft 10 Bronze Swords\nGet an army of 10 Peasants",
        reward: "Peasant: 5\nBronze Helmet: 5\nBronze Leggings: 5",
        winDescription: "The weaponry is automatically worn by your army so you dont have to worry about that, just make sure you have enough equipment for all your units to improve their fighting capabilities. Don't forget to also build some farms to increase your max population allowing more units to be recruited. With an army well prepared you can `!explore` until you find an encampment to `!raid` and gain valuable resources and experience!",
        questKeySequence: ["gettingStarted", "recruitArmy"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does the user have the enough bronze swords
            if(!(user.army.armory.weapon["bronze sword"] >= 10)) return false;

            // Does the user have the enough peasants
            if(!(user.army.units.barracks.peasant >= 10)) return false;

            // Get reward
            await user.recruitUnits(allUnits["peasant"], 5, true);
            await user.addItem(allItems["bronze helmet"], 5);
            await user.addItem(allItems["bronze leggings"], 5);
            // // Add next quest
            // const newQuest = {
            //     name: "Build a Lumbermill",
            //     started: false,
            //     questKeySequence: ["gettingStarted", "buildLumbermill"],
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
        user.startQuest(questName);
        return false;
    }
    return true;
};

// module.exports = starterQuests;