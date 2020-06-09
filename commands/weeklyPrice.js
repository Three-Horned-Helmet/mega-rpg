const { handleWeekly } = require("../game/weeklyPrice");

module.exports = {
    name: "weeklyprice",
    aliases:["weekly"],
	description: "Get weekly bonuses!",
	async execute(message, args, user) {
		const result = await handleWeekly(user);
		return message.channel.send(result);
	},
};