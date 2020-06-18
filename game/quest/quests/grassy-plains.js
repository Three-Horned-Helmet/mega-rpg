const allItems = require("../../items/all-items");

module.exports = {
    missingDaughter: {
        name: "Missing Daughter",
        area: "Fishing village",
        pve: [{
            name: "Collapsed Mine",
            completed: false,
            chance: 1,
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
            const newQuest = {
                name: "Confronting the Bandits",
                started: false,
                questKeySequence: ["Grassy Plains", "confrontingBandits"],
                pve: [{
                    name: "Confront Bandits",
                    completed: false,
                    chance: 1,
                    unique: true,
                }],
            };

            await user.addNewQuest(newQuest);
            await user.removeQuest(this.name);

            return true;
        },
    },
    confrontingBandits: {
        name: "Confronting the Bandits",
        pve: [{
            name: "Confront Bandits",
            completed: false,
            chance: 1,
            unique: true,
        }],
        description: "You venture deeper into the Collapsed Mine until you hear some noises.\n\nBandit 1: '... must've brought back the little shit. We better get rid of it!'\nBandit 2: 'You mean to kill it?'\nBandit 1: 'I don't see any other choice either, let us do it tonight!'\nBandit 3: 'But are we even able to...'\nBandit 3: 'Shhhh! I think I hear someone out in the hall! HELLO? IS ANYONE THERE?'\n\n*You rapid but quietly move out of the cave*\n\n'There are way too many of them, I better come back with some more men to take them down!', - %username%",
        objective: "Gather your full strength and attack the bandits! (`!raid confront bandits`)",
        reward: "Iron sword: 10",
        winDescription: "%username%: 'WHERE HAVE YOU TAKEN THE LITTLE GIRL?'\nBandit 1: 'What little little girl? What are you talking about?'\n%username%: 'There was a little girl playing around near this Collapsed mine a day ago, and now she is gone! Where have you taken her?\nBandit 1: 'I... I don't know what you are talking about! There has not been anyone around here since we came here a few months ago!'\nBandit 2: 'Yes, we swear! I know we are bandits and all, but we would never take a small girl!'\n%username%: 'Liars!'\nBandit 1: 'Look, there are nothing in here that shows any signs of any girl, alright?'\n\n*You look around the room and notices nothing more than a few pieces of mens clothing and some food*\n\nBandit 3: 'One day ago you said? I may have seen the little girl! I heard a loud scream and when I went to look I noticed a small shadow sliding across the forest! Maybe that was her?'\nBandit 1: 'It must have been! We promise you we have never touched any young girls ever!'\n\n*You decide to believe them, and leave the cave to bring back the terrible news to the Fishing Village*\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "confrontingBandits"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = await questHelper(user, this.name);
            if(!questResponse) {
                const now = new Date();
                const currentLocation = "Grassy Plains";
                const newlyExploredPlaceName = "Confront Bandits";

	            await user.handleExplore(now, currentLocation, newlyExploredPlaceName);

                return false;
            }

            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;

            // Get reward
            await user.addItem(allItems["iron sword"], 10);


            // Add next quest
            const newQuest = {
                name: "Return the Bad News",
                started: false,
                questKeySequence: ["Grassy Plains", "returnBadNews"],
            };

            await user.addNewQuest(newQuest);
            await user.removeQuest(this.name);

            return true;
        },
    },
    returnBadNews: {
        name: "Return the Bad News",
        description: "You need to delive the bad news to the Young Woman in the Fishing Village. Hopefully she will take it alright.",
        objective: "Return to the fishing village (`!quest return the bad news`)",
        reward: "Black Granite Mace: 1",
        winDescription: "'Oh my poor little girl!', *sobs* Young Woman. 'She must be so afraid all by her self in the forest! What can have happened to her... It... It must have been the Bandit King! He was once a nice and honourable man that walked the streets of this very village, until he lost his wife in a terrible accident and disappeared for a few months. By the time he came back he was beyond recognition and has been a monster ever since.\n\nThank you brave warrior for doing what you can to help me. Here take this as a tolken of graditude, it belonged to my father.",
        questKeySequence: ["Grassy Plains", "confrontingBandits"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = await questHelper(user, this.name);
            if(!questResponse) {
                return false;
            }

            // Get reward
            await user.addItem(allItems["black granite mace"], 1);

            await user.removeQuest(this.name);

            return true;
        },
    },
};


const questHelper = async (user, questName) => {
    const quest = user.quests.find(q => q.name === questName);
    if(!quest) return console.error(`Did not find quest '${questName.name}' to user '${user.account.username}'`);

    if(!quest.started) {
        await user.startQuest(questName);
        return false;
    }
    return true;
};