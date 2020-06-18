module.exports = {
    missingDaughter: {
        name: "Missing Daughter",
        area: "Fishing village",
        pve: [{
            name: "Collapsed Mine",
            completed: false,
            chance: 0.5,
        }],
        found: "You found a torn up doll",
        notFound: "You searched around the Collapsed Mine but found no signs of the young womans daughter. Maybe she is futher in?",
        intro: "You found a young lady begging for help in one of the houses of the Village",
        description: "'Please sir! I need your help', Young Woman. 'My daughter is missing! She was playing with her doll close to the Collapsed Mine a day ago. She has always done that, even if I tell her not to go near that dangerous area!'\n\n*The young woman walks up close to you.*\n\n'When I came looking for her, she was nowhere to be found. It is probably these damned bandits staying at the Collapsed Mine, but I don't dare go in there alone. I can only imagine what they will do to a young woman like me.'\n\n*She grabs your arm forcefully!*\n\n'Will you please go looking for her and teach those bandits a lesson in kidnapping! While there, see if you can find any of the other missing kids of the village. There has been several gone missing after those bandits inhabited the Mine.'\n\n*The tears are rolling down her face in despair...* \n**You think to yourself... 'Here comes the rape train!'**",
        objective: "Raid the **Collapsed Mine** until you find any signs of her daughter",
        reward: "Gold: 70\n",
        winDescription: "The torn up doll is for sure belonging to the young womans daughter. You better confront those bandits about the missing children of the village and to bring back the poor little girl to her mother.\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "missingDaughter"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;

            // Get reward
            await user.gainManyResources({
                gold: 70,
            });

            // Add next quest
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