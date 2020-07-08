const { getWorld } = require("../game/look");

module.exports = {
	name: "look",
	description: "Let's the player look around to see the already explored area",
	execute(message, args, user) {

		const lookArgument = args.join("");

		// easter egg
		if (args.length && ["tits", "boobies", "boobs"].some(xxx=> lookArgument.includes(xxx))) {
			const pairs = ["(o)(o)", "( + )( + )", "(@)(@)", "{ O }{ O }", "(oYo)", "( ^ )( ^ )", "(o)(O)", "(      )  (      )\n (    )    (    ) \n  (  )      (  )  \n    *         *   \n"];
			return message.channel.send(pairs[Math.floor(Math.random() * pairs.length)]);
		}

		const world = getWorld(user);
		return message.channel.send(world);
	},
};