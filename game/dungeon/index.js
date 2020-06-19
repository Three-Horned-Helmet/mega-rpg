const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getDungeonKeyIcon } = require("../_CONSTS/icons");
const { createDungeonInvitation, createDungeonResult, generateDungeonRound } = require("./embedGenerator");

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

    const collector = await invitation.createReactionCollector(reactionFilter, { time: 1000 * 5, errors: ["time"] });
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
    dungeon.helpers.push(user.account.userId);
    return dungeon;
};


const startDungeonEvent = async (message, dungeon) => {
    const users = await User.find({ "account.userId": dungeon.helpers });
    const initiativeTaker = users.filter(u=> u.account.userId === dungeon.helpers[0]);

    // const helpers = users.filter(u=>u.account.userId !== dungeon.helpers[0]);

    const progress = {
        win: false,
        earlyfinish: false,
        attempts: 0,
        initiativeTaker: initiativeTaker[0],
        players: users,
        dungeon: dungeon,
        weaponAnswer:new Map(),
    };

    // recursive starts here

    const result = await createDungeonRound(message, progress);
    // const round = message.channel.send(dungeonRound);

};

const createDungeonRound = async (message, progress)=>{

    const weaponAnswerFilter = ["a", "b", "c", "d", "slash", "strike", "disarm", "heal"];
    const answerLexicon = {
        a: "slash",
        b: "strike",
        c: "disarm",
        d: "heal",
    };

    // send a nice embed here
    const dungeonRound = generateDungeonRound(progress);
    await message.channel.send(dungeonRound);

        const filter = (response) => {
            // checks for not already submitted answer, includes in the original team and answer is among the accepted answers.
            return progress.weaponAnswer.has(response.author.id) === false && progress.dungeon.helpers.includes(response.author.id) && weaponAnswerFilter.some(alternative => alternative === response.content.toLowerCase());
        };

        const collector = await message.channel.createMessageCollector(filter, { time: 1000 * 5, errors: ["time"] });
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

            console.log("end");
    });
        // if length is something, collection end after timeout

};


const calculateDungeonResult = async (dungeon)=>{
   // const users = await User.find({ "account.userId": dungeon.helpers });

    const result = {
            win: false,
            initiativeTaker: initiativeTaker[0],
            helpers: helpers,
            rewards:{
                initiativeTaker:{
                    dungeonKey: null,
                    gold: Math.round(dungeon.rewards.gold / 2),
                    xp: Math.round(dungeon.rewards.xp / 2),
                },
                helpers:[],
            },
            damageDealt:{
                initiativeTaker: Math.floor(Math.random() * dungeon.stats.attack),
                initiativeTakerDead:false,
                helpers:[],
            },
    };
    if (result.damageDealt.initiativeTaker >= result.initiativeTaker.hero.currentHealth) {
        result.damageDealt.initiativeTakerDead = true;
    }
    if (chanceForSuccess > randomNumber) {
        result.win = true;
        if(result.initiativeTaker.hero.rank >= 2) {
            result.rewards.initiativeTaker.dungeonKey = dungeon.rewards.dungeonKey;
        }
        await result.initiativeTaker.alternativeGainXp(result.rewards.initiativeTaker.xp);
        await result.initiativeTaker.gainManyResources({ gold: result.rewards.initiativeTaker.gold });
        await result.initiativeTaker.giveDungeonKey(result.rewards.initiativeTaker.dungeonKey);
        await asyncForEach(result.helpers, async (h) => {
            const randomHelperXp = Math.round((Math.random() * dungeon.rewards.xp) / helpers.length);
            const randomHelperGold = Math.round((Math.random() * dungeon.rewards.gold) / helpers.length);
            const helperName = h.account.username;
            const helperLeveledUp = randomHelperXp + h.hero.currentExp > h.hero.expToNextRank;
            await h.alternativeGainXp(randomHelperXp);
            await h.gainManyResources({ gold:randomHelperGold });
            result.rewards.helpers.push({
                randomHelperXp,
                randomHelperGold,
                helperName,
                helperLeveledUp,
            });
        });
    }
 else {
    await result.initiativeTaker.heroHpLossFixedAmount(result.damageDealt.initiativeTaker);

    await asyncForEach(result.helpers, async (h)=>{
        const randomHelperDamage = Math.round(Math.random() * dungeon.stats.attack) ;
        const helperDead = h.hero.currentHealth - randomHelperDamage <= 0;
        await h.heroHpLossFixedAmount(randomHelperDamage);
        result.rewards.helpers.push({
            randomHelperDamage,
            helperDead,
        });
    });
    }
    return result;
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

module.exports = { handleDungeon, createDungeonEvent, dungeonStartAllowed, createDungeonResult, calculateDungeonResult };