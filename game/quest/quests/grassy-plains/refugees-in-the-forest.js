const allItems = require("../../../items/all-items");
// const allUnits = require("../../../recruit/all-units");

module.exports = {

    // Refugees in the forest
    refugeesInForest: {
        name: "Refugees in the Forest",
        obtaining: {
            area: "Forest",
            chance: 0.4,
        },
        intro: "As you chace a boar deeper into the Forest you come across an encampment.",
        description: "You are greeted by worried looks as you enter the encampment. There are several tents set up across the area, but the people seems to be in rather rough shape. A tall muscular man comes up to you. He has an aggressive look on his face.\n\n'Hello! My name is Isaac, who are you and where do you come from stranger?'\n\nYou hesitate for a few seconds but decides to tell him who you are and where you come from.\n\n'As long as you are no friend of that Bandit King, then you are more then welcome here!'\n\n*\\*His face breaks out in a small but firm smile\\**\n\n'We have fled the tyranny of the Bandit King to start a new life here in the woods. It is a place where people can feel safe, and the children can run freely!'\n\n*\\*He starts to show you around in the encampment\\**\n\n'As you can tell we are in rough shape, the Bandit King took everything from us so we had no choice but to start fresh'\n\n*\\*He turns to you with a worried look\\**\n\n'We could really need your help! It seems like you have a good raw material production going on back in your empire. If you could provide us some lumber and ore, then it would help us build proper homes before the winter!'",
        objective: "Provide the encampment some raw materials\nOak wood: 70\nYew wood: 30\nCopper ore: 50",
        reward: "Leggings of the Dawn: 1",
        winDescription: "'Thank you so much, %username%! These materials will come to good use, we promise you that! I know that you have already done so much for us, but may we ask you for one last favour?\n**A new quest is available**'",
        questKeySequence: ["Grassy Plains", "refugeesInForest"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does user have the pre-req?
            if(!(user.resources["oak wood"] >= 70)) return false;
            if(!(user.resources["yew wood"] >= 30)) return false;
            if(!(user.resources["copper ore"] >= 50)) return false;

            // Remove the peasants and weapons!!!!
            user.removeManyResources({
                "oak wood": 70,
                "yew wood": 30,
                "copper ore": 50,
            });

            // Get reward
            user.addItem(allItems["leggings of the dawn"], 1);

            // Add next quest
            const newQuest = {
                name: "Dealing with Wolves",
                started: false,
                questKeySequence: ["Grassy Plains", "dealingWithWolves"],
                pve: [{
                    name: "Forest",
                    completed: false,
                    chance: 0.33,
                }],
            };
            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },

        dealingWithWolves: {
            name: "Dealing with Wolves",
            found: "You found some fresh Wolf Tracks\n**A new quest is available!**",
            noFound: "You found no signs of the Wolf Pack",
            pve: [{
                name: "Forest",
                completed: false,
                chance: 0.3,
            }],
            description: "'A few days ago one of the women of our encampment got eaten by a ferocious pack of wolves!'\n\n*\\*With a sad look, he stares empty into the Forest. With an effort he continues.\\**'You can imagine how it startled the villager. They are now afraid to walk away from the encampment, which makes it impossible to gather enough food for everyone. After the accident the only person I have seen dare enter the Forest was an older blacksmith who that was heading for the Cave.'\n\n'Please kill the wolf pack, and bring me the alpha male's head'",
            objective: "Kill the Pack of Wolves that is lurking around in the Forest and bring back the head of the Alpha Wolf",
            reward: "Kings Platemail: 1",
            winDescription: "You arrive at the Encampment and show them the Wolf Head.\n\n'You once again saved our people, %username%! We are forever grateful, and if we can ever repay the debt, you tell us!'",
            questKeySequence: ["Grassy Plains", "dealingWithWolves"],

            // Returns false if the quest description is shown, or true if the quest is being completed
            execute: async function(user) {
                const questResponse = questHelper(user, this.name);
                if(!questResponse) return false;

                // Does user have the pre-req?
                const userQuest = user.quests.find(q => q.name === this.name);
                if(userQuest.pve.find(raid => !raid.completed)) return false;

                // Starts a specific quest depending on what quest that has been completed
                if(!user.completedQuests.includes("The Wolf Pack") && !user.quests.find(startedQuests => startedQuests.name === "The Wolf Pack")) {
                    // Add next quest
                    const newQuest = {
                        name: "The Wolf Pack",
                        started: false,
                        questKeySequence: ["Grassy Plains", "wolfPack"],
                        pve: [{
                            name: "The Wolf Pack",
                            completed: false,
                            chance: 1,
                            unique: true,
                        }],
                    };
                    user.addNewQuest(newQuest);
                }
                if(!user.completedQuests.includes("The Wolf Pack")) return;

                if(!user.completedQuests.includes("The Alpha Wolf") && !user.quests.find(startedQuests => startedQuests.name === "The Alpha Wolf")) {
                    // Add next quest
                    const newQuest = {
                        name: "The Alpha Wolf",
                        started: false,
                        questKeySequence: ["Grassy Plains", "alphaWolf"],
                        pve: [{
                            name: "The Alpha Wolf",
                            completed: false,
                            chance: 1,
                            unique: true,
                        }],
                    };
                    user.addNewQuest(newQuest);
                }


                if(!user.completedQuests.includes("The Wolf Pack") && !user.completedQuests.includes("The Alpha Wolf")) return false;
                // Get reward
                {user.addItem(allItems["kings platemail"], 1);}
                user.removeQuest(this.name);

                await user.save();

                return true;
            },
        },

        wolfPack: {
            name: "The Wolf Pack",
            found: "You search among the dead wolves for the Alpha Wolf",
            pve: [{
                name: "Pack of Wolves",
                completed: false,
                chance: 1,
            }],
            description: "You follow the footsteps and very soon you see a Pack of Wolves ahead",
            objective: "Kill the Pack of Wolves",
            reward: false,
            winDescription: "You found no Alpha Wolf among the pack. Better go back to the Forest and search more.",
            questKeySequence: ["Grassy Plains", "wolfPack"],

            // Returns false if the quest description is shown, or true if the quest is being completed
            execute: async function(user) {
                const questResponse = questHelper(user, this.name);
                if(!questResponse) {
                    const now = new Date();
                    const currentLocation = "Grassy Plains";
                    const newlyExploredPlaceName = "Pack of Wolves";

                    await user.handleExplore(now, currentLocation, newlyExploredPlaceName);

                    return false;
                }

                // Does user have the pre-req?
                const userQuest = user.quests.find(q => q.name === this.name);
                if(userQuest.pve.find(raid => !raid.completed)) return false;


                // Refresh the pve hunt in the forest
                user.refreshQuestPve("Dealing with Wolves");

                // Get reward

                user.removeQuest(this.name);

                await user.save();

                return true;
            },
        },

        alphaWolf: {
            name: "The Alpha Wolf",
            found: "You cut off the Alpha Wolf's head to bring back to the encampment",
            pve: [{
                name: "The Alpha Wolf",
                completed: false,
                chance: 1,
            }],
            description: "You follow the footsteps and very soon you see a Pack of Wolves ahead. It is clear that this is the Pack you have been looking for. There is a massive gray Wolf leading the pack through the Forest.",
            objective: "Kill the Alpha Wolf",
            reward: false,
            winDescription: "With the Head of the Alpha Wolf you start heading back to the encampment to show them the Wolf Head.",
            questKeySequence: ["Grassy Plains", "alphaWolf"],

            // Returns false if the quest description is shown, or true if the quest is being completed
            execute: async function(user) {
                const questResponse = questHelper(user, this.name);
                if(!questResponse) {
                    const now = new Date();
                    const currentLocation = "Grassy Plains";
                    const newlyExploredPlaceName = "The Alpha Wolf";

                    await user.handleExplore(now, currentLocation, newlyExploredPlaceName);

                    return false;
                }

                // Does user have the pre-req?
                const userQuest = user.quests.find(q => q.name === this.name);
                if(userQuest.pve.find(raid => !raid.completed)) return false;

                // Get reward

                user.removeQuest(this.name);

                await user.save();

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