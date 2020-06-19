const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getDungeonKeyIcon } = require("../_CONSTS/icons");
const { createDungeonInvitation, createDungeonResult, generateDungeonBossRound } = require("./embedGenerator");

const User = require("../../models/User");

// Note: The success of defeating the dungeon is based soley on user rank
const handleDungeon = async (message, user)=>{

    // cooldown, health, explored dungeon
    const disallowed = dungeonStartAllowed(user);
		if (disallowed) {
            return message.channel.send(disallowed);
        }


    const dungeon = createDungeonEvent(user);

    const now = new Date();
    await user.setNewCooldown("dungeon", now);

    const dungeonInvitation = createDungeonInvitation(dungeon, user);
    const invitation = await message.channel.send(dungeonInvitation);
    await invitation.react("🗺");

    const reactionFilter = (reaction) => {
        return reaction.emoji.name === "🗺";
    };

    const collector = await invitation.createReactionCollector(reactionFilter, { time: 1000 * 15, errors: ["time"] });
    collector.on("collect", async (result, rUser) => {
        if (rUser.bot || dungeon.helpers.length > 4) {
            return;
        }
        const allowedHelper = await validateHelper(rUser.id);
        if (!allowedHelper) {
            return;
        }
        dungeon.helpers.push(rUser.id);
        // if helpers length, end collection
    });

     collector.on("end", async () => {
        await startDungeonEvent(message, dungeon);
    });
};

const createDungeonEvent = (user) =>{
    const { currentLocation } = user.world;
    const dungeonName = Object.keys(worldLocations[currentLocation].places).find(p=>{
        return worldLocations[currentLocation].places[p].type === "dungeon";
    });
    const dungeon = worldLocations[currentLocation].places[dungeonName];
    dungeon.helpers.unshift(user.account.userId);
    return dungeon;
};


const startDungeonEvent = async (message, dungeon) => {
    const users = await User.find({ "account.userId": dungeon.helpers });
    const initiativeTaker = users.filter(u=> u.account.userId === dungeon.helpers[0]);

    // const helpers = users.filter(u=>u.account.userId !== dungeon.helpers[0]);

    const progress = {
        win: false,
        earlyfinish: false,
        bossAttempts: 0,
        currentRoom:0,
        initiativeTaker: initiativeTaker[0],
        players: users,
        dungeon: dungeon,
        roundResults:[],
        weaponAnswer:new Map(),
    };

    // recursive starts here

    const result = await createDungeonRound(message, progress);
    // const round = message.channel.send(dungeonRound);

};

const createDungeonRound = async (message, progress)=>{

    const answerLexicon = {
        a: "slash",
        b: "strike",
        c: "critical",
        d: "disarm",
        e: "heal",
    };
    const weaponAnswerFilter = [...Object.keys(answerLexicon), ...Object.values(answerLexicon)];

    // send a nice embed here
    const dungeonRound = generateDungeonBossRound(progress);
    await message.channel.send(dungeonRound);

        const filter = (response) => {
            // checks for not already submitted answer, includes in the original team and answer is among the accepted answers.
            return progress.weaponAnswer.has(response.author.id) === false && progress.dungeon.helpers.includes(response.author.id) && weaponAnswerFilter.some(alternative => alternative === response.content.toLowerCase());
        };

        const collector = await message.channel.createMessageCollector(filter, { time: 1000 * 15, errors: ["time"] });
        collector.on("collect", async (result)=>{
            if (result.author.bot) {
                return;
            }
            const answer = result.content.toLowerCase();
            // adds answer to progress object
            if (Object.keys(answerLexicon).includes(answer)) {
                progress.weaponAnswer.set(result.author.id, answerLexicon[answer]);
            }
            else {
                progress.weaponAnswer.set(result.author.id, answer);
            }
            // stops collecting if all users have answered
            if (progress.weaponAnswer.size >= progress.dungeon.helpers.length) {
                collector.stop();
            }
        });
        collector.on("end", async () => {
            // calculate process and generate strings
            // if length == 0, end
            // if round > 3, end
            // if boss.health <= 0, end

            const result = await calculateDungeonResult(progress);
            console.log("end");
    });
        // if length is something, collection end after timeout

};


const calculateDungeonResult = async (progress)=>{
    progress.weaponAnswer.forEach((weapon, player)=>{
        const playerInfo = progress.players.find(p=>{
            return p.account.userId === player;
        });
        console.log(progress, "progress");
        console.log(weapon, "eapon");
        const weaponInfo = getWeaponInfo(weapon);
        const chance = Math.random();
        if (weaponInfo.chanceforSuccess > chance) {
            if (weaponInfo.type === "attack") {
                const damageInflicted = Math.round(Math.random() * (playerInfo.hero.attack - (playerInfo.hero.attack / 2)) + playerInfo.hero.attack * 2) * weaponInfo * weaponInfo.damage;
                console.log(damageInflicted, "damageInflicted");
            }
        }
    });


    return progress;
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  const dungeonStartAllowed = (user)=>{
    // checks for cooldown
    const cooldownInfo = onCooldown("dungeon", user);
    if (cooldownInfo.response) {
        return cooldownInfo.embed;
    }

    const { currentLocation } = user.world;
    const locationIcon = getLocationIcon(currentLocation);
    const dungeonInformation = Object.values(worldLocations[currentLocation].places).find(p=>{
        return p.type === "dungeon";
    });

    if (!user.world.locations[currentLocation].explored.includes([dungeonInformation.name])) {
        return `You haven't found any dungeon in ${locationIcon} ${currentLocation}`;
    }

    // Checks if user has the correct key
    const requiredDungeonKey = dungeonInformation.requires;
    if (!user.hero.dungeonKeys[requiredDungeonKey]) {
        let response = `You try to enter ${dungeonInformation.name}, but you don't have the required ${getDungeonKeyIcon(requiredDungeonKey)} ${requiredDungeonKey} to proceed. `;
        if (user.hero.rank < 2) {
            response += `Try defeating the dungeon in ${locationIcon} ${currentLocation} to obtain the required dungeon key`;
        }
        return response;
    }


    // checks for too low hp
    {
if (user.hero.currentHealth < user.hero.health * 0.05) {
        let feedback = `Your hero's health is too low (**${user.hero.currentHealth}**)`;
        if (user.hero.rank < 2) {
            feedback += "\n You can `!build` a shop and `!build` potions";
        }
        return feedback;
    }
}
    return null;
};
const validateHelper = async discordId =>{
    const user = await User.findOne({ "account.userId": discordId }).lean();
    return user.hero.currentHealth > user.hero.health * 0.05;
};

const getWeaponInfo = (weapon)=>{
    const lexicon = {
        "slash":{
            type: "attack",
            chanceforSuccess: 0.95,
            damage: 1,
            description: "95% chance of causing up to 1 times the max attack",
        },
        "strike":{
            type: "attack",
            chanceforSuccess: 0.80,
            damage: 2,
            description: "80% chance of causing up to 2 times the max attack",
        },
        "critical":{
            type: "attack",
            chanceforSuccess: 0.40,
            damage: 4,
            description: "40% chance of causing up to 4 times the max attack",
        },
        "disarm":{
            type: "attack",
            chanceforSuccess: 0.25,
            damage: null,
            description: "25% chance of lowering boss attack",
        },
        "heal":{
            type: "heal",
            chanceforSuccess: 0.95,
            damage: null,
            description: "95% chance of healing teammate with lowest hp",
        },
    };
    return lexicon[weapon];
};

module.exports = { handleDungeon, createDungeonEvent, dungeonStartAllowed, createDungeonResult, calculateDungeonResult };