const User = require("../models/User");
const stakePlayer = require("../game/stake/stake");

module.exports = {
	name: "stake",
	description: "Duel other players with stakes. The loser loses a % of the hero exp and an armorer item, while the winner gets the exp and item",
	async execute(message, args, user) {
        if(args.length === 0) return message.channel.send("You need to apply arguments");
        const opponentUserId = args[0].slice(3, args[0].length - 1);
        const opponent = await User.findOne({ "account.userId":  opponentUserId });

        const response = await stakePlayer(user, opponent, message);

		response.embed ? message.channel.send(response.embed) : message.channel.send(`<@${message.author.id}>: ${response}`);
	},
};