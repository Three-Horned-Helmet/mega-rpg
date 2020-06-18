const allQuests = require("./all-quests");

const checkQuest = async (user, place, currentLocation) => {
    // Does the user have a quest here
    // user.quests.find(q => {
    //     q.pve.find(el => {
    //         console.log(el, place, el.name === place);
    //     });
    // });
    const currentQuest = user.quests.find(q => q.pve.find(raid => raid.name === place && !raid.completed) && q.started);

    if(currentQuest) {
         // Update the objective in the users' quest
         let objectiveFound = false;
        currentQuest.pve = currentQuest.pve.map(pve => {
            // Does this math.random actually work?
            if(pve.chance > Math.random()) {
                objectiveFound = true;
                pve.completed = true;
            }
            return pve;
        });

        // Find the quest in the quest object
        const questObj = Object.values(allQuests[currentLocation]).find(q => q.name === currentQuest.name);

        if(objectiveFound) {
            await user.updateQuestObjective(currentQuest);


             return questObj.found;
        }
         else {
            return questObj.notFound;
        }
     }

    // GETTING A NEW QUEST
    // Is there a quest for the location, and has it been started/found already?
    const quest = Object.values(allQuests[currentLocation]).find(q => q.area === place && !user.completedQuests.includes(q.name) && !user.quests.find(startedQuests => startedQuests.name === q.name));

    if(!quest) return;

    // Add the new quest to the user
    const newQuest = {
        name: quest.name,
        started: false,
        questKeySequence: quest.questKeySequence,
        pve: quest.pve,
    };

    await user.addNewQuest(newQuest);

    return quest.intro;
};

module.exports = { checkQuest };