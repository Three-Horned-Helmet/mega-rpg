const Discord = require("discord.js");
const getStats = require("../../combat/calculate-stats");
const { getIcon } = require("../_CONSTS/icons");

const stakeInviteEmbed = (user, opponent, stakedItems) => {
	const { username } = user.account;
	const { username: oppUsername } = opponent.account;
	const title = `${username} is challenging ${oppUsername} to fight with **__STAKES__**`;
	const sideColor = "#9c2200";

	const fields = [
		{
			name: `${username}'s army:`,
			value: statsMessage(getStats(user).totalStats),
			inline: true,
		},
		{
			name: `${oppUsername}'s army:`,
			value: statsMessage(getStats(opponent).totalStats),
			inline: true,
		},
		{
			name: "\u200B",
			value: "\u200B",
			inline: true,
		},
		{
			name: `${username}'s stakes:`,
			value: stakedItems[0].join("\n") || "Missing items to stake",
			inline: true,
		},
		{
			name: `${oppUsername}'s stakes:`,
			value: stakedItems[1].join("\n") || "Missing items to stake",
			inline: true,
		},
		{
			name: "\u200B",
			value: "\u200B",
			inline: true,
		},
		{
			name: "\u200B",
			value: `**__${oppUsername}__** react with ✅ if you accept the stake challenge!`,
		},
	];

	const embedDuel = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	return embedDuel;
};

const statsMessage = (stats) => {
	let message = "";

	for(const stat in stats) {
		message += `${getIcon(stat)} ${stat.capitalize()}: ${stats[stat]} \n`;
	}

	return message;
};

module.exports = stakeInviteEmbed;