const User = require("../models/User");
const duelPlayer = require("../game/duel/duel");

module.exports = {
	name: "duel",
	description: "Duel other players",
	async execute(message, args, user) {
        if(args.length === 0) return message.channel.send("You need to apply arguments");
        const opponentUserId = args[0].slice(3, args[0].length - 1);
        const opponent = await User.findOne({ "account.userId":  opponentUserId });

        const response = await duelPlayer(user, opponent, message);

		response.embed ? message.channel.send(response.embed) : message.channel.send(`<@${message.author.id}>: ${response}`);
	},
};