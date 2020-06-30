const { handleHunt } = require("../game/hunt");
const { getPlaceIcon } = require("../game/_CONSTS/icons");

module.exports = {
	name: "hunt",
	description: `Let's the player hunt the previously explored ${getPlaceIcon("hunt")}'hunt areas'`,
	async execute(message, args, user) {
        // trigger captcha 1% of time
		const place = args ? args.split(" ").join("").toLowerCase() : null;
		const result = await handleHunt(user, place);
		return message.channel.send(result);
	},
};