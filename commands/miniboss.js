 /* const { minibossStartAllowed } = require("../game/miniboss"); */

module.exports = {
	name: "miniboss",
	description: "Let's the player attack a miniboss",
	async execute(message) {
// add (args, user)

		// validate
		/* const disallowed = minibossStartAllowed(user);
		if (disallowed) {
			console.log(disallowed)
			return disallowed;
		} */

		// create invitation
		// send invitation

		const invitation = await message.channel.send("miniboss triggered click emoji to help out");
		invitation.react("🧟");

		const filter = (reaction) => {
			return reaction.emoji.name === "🧟";
		};

		const collector = invitation.createReactionCollector(filter, { time: 1000 * 5, errors: ["time"] });
		collector.on("collect", (result, rUser) => {
			console.log(result, rUser);
			// checks if bot

			// collector.stop()
});
		collector.on("end", collected => {
	const reactions = collected.first();
	// grab all users
	// perform miniboss event
	// save to db
	// send back result

	console.log(reactions.users);
			message.channel.send(`This function is not yet done. ${collected.size} people clicked the icon..`);
});


		},
	};