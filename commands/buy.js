const { handleBuyCommand } = require("../game/buy/buy-item");

module.exports = {
	name: "buy",
	aliases: ["shop"],
	description: "Used to buy items like consumables from the shop.",
	async execute(message, args, user) {
		const response = await handleBuyCommand(args, user);

		message.channel.send(`<@${message.author.id}>'s shop: \n ${response}`);
	},
};