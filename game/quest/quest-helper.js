const questHelper = (user, questName, currentLocation, newlyExploredPlaceName) => {
    const quest = user.quests.find(q => q.name === questName);
    if(!quest) {
        console.error(`Did not find quest '${questName.name}' to user '${user.account.username}'`);
        return false;
    }

    if(!quest.started) {
        user.startQuest(questName);

        // If a new PvM location is required for the quest
        if(currentLocation && newlyExploredPlaceName) {
            const now = new Date();

            user.handleExplore(now, currentLocation, newlyExploredPlaceName);
        }

        user.save();
        return false;
    }
    return true;
};

module.exports = { questHelper };