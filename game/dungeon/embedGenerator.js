const Discord = require("discord.js");
const { getLocationIcon, getStatsIcon, getWeaponIcon, getPlaceIcon, getDungeonKeyIcon, getGreenRedIcon, getResourceIcon } = require("../_CONSTS/icons");

const createDungeonInvitation = (dungeon, user)=>{
    const sideColor = "#45b6fe";
    const username = user.account.username;
    const { currentLocation } = user.world;
    const locationIcon = getLocationIcon(currentLocation);
    const dungeonIcon = getPlaceIcon("dungeon");
        const rules = `${getGreenRedIcon(dungeon.boss.rules.allowArmy)} \`Army allowed\`\n ${getGreenRedIcon(dungeon.boss.rules.canKill)} \`Dungeon deadly\`\n${getGreenRedIcon(dungeon.boss.rules.allowHelpers)} \`Helpers allowed\`\n\n**Unclocks**: ${getLocationIcon(dungeon.boss.unlocks)} **${dungeon.boss.unlocks}**\n`;
        const dungeonStats = `${getStatsIcon("health")} \`Health: ${dungeon.boss.stats.health}\`\n ${getStatsIcon("attack")} \`Attack: ${dungeon.boss.stats.attack}\`\n ${getGreenRedIcon(dungeon.boss.stats.healing)} \`Healing\`\n`;
        const bossRewards = `${getResourceIcon("gold")} \`Gold: ${dungeon.boss.rewards.gold}\`\n ${getResourceIcon("xp")} \`XP: ${dungeon.boss.rewards.xp}\`\n${getGreenRedIcon(dungeon.boss.rewards.drop)} \`Loot drop\`\n\n   `;
        const bossWeapons = dungeon.boss.bossWeapons.map(w=>{
            return `${getWeaponIcon(w)} \`${w}\``;
        });

        const fields = [{
            name: `${dungeon.boss.name}'s Boss stats:`,
            value: dungeonStats,
            inline:true,
        },
        {
            name: `${dungeon.boss.name}'s weapons:`,
            value: bossWeapons,
            inline: true,
        },

        {
            name: "\u200B",
            value: "\u200B",
            inline: false,
        },
        {
            name: "Rules",
            value: rules,
            inline: true,
        },

        {
            name: `${dungeon.boss.name}'s rewards:`,
            value: bossRewards,
            inline: true,
        }];

        const embedInvitation = new Discord.MessageEmbed()
            .setTitle(`${username} is going for the dungeon boss!!`)
            .setDescription(`Help taking out ${dungeonIcon} **${dungeon.boss.name}** in ${locationIcon} ${currentLocation}!`)
            .setColor(sideColor)
            .addFields(
                ...fields,
            )
            .setFooter(`React with a ${getPlaceIcon("dungeon")} within 20 seconds to participate! (max 5!)`);
        return embedInvitation;
    };

    const generateDungeonBossRound = (progress)=>{

        const weapons = progress.dungeon.boss.allowedWeapons;
        /* const weapons = {
            a: { name:"slash", desc: "95% chance of causing up to 1 times the max attack" },
            b: { name: "strike", desc: "80% chance of causing up to 2 times the max attack" },
            c: { name: "critical", desc: "40% chance of causing up to 4 times the max attack" },
            d: { name:"disarm", desc: "25% chance of lowering boss attack" },
            e: { name: "heal", desc: "95% chance of healing teammate with lowest hp" },
        }; */

        const sideColor = "#45b6fe";
        const initiativeTakerName = progress.initiativeTaker.account.username;
        const gangNames = progress.players
            .filter(p=> p.account.username !== initiativeTakerName)
            .map(p=>p.account.username);
        const dungeonName = progress.dungeon.name;
        const dungeonIcon = getPlaceIcon("dungeon");

        const bossName = progress.dungeon.boss.name;

        const dungeonHp = getDungeonHp(progress.dungeon.boss.stats);
        const playersHp = getPlayersHp(progress.players, progress.dungeon.boss.helpers);

        const title = `${dungeonIcon} ${dungeonName} ~~~ BOSS FIGHT`;

        const weaponsTitle = "Choose your weapon:";
        const weaponsOverview = Object.keys(weapons).map(w=>{
            const { answer, name, description } = weapons[w];
            return `${getWeaponIcon(name)} ${answer}) **${name}** ${description}\n`;
        });

        const footer = "TIP: Write your weapon of choice in the chat. eg -> a or c";

        const fields = [
            {
                name: `${bossName} HP:`,
                value: dungeonHp,
                inline: true,
            },
            {
                name: `${initiativeTakerName}'s gang total HP:`,
                value: playersHp,
                inline: true,
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: false,
            },
            {
                name: `${initiativeTakerName}'s gang:`,
                value: gangNames,
                inline: true,
            },
            {
                name: `${weaponsTitle}`,
                value: weaponsOverview,
                inline: true,
            },
        ];

        const embedResult = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription("The castle is too narrow to join with your army and will therefor not help you for the boss fight. Your hero walks into the final room and the door shuts closed. The option of fleeing is no longer available ")
            .setColor(sideColor)
            .addFields(
                ...fields,
            )
            .setFooter(footer);
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

        const getPlayersHp = (players, currentDiscordIds)=>{
            // embed get's messed up if hp bar is longer than 20
            const MAX_REPEATING = 20;
            const totalPlayerHealth = players
                .reduce((acc, curr)=> acc + curr.hero.health, 0);
            const totalPlayerCurrentHealth = players
                .filter(p=> currentDiscordIds.includes(p.account.userId))
                .reduce((acc, curr)=> acc + curr.hero.currentHealth, 0);
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


            module.exports = { createDungeonInvitation, createDungeonResult, generateDungeonBossRound };