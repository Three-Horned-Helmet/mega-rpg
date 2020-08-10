const { getWorld } = require("../game/look");

module.exports = {
	name: "look",
	description: "Let's the player look around to see the already explored area",
	async execute(message, args, user) {

		const world = await getWorld(user);
		return message.channel.send(world);
	},
};