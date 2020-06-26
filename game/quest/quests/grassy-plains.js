const allItems = require("../../items/all-items");

module.exports = {

    // THE MISSING DAUGHTER SAGA
    missingDaughter: {
        name: "Missing Daughter",
        obtaining: {
            area: "Fishing village",
            chance: 1,
        },
        pve: [{
            name: "Collapsed Mine",
            completed: false,
            chance: 0.33,
        }],
        found: "You found a torn up doll",
        notFound: "You searched around the Collapsed Mine but found no signs of the young womans daughter. Maybe she is futher in?",
        intro: "You found a Young Woman begging for help in one of the houses of the Village",
        description: "'Please sir! I need your help', cried the Young Woman. 'My daughter is missing! She was playing with her doll about a day ago when some of the other kids started making fun of her. She got upset ran away in the direction of the **Collapsed Mine**. I have always told her not to go near that dangerous area! There has been several kids missing after those damned bandits started inhabiting the Mine.'\n\n*\\*The young woman walks up close to you.\\**\n\n'When I came looking for her, she was nowhere to be found. It is probably those damned bandits! They have been staying at the Collapsed Mine for a while now, but I don't dare go in there alone, the Cave is too enormous and I can only imagine what they will do to a young woman like me.'\n\n*\\*She grabs your arm forcefully!\\**\n\n'Will you please go and look for her and if you find those bandits teach them a lesson! My poor, poor, little girl! All by herself, she must be so afraid!'\n\n*\\*The tears are rolling down her face in despair...\\** \n**You think to yourself... 'Here comes the rape train!'**",
        objective: "Raid the **Collapsed Mine** until you find any signs of her daughter",
        reward: "Gold: 70\n",
        winDescription: "The torn up doll must belong to the Young Woman's daughter. You better confront those bandits about the missing children of the village and bring back the poor little girl to her mother.\n**A new quest is available**",
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
            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

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
        found: "*\\*The bandits falls to their knees begging for their lives\\**",
        description: "You venture deeper into the Collapsed Mine until you hear some noises.\n\nBandit 1: '... must've brought back the little shit. We better get rid of it!'\nBandit 2: 'You mean to kill it?'\nBandit 1: 'I don't see any other choice either, let us do it tonight!'\nBandit 3: 'But are we even able to...'\nBandit 3: 'Shhhh! I think I hear someone out in the hall! HELLO? IS ANYONE THERE?'\n\n*\\*You rapid but quietly move out of the cave\\**\n\n'There are way too many of them, I better come back with some more men to take them down!'",
        objective: "Gather your full strength and attack the bandits! (`!raid confront bandits`)",
        reward: "Iron sword: 10",
        winDescription: "%username%: 'WHERE HAVE YOU TAKEN THE LITTLE GIRL?'\nBandit 1: 'What little girl? What are you talking about?'\n%username%: 'There was a little girl running towards the Collapsed Mine a day ago, and now she is gone! WHERE HAVE YOU TAKEN HER?\nBandit 1: 'I... I don't know what you are talking about! There has not been anyone around here since we came a few months ago!'\nBandit 2: 'Yes, we swear! I know we are bandits and all, but we would never take a little girl!'\n%username%: 'LIARS!'\nBandit 1: 'Look, there are nothing in here that shows any signs of a girl, alright?'\n\n*\\*You look around the room and notices nothing more than a few pieces of mens clothing and some food\\**\n\nBandit 3: 'One day ago you said? I may have seen the little girl! I heard a loud scream and when I went to look I noticed a small shadow sliding across the forest! Maybe that was her?'\nBandit 1: 'It must have been! We promise you we have never touched any young girls ever!'\nBandit 4: '...'\n\n*\\*You decide to believe them, and leave to bring back the terrible news to the Young Lady at the Fishing Village\\**\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "confrontingBandits"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = await questHelper(user, this.name);
            if(!questResponse) {
                const now = new Date();
                const currentLocation = "Grassy Plains";
                const newlyExploredPlaceName = "Confront Bandits";

                user.handleExplore(now, currentLocation, newlyExploredPlaceName);
                await user.save();

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

            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },
    returnBadNews: {
        name: "Return the Bad News",
        description: "You need to deliver the bad news to the Young Woman in the Fishing Village. Hopefully she will take it alright.",
        objective: "Return to the fishing village (`!quest return the bad news`)",
        reward: "Black Granite Mace: 1",
        winDescription: "'Oh my poor little girl!', *\\*sobs\\** Young Woman. 'She must be so afraid all by herself in the forest! What can have happened to her... It... It must have been that damned Bandit King!'\n\n*\\*She got up and her teared up face is red of anger\\**\n\n'He was once a nice and honorable man that walked the streets of this village, until he lost his wife in a terrible accident and disappeared for several months! He suddenly returned one day but was beyond recognition. He started terrorizing the the village, and no one has been able to stand up to him since!'\n\n*\\*She grabs a black mace from the wall and falls to the knees in front of you\\**\n\n'Thank you for doing what you can to help me. Here... Take this Mace as a token of gratitude, it once belonged to my father who was a skilled blacksmith. You may have better use for it than me...'\n\n*\\*As you walk out the door you turn around and sees her face once again teared up in hulking in despair on the floor\\**\n\n**You think to yourself: 'What a strange lady'**",
        questKeySequence: ["Grassy Plains", "confrontingBandits"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = await questHelper(user, this.name);
            if(!questResponse) {
                return false;
            }

            // Get reward
            await user.addItem(allItems["black granite mace"], 1);

            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },

    // A FOOLS TREASURE HUNT
    lostMap: {
        name: "A Lost Map",
        obtaining: {
            area: "Bandit Camp",
            chance: 1,
        },
        pve: [{
            name: "Bandit Camp",
            completed: false,
            chance: 0.2,
        }],
        found: "You found the second half of the Treasure Map",
        notFound: "You look around for the second half of the Treasure Map, but found nothing",
        intro: "You searched the encampment and found a **Torn Piece of Paper** with some scriblings on it.",
        description: "After a closer inspection of the paper you notice that it is a worn out piece of a map with directions written on it. Only some of the directions are present as big parts of the map has been torn off. On top of the map it is written *'...mains of the Creat...'* in big red letters, however the rest of the text is unfortuneatly missing.\n\nIt seems like you need the second part of the Map to be able to find what the map directs to.",
        objective: "Raid **Bandit Camp** until you find the missing pieces of the Treasure Map",
        reward: "Treasure Map: 1",
        winDescription: "You successfully patch the pieces together, creating a damaged treasure map.\n\nThe text is still incomplete but shows *'...mains of the Creat...'* and *'...easure no one finds...'*.\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "lostMap"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;

            // Add next quest
            const newQuest = {
                name: "The Lost Hut",
                started: false,
                questKeySequence: ["Grassy Plains", "lostHut"],
                pve: [{
                    name: "Forest",
                    completed: false,
                    chance: 0.25,
                }],
            };
       user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },
    lostHut: {
        name: "The Lost Hut",
        pve: [{
            name: "Forest",
            completed: false,
            chance: 0.25,
        }],
        found: "You found an old hut in the middle of the darkest part of the Forest",
        notFound: "You search around but find no signs of the building",
        description: "The Treasure Map is in very rough shape making it diffcult to read the faded directions. After careful investigation, you figure out it leads to some sort of building deep inside of the **Forest**, however its exact location is not possible to understand.",
        objective: "Search the **Forest** for the building drawn on the map",
        reward: "Oak wood: 15\nYew wood: 15",
        winDescription: "The old hut is in terrible shape, and it is obvious that no one has been taking care of the surrounding overgrowth for years. As you make your way towards the hut you hear noises inside of it. Not human voices, but small screeches and rattle noises. You sneak up to a small dusty window and peak through it.\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "lostMap"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) return false;

            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;

            // Get reward
            await user.gainManyResources({
                ["oak wood"]: 15,
                ["yew wood"]: 15,
            });

            // Add next quest
            const newQuest = {
                name: "A Pack of Implings",
                started: false,
                questKeySequence: ["Grassy Plains", "packOfImplings"],
                pve: [{
                    name: "Pack of Implings",
                    completed: false,
                    chance: 1,
                    unique: true,
                }],
            };
       user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },
    packOfImplings: {
        name: "A Pack of Implings",
        pve: [{
            name: "Pack of Implings",
            completed: false,
            chance: 1,
            unique: true,
        }],
        found: "You enter the main room in the hut",
        description: "The hut is filled with several implings, small vile creatures made by the devil himself! The treasure must be inside of the hut, but there is no way to sneak in unnoticed... \n\nThere is only one solution to get to the treasure!",
        objective: "Defeat the Pack of Implings! (`!hunt pack of implings`)",
        reward: "Gold: 300",
        winDescription: "The dead Implings are soaked in blood and spread across the floor. Exhausted from the battle you start looking around the old hut for signs of the treasure. \n\nThere are scratches along the walls, shattered vials on the shelves and blood stained on the floor. Somehow everything seems burnt... It must've been the implings. Surprisingly, the house has not been burned down.\n\nAs you strafe across the floor you stumble on a piece of wood sticking up from the floor. You lift it up and notice someone has been digging in the dirt underneath.\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "packOfImplings"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) {
                const now = new Date();
                const currentLocation = "Grassy Plains";
                const newlyExploredPlaceName = "Pack of Implings";

                user.handleExplore(now, currentLocation, newlyExploredPlaceName);
                await user.save();

                return false;
            }

            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;

            // Get reward
            await user.gainManyResources({
                gold: 300,
            });

            // Add next quest
            const newQuest = {
                name: "Digging for Treasure",
                started: false,
                questKeySequence: ["Grassy Plains", "diggingForTreasure"],
            };
            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },
    diggingForTreasure: {
        name: "Digging for Treasure",
        description: "The floor is full of mud, ash and stones making digging quite the challenge. You need to craft proper equipment to get anywhere in this rough earth.",
        objective: "Gather 50 iron bars and 30 yew wood to craft digging equipment",
        reward: "Gold: 150",
        winDescription: "With the proper equipment you start digging into the earth. \n\nAs you get deeper, you come across an increasingly amount of what seems to be small bones covered in thick layers of ash. \n\nA lot of sweat later a glimmer of shiny metal emerge from the ashes. You pick up a round, solid Gold Medallion. With a quick stroke, you remove the dirt surrounding it to find some letters engraved into the shiny object. It is a beautiful piece and may be worth some nice gold on the market, but you decide to keep it. \n\nAfter several hours of digging you find nothing but bones and ash. \n\nWith a *sigh* you leave the old hut with nothing but a shiny Golden Medallion engraved with the letters **C.M.**",
        questKeySequence: ["Grassy Plains", "diggingForTreasure"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) {
                return false;
            }

            // Does the user have sufficient resources?
            if(!(user.resources["yew wood"] >= 30)) return false;
            if(!(user.resources["iron bar"] >= 50)) return false;

            // Consume the resources
            await user.removeManyResources({
                "yew wood": 30,
                "iron bar": 50,
            });

            // Get reward
            await user.gainManyResources({
                gold: 150,
            });

            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },

    // THE MYSTERY CAVE
    meetingBugbear: {
        name: "A Meeting with Bugbear",
        obtaining: {
            area: "Cave",
            chance: 0.3,
        },
        intro: "As you venture deeper into the Cave you hear some strange squeals.",
        pve: [{
            name: "Bugbear",
            completed: false,
            chance: 1,
            unique: true,
        }],
        found: "*\\*Bugbear is covered in blood and falls to his knees\\**",
        description: "You silently move closer to the squealing. As you round the corner you see a tall, crooked shadow inspecting a massive rock by the wall. A Goblin! You are surprised by the sight and move slowly away. The slippery stones makes you lose the balance and fall with a lound *\\*crack\\**.\n\n'Yeeek! What do we have here!', *\\*squeeal\\**, 'Is it a puny human disturbing busy Bugbear?' *\\*shriiiek\\** 'What business does a human have in this Cave?'\n\n'I... I was just hunting for Spiders when I heard your squealing!'\n\n'You better leave working Bugbear alone' *\\*reeek\\** 'Little Human is lucky hungry Bugbear is busy, else you would greet the red man! Run now! Leave! Now!' *\\*yiiik\\**\n\n*You take on Bugbears advice and run out of the Cave to greet the warm sunlight outside!*\n\n'What is a dangerous Goblin doing in this area? It can not be safe to let him stay... I need to end him before he starts making mischief!'",
        objective: "Gather your full strength and attack Bugbear! (`!raid bugbear`)",
        reward: "Gold: 300",
        winDescription: "'You... Defeated... Dying Bugbear... I just... Wanted... Stone... The... Smell...'\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "meetingBugbear"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) {
                const now = new Date();
                const currentLocation = "Grassy Plains";
                const newlyExploredPlaceName = "Pack of Implings";

                user.handleExplore(now, currentLocation, newlyExploredPlaceName);
                await user.save();

                return false;
            }

            // Has the user completed the PvE requirements?
            const userQuest = user.quests.find(q => q.name === this.name);
            if(userQuest.pve.find(raid => !raid.completed)) return false;

            // Get reward
            await user.gainManyResources({
                gold: 300,
            });

            // Add next quest
            const newQuest = {
                name: "The Rock",
                started: false,
                questKeySequence: ["Grassy Plains", "theRock"],
            };

            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },
    theRock: {
        name: "The Rock",
        description: "At Bugbears last breath he twitches his muscles to move his arm a little closer to the giant rock he had been intensely observing earlier. \n\nYou move closer to inspect it and notice a round hole that could fit a large coin of some sorts. With the grown mans force you try to move the rock, but it does not bulge. 'I wonder what could be in there...'",
        objective: "Find a way to remove the rock",
        reward: "iron ore: 10",
        winDescription: "You try to put the *C.M.* Gold Medallion into the hole.\n\n\\**Click*\\*\n\n*The large rock starts moving to the side leaving an entrance behind it.*\n\nYou move through the entrance to be amazed by the sight of a large chamber filled with small rotten corpses and all sorts of weaponry.\n**A new quest is available**",
        questKeySequence: ["Grassy Plains", "theRock"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = questHelper(user, this.name);
            if(!questResponse) {
                return false;
            }

            if(!user.completedQuests.includes("Digging for Treasure")) return false;

            // Get reward
            await user.gainManyResources({
                "iron ore": 10,
            });

            // Add next quest
            const newQuest = {
                name: "Chamber of Weaponry",
                started: false,
                questKeySequence: ["Grassy Plains", "chamberOfWeaponry"],
            };

            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        },
    },
    chamberOfWeaponry: {
        name: "Chamber of Weaponry",
        description: "As you walk around the chamber you notice the blood stained walls and the stench of rotten flesh. Among the mess you find some valuable artifact items and decides to pick them up. Even though they are very old, they are in perfect condition.",
        objective: "Bring home the treasure.",
        reward: "Gold: 1000\nBauxite Daggers: 1\nThree Horned Helmet: 1",
        winDescription: "You decide to take the valuables and leave the Cave, wondering what the place may have been used for...",
        questKeySequence: ["Grassy Plains", "chamberOfWeaponry"],

        // Returns false if the quest description is shown, or true if the quest is being completed
        execute: async function(user) {
            const questResponse = await questHelper(user, this.name);
            if(!questResponse) {
                return false;
            }

            // Get reward
            await user.gainManyResources({
                "gold": 1000,
            });
            await user.addItem(allItems["bauxite daggers"], 1);
            await user.addItem(allItems["three horned helmet"], 1);

            user.removeQuest(this.name);

            await user.save();

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
