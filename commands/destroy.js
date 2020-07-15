const { destroyHandler } = require("../game/destroy/destroy");

module.exports = {
	name: "destroy",
	aliases: ["remove"],
	description: "Use !destroy to remove a building in your empire. You can either use `!destroy <name>` to destroy the first building with the given name (e.g. `!destroy lumbermill`) or `!destroy <coordinates>` to destroy the building at the specified coordinates (e.g. `!destroy 1.1`)",
	async execute(message, args, user) {
		const building = args.join(" ");

		destroyHandler(user, building).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};