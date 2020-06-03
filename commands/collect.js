const collectResources = require("../game/collect/collect");

module.exports = {
	name: "collect",
	description: "collect resources from mine and lumbermill.",
	execute(message, args, user) {
		const collect = args[0] ? args[0] : "all";

		collectResources(user, collect).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};