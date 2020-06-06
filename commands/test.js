const { pveFullArmy, pvpFullArmy } = require("../combat/combat");
const User = require("../models/User");

module.exports = {
	name: "test",
	aliases: ["t"],
	description: "Just for testing....",
	async execute(message, args, user) {
		const opponent = await User.findOne({ "account.userId": "353864320221839373" });
		const answer = await pvpFullArmy(user, opponent);
		message.channel.send(`${answer.winner.account.username} won, ${answer.loser.account.username} lost`);
	},
};