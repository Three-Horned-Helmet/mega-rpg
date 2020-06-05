const { getWorld } = require("../game/look");

module.exports = {
	name: "look",
	description: "Let's the player look around to see the already explored area",
	execute(message, args, user) {

		const world = getWorld(user);
		message.channel.send(world);
	},
};