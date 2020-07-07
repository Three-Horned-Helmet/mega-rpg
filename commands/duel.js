const User = require("../models/User");
const duelPlayer = require("../game/duel/duel");

module.exports = {
	name: "duel",
	usage: "@player",
	args: true,
	description: "A friendly duel against other players. The winner will get some exp and gold depneding on how difficult it was to beat the opponent. More difficult opponents give more exp and gold.",
	async execute(message, args, user) {
		const opponentUserId = args[0].slice(3, args[0].length - 1);
		const opponent = await User.findOne({ "account.userId":  opponentUserId });

		const response = await duelPlayer(user, opponent, message);

		response.embed ? message.channel.send(response.embed) : message.channel.send(`<@${message.author.id}>: ${response}`);
	},
};