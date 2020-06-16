const Discord = require("discord.js");
const { getLocationIcon, getPlaceIcon, getDungeonIcon, getGreenRedIcon, getResourceIcon } = require("../_CONSTS/icons");

const createMinibossInvitation = (miniboss, user)=>{
    const sideColor = "#45b6fe";
    const username = user.account.username;
    const { currentLocation } = user.world;
    const locationIcon = getLocationIcon(currentLocation);
    const minibossIcon = getPlaceIcon("miniboss");

        const rules = `\`Army allowed: ${getGreenRedIcon(miniboss.rules.allowArmy)}\`\n \`Miniboss deadly: ${getGreenRedIcon(miniboss.rules.canKill)}\`\n \`Helpers allowed: ${getGreenRedIcon(miniboss.rules.allowHelpers)}\``;
        const rewards = `${getResourceIcon("gold")} \`Gold: ${miniboss.rewards.gold}\`\n ${getResourceIcon("xp")} \`XP: ${miniboss.rewards.xp}\` \n ${getDungeonIcon(miniboss.rewards.dungeonKey)} \` Key: ${miniboss.rewards.dungeonKey}\``;

        const embedInvitation = new Discord.MessageEmbed()
            .setTitle(`A Miniboss has been triggered by ${username}!`)
            .setDescription(`Help to defeat ${minibossIcon} ${miniboss.name} from ${locationIcon} ${currentLocation} `)
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

    const createMinibossResult = (result, minibossEvent)=>{
        if (result.win) {
            return createMiniBossResultWin(result, minibossEvent);
        }
        return createMiniBossResultLoss(result, minibossEvent);
    };

    const createMiniBossResultLoss = (result, minibossEvent) =>{
        const sideColor = "#45b6fe";
        const initiativeTaker = result.initiativeTaker.account.username;

        const initiativeTakerDamage = `-${result.damageDealt.initiativeTaker} HP`;

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

        let initiativeTakerRewards = `${getResourceIcon("gold")} Gold: ${result.rewards.initiativeTaker.gold} \n\n ${getResourceIcon("xp")} XP: ${result.rewards.initiativeTaker.xp}`;
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
                value: result.helpers.map((h, i)=> `${result.rewards.helpers[i].helperName}:\n${getResourceIcon("gold")} Gold: ${result.rewards.helpers[i].randomHelperGold} \n ${getResourceIcon("xp")} XP: ${result.rewards.helpers[i].randomHelperXp}${result.rewards.helpers[i].helperLeveledUp ? " 💪" : ""}\n\n`),
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


            module.exports = { createMinibossInvitation, createMinibossResult };