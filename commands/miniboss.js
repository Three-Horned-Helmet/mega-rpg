 const { minibossStartAllowed, createMinibossEvent, createMinibossInvitation, validateHelper, calculateMinibossResult, createMinibossResult } = require("../game/miniboss");


module.exports = {
	name: "miniboss",
	description: "Let's the player attack a miniboss",
	async execute(message, args, user) {
// add (args, user)

		// validate
		const disallowed = minibossStartAllowed(user);
		if (disallowed) {
			return message.channel.send(disallowed);
		}

		const minibossEvent = await createMinibossEvent(user, message.author.id);

		const minibossInvitation = createMinibossInvitation(minibossEvent, user);

		const invitation = await message.channel.send(minibossInvitation);
		invitation.react("🧟");

		const filter = (reaction) => {
			return reaction.emoji.name === "🧟";
		};

		const collector = invitation.createReactionCollector(filter, { time: 1000 * 20, errors: ["time"] });
		collector.on("collect", async (result, rUser) => {
			if (rUser.bot) {
				return;
			}
			const allowedHelper = await validateHelper(rUser.id);
			if (!allowedHelper) {
				return;
			}
			await minibossEvent.addUser(rUser.id);
		});
		collector.on("end", async collected => {
			console.warn(collected);
			const result = await calculateMinibossResult(minibossEvent);
			const embed = createMinibossResult(result, minibossEvent);
			message.channel.send(embed);
});


		},
	};