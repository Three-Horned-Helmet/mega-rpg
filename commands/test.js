const { pveHero } = require("../combat/combat");
// const User = require("../models/User");

module.exports = {
	name: "test",
	aliases: ["t"],
	description: "Just for testing....",
	async execute(message, args, user) {
		// const opponent = await User.findOne({ "account.userId": "353864320221839373" });
		const { win, lossPercentage, combatModifier } = await pveHero(user, { stats: { health: 100, attack: 100 } });
		message.channel.send(`You ${win ? "won" : "lost"} with a ${lossPercentage}% loss of army battling at a midifier of ${combatModifier}`);
	},
};
