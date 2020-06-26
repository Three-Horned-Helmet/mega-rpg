const { handleExplore } = require("../game/explore");

module.exports = {
	name: "explore",
	description: "Let's the player explore the surroundings of his level",
	async execute(message, args, user) {
		const result = await handleExplore(user);
		return message.channel.send(result);
	},
};