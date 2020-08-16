const { getLotteryInformation } = require("../game/lottery");

module.exports = {
	name: "lottery",
	description: "Let's the player get information about the upcoming Lottery (every 24h)",
	async execute(message, args, user) {

		const response = await getLotteryInformation(user);
		return message.channel.send(response);
	},
};