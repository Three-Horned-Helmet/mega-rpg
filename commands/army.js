const displayArmy = require("../game/army/display-army");

module.exports = {
	name: "army",
	description: "Shows your full army and equipment inventory",
	execute(message, args, user) {
		const armyMessage = displayArmy(user);

		message.channel.send(armyMessage);
	},
};