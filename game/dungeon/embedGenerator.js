const Discord = require("discord.js");
const { getLocationIcon, getStatsIcon, getPlaceIcon, getDungeonIcon, getGreenRedIcon, getResourceIcon } = require("../_CONSTS/icons");

const createDungeonInvitation = (dungeon, user)=>{
    const sideColor = "#45b6fe";
    const username = user.account.username;
    const { currentLocation } = user.world;
    const locationIcon = getLocationIcon(currentLocation);
    const dungeonIcon = getPlaceIcon("dungeon");

        const rules = `\`Army allowed: ${getGreenRedIcon(dungeon.rules.allowArmy)}\`\n \`Dungeon deadly: ${getGreenRedIcon(dungeon.rules.canKill)}\`\n \`Helpers allowed: ${getGreenRedIcon(dungeon.rules.allowHelpers)}\``;
        const dungeonStats = `${getStatsIcon("health")} \`Health: ${dungeon.stats.health}\`\n ${getStatsIcon("attack")} \`Attack: ${dungeon.stats.attack}\`\n Healing: ${getGreenRedIcon(dungeon.stats.healing)}`;
        const rewards = `${getResourceIcon("gold")} \`Gold: ${dungeon.rewards.gold}\`\n ${getResourceIcon("xp")} \`XP: ${dungeon.rewards.xp}\` \n ${getDungeonIcon(dungeon.rewards.dungeonKey)} \` Unclocks: ${getLocationIcon(dungeon.unlocks)} ${dungeon.unlocks}\``;

        const embedInvitation = new Discord.MessageEmbed()
            .setTitle(`${username} is attempting a dungeon!!`)
            .setDescription(`Help taking out ${dungeonIcon} ${dungeon.name} in ${locationIcon} ${currentLocation} `)
            .setColor(sideColor)
            .addFields(
                {
                    name: `${dungeon.name}'s stats:`,
                    value: dungeonStats,
                    inline:true,
                },
                {
                    name: "Rules",
                    value: rules,
                    inline: true,
                },
                {
                    name: `${dungeon.name}'s reward:`,
                    value: rewards,
                    inline: false,
                },
            )
            .setFooter(`React with a ${getPlaceIcon("dungeon")} within 20 seconds to participate! (max 5!)`);
        return embedInvitation;
    };

    const createDungeonResult = (result, dungeon)=>{
        if (result.win) {
            return createMiniBossResultWin(result, dungeon);
        }
        return createMiniBossResultLoss(result, dungeon);
    };

    const createMiniBossResultLoss = (result, dungeon) =>{
        const sideColor = "#45b6fe";
        const initiativeTaker = result.initiativeTaker.account.username;

        const initiativeTakerDamage = `-${result.damageDealt.initiativeTaker} HP`;

        const dungeonIcon = getPlaceIcon("dungeon");
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
            .setTitle(`${initiativeTaker} ${result.helpers.length ? "and his helpers" : ""} failed to defeat ${dungeonIcon} ${dungeon.name} `)
            .setDescription("Damage taken: ")
            .setColor(sideColor)
            .addFields(
                ...fields,
            );

        return embedResult;

    };


    const createMiniBossResultWin = (result, dungeon) =>{

        const sideColor = "#45b6fe";
        const initiativeTaker = result.initiativeTaker.account.username;

        let initiativeTakerRewards = `${getResourceIcon("gold")} Gold: ${result.rewards.initiativeTaker.gold} \n\n ${getResourceIcon("xp")} XP: ${result.rewards.initiativeTaker.xp}`;
        if (result.rewards.initiativeTaker.dungeonKey) {
            initiativeTakerRewards += `\n\n ${getDungeonIcon(result.rewards.initiativeTaker.dungeonKey)} ${result.rewards.initiativeTaker.dungeonKey} !`;
        }
        const dungeonIcon = getPlaceIcon("dungeon");
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
            .setTitle(`${initiativeTaker} ${result.helpers.length ? "and his helpers" : ""} successfuly defeated ${dungeonIcon} ${dungeon.name} `)
            .setDescription("Rewards will be distributed: ")
            .setColor(sideColor)
            .addFields(
                ...fields,
            );
        return embedResult;
        };


            module.exports = { createDungeonInvitation, createDungeonResult };