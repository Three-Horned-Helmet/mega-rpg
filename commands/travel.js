const { handleTravel } = require("../game/travel");

module.exports = {
	name: "travel",
	description: "Let's player travel to other locations that has been previously explored",
	async execute(message, args, user) {
		if (!args.length) {
			return message.channel.send("Where do you want to travel to?");
		}
		const location = args.join(" ").toLowerCase();
		const result = await handleTravel(user, location);
		return message.channel.send(result);
	},
};