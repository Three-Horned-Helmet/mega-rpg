const { getWorld } = require("../game/look");

module.exports = {
	name: "look",
	description: "Let's the player look around to see the already explored area",
	execute(message, args, user) {

		const lookArgument = args.join("");

		// easter egg
		if (args.length && ["tits", "boobies", "boobs"].some(xxx=> lookArgument.includes(xxx))) {
			const pairs = ["1(o)(o)", "2( + )( + )", "4(@)(@)", "5{ O }{ O }", "6(oYo)", "7( ^ )( ^ )", "8(o)(O)", "(      )  (      )\n (    )    (    ) \n  (  )      (  )  \n    *         *   \n"];
			return message.channel.send(pairs[Math.floor(Math.random() * pairs.length)]);
		}

		const world = getWorld(user);
		return message.channel.send(world);
	},
};