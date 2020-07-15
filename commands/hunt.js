const { handleHunt } = require("../game/hunt");
const { getIcon } = require("../game/_CONSTS/icons");

module.exports = {
	name: "hunt",
	description: `Let's the player hunt the previously explored ${getIcon("hunt")}'hunt areas'`,
	shortcuts:{
		c: "Cave",
		f: "Forest",
		h: "Hills",
	},
	async execute(message, args, user) {
		// trigger captcha 1% of time
		const place = args.join("").toLowerCase();
		const result = await handleHunt(user, place);
		return message.channel.send(result);
	},
};