const { handleExplore } = require("../game/explore");

module.exports = {
	name: "explore",
	description: "Let's the player explore the surroundings of his level",
	execute(message, args, user) {
		const result = handleExplore(user);
		message.channel.send(result);
	},
};