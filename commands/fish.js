const { handleFish } = require("../game/fish");

module.exports = {
	name: "fish",
	aliases: ["f"],
	description: "Let's the player fish",
	async execute(message, args, user) {
		const result = await handleFish(user);
		return message.channel.send(result);
	},
};
