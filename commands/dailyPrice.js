const { handleDaily } = require("../game/dailyPrice");

module.exports = {
    name: "dailyprice",
    aliases:["daily"],
	description: "Get daily bonuses!",
	async execute(message, args, user) {
		const result = await handleDaily(user);
		return message.channel.send(result);
	},
};