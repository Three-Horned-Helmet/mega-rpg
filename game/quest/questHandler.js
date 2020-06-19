const allQuests = require("./all-quests");

const questHandler = async (user, questName) => {
    // If there are no quests available
    if(user.quests.length === 0) return "You currently have no available quests. You may get new ones when you explore new areas or obtain specific items or building levels";

    // If the user only has one quest available, execute this quest
    if(user.quests.length === 1) {
        return await handleExecuteQuest(user, user.quests[0]);
    }

    // If the user has several quests available and needs an arg
    if(!questName) {
        return showAvailableQuests(user);
    }

    // Is the arg the quest index or name
    let quest;
    if(isNaN(questName)) {
        quest = user.quests.find(q => q.name.toLowerCase() === questName);
    }
    else {
        quest = user.quests[questName];
    }

    if(!quest) return showUnableToFindQuest(user, questName);

    // Handle execute quest
    return await handleExecuteQuest(user, quest);
};

const handleExecuteQuest = async (user, userQuest) => {
    let quest;
    userQuest.questKeySequence.forEach(questKey => {
        quest = quest ? quest[questKey] : allQuests[questKey];
    });

    const questResponse = await quest.execute(user);

    // Show quest description
    if(!questResponse) return showQuestDescription(user, quest);
    else return showQuestRewards(quest);
};

const showQuestDescription = (user, quest) => {
    const msg = `\n\n**__${quest.name}:__**\n\n__Description:__\n${quest.description.replace("%username%", user.account.username)}\n\n__Objective:__\n${quest.objective}\n\n__Rewards__:\n${quest.reward}`;
    return msg;
};

const showQuestRewards = (quest) => {
    const msg = `Congratulations you have completed __${quest.name}__! \n\n${quest.winDescription || ""}\n\n__Rewards:__\n${quest.reward}`;
    return msg;
};

const showAvailableQuests = (user) => {
    let msg = `You have ${user.quests.length} quests available:\n`;
    user.quests.forEach((q, i) => {
        msg += `${i}: ${q.name} ${q.started ? "" : "*(new quest)*"}\n`;
    });

    msg += `\nChoose what quest you want to show: \ne.g. \`!quest ${user.quests[0].name.toLowerCase()}\` or use the index \`!quest 0\`)`;
    return msg;
};


const showUnableToFindQuest = (user, questName) => {
    let msg = "\n*ERROR: You have no quests ";

    if(isNaN(questName)) {
        msg += `named ${questName}. Check that your spelling is correct.*\n\n`;
    }
    else {
        msg += `with index ${questName}. Remember that the first index is **0** and not 1.*\n\n`;
    }

    msg += showAvailableQuests(user);
    return msg;
};


module.exports = questHandler;
