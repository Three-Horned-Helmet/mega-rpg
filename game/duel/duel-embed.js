const Discord = require("discord.js");
const icons = require("../../icons/icons");

const duelEmbed = (user, opponent, battleStats, exp, gold) => {
	const username = `${user.account.username} dueled ${opponent.account.username}`;
    const sideColor = "#45b6fe";
    const { win, losses, uModifier, oModifier, userStats, oppStats } = battleStats;

	const fields = [
		{
			name: `**${win ? user.account.username :
				opponent.account.username}** won the duel with a margin of ${Math.abs(losses)} units`,
			value: `And won ${gold} gold and the hero earned ${exp} exp`,
		},
		{
			name: "\u200B",
			value: "\u200B",
        },
        {
			name: `__${user.account.username}:__`,
			value: "Stats",
            inline:true,
        },
        {
			name: `__${opponent.account.username}:__`,
			value: "Stats",
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
		.setTitle(username)
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