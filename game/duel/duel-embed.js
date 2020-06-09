const Discord = require("discord.js");
const icons = require("../../icons/icons");

const duelEmbed = (user, opponent, battleStats, exp, gold) => {
	const { username } = user.account;
	const { username: oppUsername } = opponent.account;
	const title = `${username} dueled ${oppUsername}`;
    const sideColor = "#45b6fe";
    const { win, losses, uModifier, oModifier, userStats, oppStats } = battleStats;

	const fields = [
		{
			name: `**${win ? username : oppUsername}** won the duel with a margin of ${Math.abs(losses)} units`,
			value: `And won ${gold} gold and the hero earned ${exp} exp`,
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
			value: statsMessage(userStats),
			inline: true,
		},
		{
			name: "Total army",
			value: statsMessage(oppStats),
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

module.exports = duelEmbed;