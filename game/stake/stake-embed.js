const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const allItems = require("../items/all-items");
const { getTowerItem } = require("../items/tower-items/tower-item-functions");

const stakeEmbed = (winner, loser, battleStats, exp, item, elo) => {
	const { username } = winner.account;
	const { username: oppUsername } = loser.account;
	const itemName = item.split(" ").map(i => i.capitalize()).join(" ");

	const title = `${username} battled against ${oppUsername} and won **${itemName}**!`;
	const sideColor = "#9c2200";
	const { win, winMargin, uModifier, oModifier, winnerStats, loserStats } = battleStats;

	const footer = `${username} +${elo.eloForWinner.delta} elo\n${oppUsername} ${elo.eloForLoser.delta} elo`;

	const itemObject = allItems[item] || getTowerItem(item);

	const fields = [
		{
			name: `**${win ? username : oppUsername}** won the duel with a margin of ${Math.abs(winMargin)} units`,
			value: `And won ${itemName} and the hero earned ${exp} exp`,
		},
		{
			name: itemName + ":",
			value: statsMessage(itemObject.stats),
		},
		{
			name: "\u200B",
			value: `\`\`\`fix\n${username}:\n\`\`\``,
			inline:true,
		},
		{
			name: "\u200B",
			value: `\`\`\`fix\n${oppUsername}:\n\`\`\``,
			inline:true,
		},
		{
			name: "\u200B",
			value: "\u200B",
			inline:true,
		},
		{
			name: "Battle Modifier",
			value: Math.floor(uModifier * 100) + "%",
			inline: true,
		},
		{
			name: "Battle Modifier",
			value: Math.floor(oModifier * 100) + "%",
			inline: true,
		},
		{
			name: "\u200B",
			value: "\u200B",
			inline:true,
		},
		{
			name: "Total army",
			value: statsMessage(winnerStats),
			inline: true,
		},
		{
			name: "Total army",
			value: statsMessage(loserStats),
			inline: true,
		},
		{
			name: "\u200B",
			value: "\u200B",
			inline:true,
		},
	];

	const embedStake = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		)
		.setFooter(footer);
	return embedStake;
};

const statsMessage = (stats) => {
	let message = "";

	for(const stat in stats) {
		message += `${getIcon(stat)} ${stat.capitalize()}: ${stats[stat]} \n`;
	}

	return message;
};

module.exports = stakeEmbed;