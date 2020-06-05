const { generateAllCdEmbed } = require("../game/_CONSTS/coolDowns");

module.exports = {
	name: "cooldown",
	aliases: ["cd", "cooldowns"],
	description: "Let's the user see the current cooldowns.",
	execute(message, args, user) {
		const cooldownOverview = generateAllCdEmbed(user);
		message.channel.send(cooldownOverview);
	},
};