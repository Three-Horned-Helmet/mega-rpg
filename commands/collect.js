const collectResources = require("../game/collect/collect");

module.exports = {
	name: "collect",
	description: "collect resources from mine and lumbermill.",
	execute(message, args, user) {

		collectResources(user).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};