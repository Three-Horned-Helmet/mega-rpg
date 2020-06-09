const Discord = require("discord.js");
const icons = require("../../icons/icons");

const stakeEmbed = (winner, loser, battleStats, exp, item) => {
	const { username } = winner.account;
	const { username: oppUsername } = loser.account;
	const title = `${username} battled against ${oppUsername} and won **${item.split(" ").map(i => i.capitalize()).join(" ")}**!`;
    const sideColor = "#9c2200";
    const { win, winMargin, uModifier, oModifier, winnerStats, loserStats } = battleStats;

	const fields = [
		{
			name: `**${win ? username : oppUsername}** won the duel with a margin of ${Math.abs(winMargin)} units`,
			value: `And won ${item.split(" ").map(i => i.capitalize()).join(" ")} and the hero earned ${exp} exp`,
		},
		{
			name: "\u200B",
			value: "\u200B",
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

	const embedDuel = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	// .setFooter(`PVP: #${pvpRank} ~~~ Total: #${totalRank}`);
	return embedDuel;
};

const statsMessage = (stats) => {
	let message = "";

	for(const stat in stats) {
		message += `${icons[stat]} ${stat.capitalize()}: ${stats[stat]} \n`;
	}

	return message;
};

module.exports = stakeEmbed;