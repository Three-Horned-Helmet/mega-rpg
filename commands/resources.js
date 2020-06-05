const displayResources = require("../game/resources/display-resources");

module.exports = {
	name: "resources",
	aliases: ["res"],
	description: "Displays all resources.",
	async execute(message, args, user) {
		const resourcesMessage = displayResources(user);
		// message.channel.send(":yewwood:");

		message.channel.send(resourcesMessage);
	},
};