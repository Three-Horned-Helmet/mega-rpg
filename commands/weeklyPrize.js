const { handleWeekly } = require("../game/weeklyPrize");

module.exports = {
	name: "weeklyprize",
	aliases: ["weekly"],
	description: "Get weekly bonuses!",
	async execute(message, args, user) {
		const result = await handleWeekly(user);
		return message.channel.send(result);
	},
};