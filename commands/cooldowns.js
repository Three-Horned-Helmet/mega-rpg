const { generateAllCdEmbed } = require("../game/_CONSTS/cooldowns");

module.exports = {
	name: "cooldown",
	aliases: ["cd", "cooldowns"],
	description: "Shows an overview for the current cooldowns ",
	execute(message, args, user) {
		const cooldownOverview = generateAllCdEmbed(user);
		return message.channel.send(cooldownOverview);
	},
};