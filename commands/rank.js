const { handleRank } = require("../game/rank");


module.exports = {
	name: "rank",
	description: "Shows the best players (top 10) based upon various ranking systems. '!rank server' will give you players from your server",
	usage: "!rank xp",

	async execute(message, args, user) {

		const allowedTypes = ["xp", "elo", "army", "quest", "sfa"];

		const rankType = args.find(a=> allowedTypes.includes(a)) || "help";
		const currentServer = message.channel.id;

		// Exits the function if no server is found on the user
		if (!currentServer) {
			return;
		}

		const result = await handleRank(rankType, currentServer, user);

		return message.channel.send(result);
	},
};