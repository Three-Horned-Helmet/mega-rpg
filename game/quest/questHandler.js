const allQuests = require("./all-quests");

const questHandler = async (user, questName) => {
    // If there are no quests available
    if(user.quests.length === 0) return "You currently have no available quests. You may get new ones when you explore new areas or obtain specific items or building levels";

    // If the user only has one quest available, execute this quest
    // Change it to if(user.quests.length === 1) when it has been handled having several active quests
    if(user.quests.length > 0) {
        let quest = "";
        user.quests[0].questKeySequence.forEach(questKey => {
            quest = quest ? quest[questKey] : allQuests[questKey];
        });

        const questResponse = await quest.execute(user);

        // Show quest description
        if(!questResponse) return showQuestDescription(user, quest);
        else return showQuestRewards(quest);
    }

    // If the user has several quests available, but no args is given
    if(!questName) {
        return showAvailableQuests(user);
    }
};

// Change this to an embed
const showQuestDescription = (user, quest) => {
    const msg = `\n\n**__${quest.name}:__**\n\n__Description:__\n${quest.description.replace("%username%", user.account.username)}\n\n__Objective:__\n${quest.objective}\n\n__Rewards__:\n${quest.reward}`;
    return msg;
};

// Change this to an embed
const showQuestRewards = (quest) => {
    const msg = `Congratulations you have completed __${quest.name}__! \n\n${quest.winDescription || ""}\n\n__Rewards:__\n${quest.reward}`;
    return msg;
};

// Change this to an embed
const showAvailableQuests = (user) => {
    let msg = `You have ${user.quests.length} quests available:\n`;
    user.quests.forEach(q => {
        msg += `${q.name}\n`;
    });

    msg += `\nChoose what quest you want to show (e.g. \`!quest ${user.quests[0].name}\``;
    return msg;
};


module.exports = questHandler;
