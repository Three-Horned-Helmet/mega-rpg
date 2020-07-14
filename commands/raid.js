const { getIcon } = require("../game/_CONSTS/icons");
const { handleRaid } = require("../game/raid");

module.exports = {
	name: "raid",
	description: `Let's the player hunt the previously explored ${getIcon("raid")}'hunt areas'`,
	async execute(message, args, user) {
		// trigger captcha 1% of time
		const place = args.join("").toLowerCase();
		const result = await handleRaid(user, place);
		return message.channel.send(result);
	},
};
