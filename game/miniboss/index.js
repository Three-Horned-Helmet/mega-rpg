const Discord = require("discord.js");
const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getPlaceIcon, getDungeonIcon, getGreenRedIcon, getResourceIcon } = require("../_CONSTS/icons");

const Miniboss = require("../../models/Miniboss");
const User = require("../../models/User");
/* const { calculatePveFullArmyResult } = require("../../combat/combat");
const { generateEmbedPveFullArmy } = require("../../combat/pveEmedGenerator"); */

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

const createMinibossEvent = async (user, discordId) =>{
    const { currentLocation } = user.world;
    const minibossLevel = Object.keys(worldLocations).indexOf(currentLocation);

    const miniboss = new Miniboss({
        name: generateMinibossName(minibossLevel),
        helpers:[discordId, "275359143844642818", "285773285944328193"],
        canKill:true,
    });
    return miniboss.save();
};

// todo, take values from explore _const
const generateMinibossName = level=>{
const lexicon = {
    0:"C'Thun",
    1:"Nameless King",
    2:"Jinpachi",
    3:"Ornstein",
    4:"Baldur",
};
return lexicon[level];
};

const validateHelper = async discordId =>{
    const user = await User.findOne({ "account.userId": discordId }).lean();
    return user.hero.currentHealth > user.hero.health * 0.05;
};

const createMinibossInvitation = (miniboss, user)=>{
const sideColor = "#45b6fe";
const username = user.account.username;
const { currentLocation } = user.world;
const locationIcon = getLocationIcon(currentLocation);
const minibossIcon = getPlaceIcon("miniboss");

    const rules = `\`Army allowed: ${getGreenRedIcon(miniboss.allowArmy)}\`\n \`Miniboss deadly: ${getGreenRedIcon(miniboss.canKill)}\`\n \`Helpers allowed: ${getGreenRedIcon(miniboss.allowHelpers)}\``;
    const rewards = `${getResourceIcon("gold")} \`Gold: ${miniboss.rewards.gold}\`\n 🎓 \`XP: ${miniboss.rewards.xp}\` \n ${getDungeonIcon(miniboss.rewards.dungeonKey)} \` Key: ${miniboss.rewards.dungeonKey}\``;

	const embedInvitation = new Discord.MessageEmbed()
        .setTitle(`A Miniboss has been triggered by ${username}!`)
        .setDescription(`Help to deafeat ${minibossIcon} ${miniboss.name} from ${locationIcon} ${currentLocation} `)
		.setColor(sideColor)
		.addFields(
			{
				name: "Rules",
				value: rules,
				inline: false,
            },
            {
				name: `${miniboss.name}'s reward:`,
				value: rewards,
				inline: false,
			},
		)
		.setFooter(`React with a ${getPlaceIcon("miniboss")} within 20 seconds to participate! (max 10!)`);

	return embedInvitation;
};

const calculateMinibossResult = async (event)=>{
    const users = await User.find({ "account.userId": event.helpers });

    const initiativeTaker = users.filter(u=>{
        return u.account.userId === event.helpers[0];
    });
    const helpers = users.filter(u=>{
        return u.account.userId !== event.helpers[0];
    });

    const chanceForSuccess = (event.helpers.length) + (users[0].hero.rank + 1) / 10;
    const randomNumber = Math.random();
    const numOfHelpers = helpers.length || 1;

    const result = {
            win: false,
            initiativeTaker: initiativeTaker[0],
            helpers: helpers,
            rewards:{
                initiativeTaker:{
                    dungeonKey: event.rewards.dungeonKey,
                    gold: Math.round(event.rewards.gold / 2),
                    xp: Math.round(event.rewards.xp / 2),
                },
                helpers:[],
            },
            damageDealt:{
                initiativeTaker: Math.floor(Math.random() * 90),
                initiativeTakerDead:false,
                helpers:[],
            },
    };
    if (result.damageDealt.initiativeTaker >= result.initiativeTaker.hero.currentHealth) {
        result.damageDealt.initiativeTakerDead = true;
    }
    if (chanceForSuccess < randomNumber) {
        result.win = true;
        await result.initiativeTaker.alternativeGainXp(result.rewards.initiativeTaker.xp);
        await result.initiativeTaker.gainResource(result.rewards.initiativeTaker.gold);
        await result.initiativeTaker.giveDungeonKey(result.rewards.initiativeTaker.dungeonKey);
        helpers.forEach(async h=>{
            const randomHelperXp = Math.round(Math.random() * event.rewards.xp / numOfHelpers);
            const randomHelperGold = Math.round(Math.random() * event.rewards.gold / numOfHelpers);
            const helperName = h.account.username;
            const helperLeveledUp = randomHelperXp + h.hero.currentExp > h.hero.expToNextRank;
            result.rewards.helpers.push({
                randomHelperXp,
                randomHelperGold,
                helperName,
                helperLeveledUp,
            });
            await h.alternativeGainXp(randomHelperXp);
            await h.gainResource(randomHelperGold);
        });
    }
 else {
    await result.initiativeTaker.heroHpLossFixedAmount(result.damageDealt.initiativeTaker);

    helpers.forEach(async h=>{
        const randomHelperDamage = Math.round(Math.random() * 50) ;
        const helperDead = h.hero.currentHealth - randomHelperDamage <= 0;
        result.rewards.helpers.push({
            randomHelperDamage,
            helperDead,
        });
        await h.heroHpLossFixedAmount(randomHelperDamage);
    });
    }

    return result;
};
const createMinibossResult = (result, minibossEvent)=>{
    if (result.win) {
        return createMiniBossResultWin(result, minibossEvent);
    }
    return createMiniBossResultLoss(result, minibossEvent);
};

const createMiniBossResultLoss = (result, minibossEvent) =>{
    const sideColor = "#45b6fe";
    const initiativeTaker = result.initiativeTaker.account.username;

    const initiativeTakerDamage = `Lost: ${result.damageDealt.initiativeTaker} HP`;

    const minibossIcon = getPlaceIcon("miniboss");
    const fields = [
        {
            name: `${initiativeTaker}`,
            value: initiativeTakerDamage,
            inline: false,
        },
    ];
    if (result.helpers.length) {
        const helpersValue = result.helpers.map((h, i)=>`${h.account.username}:\n - ${result.rewards.helpers[i].randomHelperDamage}hp ${result.rewards.helpers[i].helperDead ? "💀" : ""}\n\n`);

        fields.push({
            name: "Helpers damage",
            value: helpersValue,
            inline: false,
        });
    }

	const embedResult = new Discord.MessageEmbed()
        .setTitle(`${initiativeTaker} ${result.helpers.length ? "and his helpers" : ""} failed to defeat ${minibossIcon} ${minibossEvent.name} `)
        .setDescription("Damage taken: ")
		.setColor(sideColor)
		.addFields(
			...fields,
		);

    return embedResult;

};


const createMiniBossResultWin = (result, minibossEvent) =>{

    const sideColor = "#45b6fe";
    const initiativeTaker = result.initiativeTaker.account.username;

    let initiativeTakerRewards = `${getResourceIcon("gold")} Gold: ${result.rewards.initiativeTaker.gold} \n\n 🎓XP: ${result.rewards.initiativeTaker.xp}`;
    if (result.rewards.initiativeTaker.dungeonKey) {
        initiativeTakerRewards += `\n\n ${getDungeonIcon(result.rewards.initiativeTaker.dungeonKey)} ${result.rewards.initiativeTaker.dungeonKey} !`;
    }
    const minibossIcon = getPlaceIcon("miniboss");
    const fields = [
        {
            name: `${initiativeTaker} rewards`,
            value: initiativeTakerRewards,
            inline: true,
        },
    ];
    if (result.helpers.length) {
        fields.push({
            name: "Helpers rewards",
            value: result.helpers.map((h, i)=> `${result.rewards.helpers[i].helperName}:\n${getResourceIcon("gold")} Gold: ${result.rewards.helpers[i].randomHelperGold} \n 🎓XP: ${result.rewards.helpers[i].randomHelperXp}${result.rewards.helpers[i].helperLeveledUp ? " 💪" : ""}\n\n`),
            inline: true,
        });
    }

	const embedResult = new Discord.MessageEmbed()
        .setTitle(`${initiativeTaker} ${result.helpers.length ? "and his helpers" : ""} successfuly defeated ${minibossIcon} ${minibossEvent.name} `)
        .setDescription("Rewards will be distributed: ")
		.setColor(sideColor)
		.addFields(
			...fields,
		);

    return embedResult;
        };

module.exports = { minibossStartAllowed, createMinibossEvent, createMinibossInvitation, validateHelper, calculateMinibossResult, createMinibossResult };