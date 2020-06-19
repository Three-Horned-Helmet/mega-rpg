const Discord = require("discord.js");
const { getLocationIcon, getStatsIcon, getPlaceIcon, getDungeonKeyIcon, getGreenRedIcon, getResourceIcon } = require("../_CONSTS/icons");

const createDungeonInvitation = (dungeon, user)=>{
    const sideColor = "#45b6fe";
    const username = user.account.username;
    const { currentLocation } = user.world;
    const locationIcon = getLocationIcon(currentLocation);
    const dungeonIcon = getPlaceIcon("dungeon");
        const rules = `\`Army allowed: ${getGreenRedIcon(dungeon.rules.allowArmy)}\`\n \`Dungeon deadly: ${getGreenRedIcon(dungeon.rules.canKill)}\`\n \`Helpers allowed: ${getGreenRedIcon(dungeon.rules.allowHelpers)}\`\n`;
        const dungeonStats = `${getStatsIcon("health")} \`Health: ${dungeon.stats.health}\`\n ${getStatsIcon("attack")} \`Attack: ${dungeon.stats.attack}\`\n \`Healing: ${getGreenRedIcon(dungeon.stats.healing)}\`\n`;
        const rewards = `${getResourceIcon("gold")} \`Gold: ${dungeon.rewards.gold}\`\n ${getResourceIcon("xp")} \`XP: ${dungeon.rewards.xp}\`\n\`Loot drop: ${getGreenRedIcon(dungeon.rewards.drop)}\`\n\n   **Unclocks**: ${getLocationIcon(dungeon.unlocks)} **${dungeon.unlocks}**\n`;

        const embedInvitation = new Discord.MessageEmbed()
            .setTitle(`${username} is attempting a dungeon!!`)
            .setDescription(`Help taking out ${dungeonIcon} ${dungeon.name} in ${locationIcon} ${currentLocation}!`)
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

    const generateDungeonRound = (progress)=>{


        const sideColor = "#45b6fe";
        const initiativeTakerName = progress.initiativeTaker.account.username;
        const dungeonName = progress.dungeon.name;
        const dungeonIcon = getPlaceIcon("dungeon");

        const getPlayersHp = (players)=>{
            // embed get's messed up if hp bar is longer than 20
            const MAX_REPEATING = 20;
            const totalPlayerHealth = players.reduce((acc, curr)=> acc + curr.hero.health, 0);
            const totalPlayerCurrentHealth = players.reduce((acc, curr)=> acc + curr.hero.currentHealth, 0);
            const percentageHealth = (totalPlayerCurrentHealth / totalPlayerHealth * 100) * MAX_REPEATING / 100;
            const percentageMissingHealth = MAX_REPEATING - percentageHealth;

            return `\`\`\`diff\n+ ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
        };
        const getDungeonHp = (stats)=>{
            const MAX_REPEATING = 20;
            const percentageHealth = (stats.currentHealth / stats.health * 100) * MAX_REPEATING / 100;
            const percentageMissingHealth = MAX_REPEATING - percentageHealth;

            return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
        };


        const dungeonHp = getDungeonHp(progress.dungeon.stats);
        const playersHp = getPlayersHp(progress.players);

        const title = `${dungeonIcon} ${dungeonName}`;

        const fields = [
            {
                name: `${dungeonName} HP:`,
                value: dungeonHp,
                inline: true,
            },
            {
                name: `${initiativeTakerName}'s gang total HP:`,
                value: playersHp,
                inline: true,
            },
        ];

        const embedResult = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription("Round description ")
            .setColor(sideColor)
            .addFields(
                ...fields,
            );
        return embedResult;
    };


    const createDungeonResult = (result, dungeon)=>{
        if (result.win) {
            return createMiniBossResultWin(result, dungeon);
        }
        return createMiniBossResultLoss(result, dungeon);
    };

    const createMiniBossResultLoss = (message, dungeon) =>{


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
            initiativeTakerRewards += `\n\n ${getDungeonKeyIcon(result.rewards.initiativeTaker.dungeonKey)} ${result.rewards.initiativeTaker.dungeonKey} !`;
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


            module.exports = { createDungeonInvitation, createDungeonResult, generateDungeonRound };