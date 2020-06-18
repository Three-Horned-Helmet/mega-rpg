module.exports = {
    missingDaughter: {
        name: "Missing Daughter",
        area: "Fishing village",
        intro: "You found a young lady begging for help in one of the houses of the Village",
        description: "'Please sir! I need your help', Young Woman. \n'My daughter is missing! She was playing close to the Collapsed Mine a day ago. She has always done that, even if I tell her not to go near that dangerous area!'\nThe young woman walked up close to you.\n'When I came looking for her, she was nowhere to be found. It is probably these damned bandits staying at the Collapsed Mine, but I don't dare go in there alone. I can only imagine what they will do to a young woman like me.'\nShe grabs your arm forcefully!\n'Will you please go looking for her and teach those bandits a lesson in kidnapping! While there, see if you can find any of the other missing kids of the village. There has been several gone missing after those bandits inhabited the Mine.'\nThe tears are rolling down her face in despair...",
        objective: "Explore Collapsed Cave and see if you can find any signs of her daughter",
        reward: "Gold: 70\n",
        questKeySequence: ["Grassy Plains", "missingDaughter"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;


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