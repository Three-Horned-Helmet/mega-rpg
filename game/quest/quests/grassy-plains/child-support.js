module.exports = {

    // CHILD SUPPORT
    childSupport: {
        name: "Child Support",
        obtaining: {
            area: "Fishing village",
            chance: 1,
        },
        intro: "A Strange Woman is standing by an orphan home asking bypassegers for help.",
        description: "'Hello there kind sir! Would you please help me out? I want to become a daycare nanny, however I need some soldiers! May I please borrow yours? They look like fine strong men!'\n\n*\\*You look strangely at her\\**\n\nWhy would she need soldiers to start a daycare center?\n\nShe does not seem affected by the wierd look in your face and continues: 'Would you please lend me some soldiers so I can start a daycare center? I would really like to work with children again!'",
        objective: "Provide the Strange Woman some soldiers:\nPeasants: 15\nBronze swords: 15",
        reward: "Gold: 1000\nLarge Healing Potion: 10",
        winDescription: "She thanks you for the soldiers and you decide to take the opportunity to ask her why she would need them to start a daycare center.\n\n'Well you see...'\n\n*\\*She looks quickly around herself before moving a step closer and lowering her voice\\**\n\n'It is because of HIM'\n'Him who?'\n'You know..'\n'I know who?'\n'The Bandit King!'\n'Oh, him who...'\n'I once had a magnificent orphan home here with all the orphan children of the village, supported by Julius Banethus himself! This was before he got the nickname The Bandit King. He was once a young, handsome and generous king, supporting the Villages.'\n\n*\\*She stares out the window with an empty look in her for several minutes until she snaps out of it and continues\\**\n\n'After the unfortunate accident, kids from the village started disappearing. One day where as many as three children went missing, and Julius came down to me in person. He told me that the whole situation was out of control and that he wanted to bring the orphan children back to his Castle, as there are better protection for them there!'\n\n'I did not want to do it, but he managed to convince me otherwise... He seemed so good-hearted back then, before he started terrorizing his people... That is the last time I saw those poor, poor children.'\n\n*\\*She glares sadly out her window before she out of nowhere puts on a big smile waves goodbye\\**",
        questKeySequence: ["Grassy Plains", "childSupport"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Does user have the pre-req?
            if(!(user.army.units.barracks.peasant >= 15)) return false;
            if(!(user.army.armory.weapon["bronze sword"] >= 15)) return false;

            // Get reward
            await user.gainManyResources({
                gold: 1000,
            });
            user.buyItem({ name: "Large Heal Potion" }, 5);

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