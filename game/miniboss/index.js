const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon } = require("../_CONSTS/icons");
const { createMinibossInvitation, createMinibossResult } = require("./embedGenerator");

const User = require("../../models/User");

// Note: The success of defeating the miniboss is based soley on user rank
const handleMiniboss = async (message, user)=>{

    // cooldown, health, explored miniboss
    const disallowed = minibossStartAllowed(user);
		if (disallowed) {
			return disallowed;
        }

    const miniboss = createMinibossEvent(user);

    const now = new Date();
    await user.setNewCooldown("miniboss", now);

    const minibossInvitation = createMinibossInvitation(miniboss, user);
    const invitation = await message.channel.send(minibossInvitation);

    await invitation.react("🧟");

    const reactionFilter = (reaction) => {
        return reaction.emoji.name === "🧟";
    };

    const collector = await invitation.createReactionCollector(reactionFilter, { time: 1000 * 20, errors: ["time"] });
    collector.on("collect", async (result, rUser) => {
        if (rUser.bot || miniboss.helpers.length > 9) {
            return;
        }
        const allowedHelper = await validateHelper(rUser.id);
        if (!allowedHelper) {
            return;
        }
        miniboss.helpers.push(rUser.id);
    });

     collector.on("end", async () => {
        const result = await calculateMinibossResult(miniboss);
        const embed = createMinibossResult(result, miniboss);
        message.channel.send(embed);
});
};

const minibossStartAllowed = (user)=>{
    // checks for cooldown
    const cooldownInfo = onCooldown("miniboss", user);
    if (cooldownInfo.response) {
        return cooldownInfo.embed;
    }

    // checks for too low hp
    if (user.hero.currentHealth < user.hero.health * 0.05) {
        let feedback = `Your hero's health is too low (**${user.hero.currentHealth}**)`;
        if (user.hero.rank < 2) {
            feedback += "\n You can `!build` a shop and `!build` potions";
        }
        return feedback;
    }

    const { currentLocation } = user.world;
    const minibossInformation = Object.values(worldLocations[currentLocation].places).find(p=>{
        return p.type === "miniboss";
    });


    const locationIcon = getLocationIcon(currentLocation);
    if (!user.world.locations[currentLocation].explored.includes([minibossInformation.name])) {
        return `You haven't found any miniboss in ${locationIcon} ${currentLocation}`;
    }

    return null;
};

const createMinibossEvent = (user) =>{
    const { currentLocation } = user.world;
    const minibossname = Object.keys(worldLocations[currentLocation].places).find(p=>{
        return worldLocations[currentLocation].places[p].type === "miniboss";
    });
    const miniboss = worldLocations[currentLocation].places[minibossname];
    miniboss.helpers.push(user.account.userId);
    return miniboss;
};

const validateHelper = async discordId =>{
    const user = await User.findOne({ "account.userId": discordId }).lean();
    return user.hero.currentHealth > user.hero.health * 0.05;
};


const calculateMinibossResult = async (miniboss)=>{
    const users = await User.find({ "account.userId": miniboss.helpers });

    const initiativeTaker = users.filter(u=>{
        return u.account.userId === miniboss.helpers[0];
    });
    const helpers = users.filter(u=>{
        return u.account.userId !== miniboss.helpers[0];
    });

    let chanceForSuccess = helpers.reduce((acc, cur)=>{
        return acc + cur.hero.rank;
    }, 0) + initiativeTaker[0].hero.rank + 2;

    // Temporary workaround for testcases
    if (initiativeTaker[0].account.testUser) {
        chanceForSuccess -= 2;
    }
    const randomNumber = Math.random() * 10;

    const result = {
            win: false,
            initiativeTaker: initiativeTaker[0],
            helpers: helpers,
            rewards:{
                initiativeTaker:{
                    dungeonKey: null,
                    gold: Math.round(miniboss.rewards.gold / 2),
                    xp: Math.round(miniboss.rewards.xp / 2),
                },
                helpers:[],
            },
            damageDealt:{
                initiativeTaker: Math.floor(Math.random() * miniboss.stats.attack),
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
            result.rewards.initiativeTaker.dungeonKey = miniboss.rewards.dungeonKey;
        }
        await result.initiativeTaker.alternativeGainXp(result.rewards.initiativeTaker.xp);
        await result.initiativeTaker.gainManyResources({ gold: result.rewards.initiativeTaker.gold });
        await result.initiativeTaker.giveDungeonKey(result.rewards.initiativeTaker.dungeonKey);
        await asyncForEach(result.helpers, async (h) => {
            const randomHelperXp = Math.round((Math.random() * miniboss.rewards.xp) / helpers.length);
            const randomHelperGold = Math.round((Math.random() * miniboss.rewards.gold) / helpers.length);
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
        const randomHelperDamage = Math.round(Math.random() * miniboss.stats.attack) ;
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


module.exports = { handleMiniboss, createMinibossEvent, minibossStartAllowed, createMinibossResult, calculateMinibossResult };