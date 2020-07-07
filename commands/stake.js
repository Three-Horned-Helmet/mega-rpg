const User = require("../models/User");
const { stakePlayer, getStakes, checkIfStakeIsPossible } = require("../game/stake/stake");
const stakeInvite = require("../game/stake/stake-invite");

module.exports = {
	name: "stake",
	usage: "@player",
	args: true,
	description: "Duel other players with stakes. The loser loses a % of the hero exp and an armorer item, while the winner gets the exp and item",
	async execute(message, args, user) {
		if(args.length === 0) return message.channel.send("You need to apply arguments");
		const opponentUserId = args[0].slice(3, args[0].length - 1);
		const opponent = await User.findOne({ "account.userId":  opponentUserId });

		const answer = checkIfStakeIsPossible(user, opponent);

		if(!answer.response) return message.channel.send(answer.message);

		const stakedItems = [getStakes(user), getStakes(opponent)];

		message.channel.send(stakeInvite(user, opponent, stakedItems)).then(async (msg) => {
			await msg.react("✅");

			const filter = (reaction, reactUser) => {
				if(["✅"].includes(reaction.emoji.name) && reactUser.id === opponent.account.userId) {
					return true;
				}
			};

			msg.awaitReactions(filter, { max: 1, time: 1000 * 60 * 1, errors: ["time"] })
				.then(async (collected) => {
					const reaction = collected.first();

					if (reaction.emoji.name === "✅") {
						msg.reply(`${opponent.account.username} accepted the duel`);
						const updatedUser = await User.findOne({ "account.userId": user.account.userId });
						const updatedOpponent = await User.findOne({ "account.userId": opponent.account.userId });
						const stakeResults = await stakePlayer(updatedUser, updatedOpponent, stakedItems.flat(), message);

						return message.channel.send(stakeResults);
					}
				})
				.catch((error) => {
					console.error(error);
					msg.reply(`Stake declined between ${user.account.username} and ${opponent.account.username}`);
				});
		});

	},

};