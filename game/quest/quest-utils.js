const allQuests = require("./all-quests");

const checkQuest = async (user, place, currentLocation) => {
    // Is there a quest for the location, and has it been started/found already?
    const quest = Object.values(allQuests[currentLocation]).find(q => q.area === place && !user.completedQuests.includes(q.name) && !user.quests.find(startedQuests => startedQuests.name === q.name));

    if(!quest) return;

    // Add the new quest to the user
    const newQuest = {
        name: quest.name,
        started: false,
        questKeySequence: quest.questKeySequence,
    };

    await user.addNewQuest(newQuest);

    console.log(user.quests, "QUESTS ARRAY");
    return quest.intro;
};

module.exports = { checkQuest };