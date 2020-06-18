const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getDungeonIcon } = require("../_CONSTS/icons");
const { createDungeonInvitation, createDungeonResult } = require("./embedGenerator");

const User = require("../../models/User");

// Note: The success of defeating the dungeon is based soley on user rank
const handleDungeon = async (message, user)=>{

    // cooldown, health, explored dungeon
    const disallowed = dungeonStartAllowed(user);
		if (disallowed) {
			return disallowed;
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

    const collector = await invitation.createReactionCollector(reactionFilter, { time: 1000 * 20, errors: ["time"] });
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

    // Checks if user has the correct key
    const requiredDungeonKey = dungeonInformation.requires;
    if (user.hero.dungeonKeys[requiredDungeonKey]) {
        let response = `You try to enter ${dungeonInformation.name}, but you don't have the required ${getDungeonIcon(requiredDungeonKey)} ${requiredDungeonKey} to proceed. `;
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


    if (!user.world.locations[currentLocation].explored.includes([dungeonInformation.name])) {
        return `You haven't found any dungeon in ${locationIcon} ${currentLocation}`;
    }

    return null;
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

const validateHelper = async discordId =>{
    const user = await User.findOne({ "account.userId": discordId }).lean();
    return user.hero.currentHealth > user.hero.health * 0.05;
};

const startDungeonEvent = async (message, dungeon) => {
    const users = await User.find({ "account.userId": dungeon.helpers });
    const playersDiscordIds = users.map(p=> p.account.userId);
    const initiativeTaker = users.filter(u=> u.account.userId === dungeon.helpers[0]);

    // const helpers = users.filter(u=>u.account.userId !== dungeon.helpers[0]);
    // colors https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812

    const progress = {
        win: false,
        playersDiscordIds,
        attempts: 0,
        initiativeTaker: initiativeTaker[0],
        players: users,
        dungeon: dungeon,
        weaponAnswer:new Map(),
    };

    // recursive starts here

    const dungeonRound = createDungeonRound(progress);

    const round = await message.channel.send(dungeonRound);
    const weaponAnswerFilter = ["a", "b", "c", "d", "slash", "strike", "disarm", "heal"];
    const answerLexicon = {
        a: "slash",
        b: "strike",
        c: "disarm",
        d: "heal",
    };
    const filter = (response, user) => {
        // checks for not given answer, includes in the original team and answer is among the accepted answers.
        return progress.weaponAnswer.has(user.id) === false && progress.playerDiscordIds.includes(user.id) && weaponAnswerFilter.some(alternative => alternative === response.content.toLowerCase());
    };

    const collector = await round.awaitMessages(filter, { time: 1000 * 15, errors: ["time"] });
    collector.on("collect", async (result, rUser) => {
        if (rUser.bot || dungeon.helpers.length > 4) {
            return;
        }
        if (result.includes(Object.keys(answerLexicon))) {
            progress.weaponAnswer.set(rUser.id, answerLexicon[result]);
        }
         else {
            progress.weaponAnswer.set(rUser.id, result);
        }
        // if length is something, collection end after timeout
    });

     collector.on("end", async () => {

        // const result = await calculateDungeonResult(dungeon);
        // const embed = createDungeonResult(result, dungeon);
        // message.channel.send(embed);
});
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


module.exports = { handleDungeon, createDungeonEvent, dungeonStartAllowed, createDungeonResult, calculateDungeonResult };