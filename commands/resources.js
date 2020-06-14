const displayResources = require("../game/resources/display-resources");

module.exports = {
	name: "resources",
	aliases: ["res"],
	description: "Displays all your resources. You can collect more resources by building a mine (ores), lumbermill (wood) or by hunting/raiding/fishing/duel (gold)",
	async execute(message, args, user) {
		const resourcesMessage = displayResources(user);
		// message.channel.send(":yewwood:");

		message.channel.send(resourcesMessage);
	},
};