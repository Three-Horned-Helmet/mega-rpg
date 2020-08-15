const { handleRank } = require("../game/rank");


module.exports = {
	name: "rank",
	description: "Shows the best players (top 10) based upon various ranking systems. '!rank server' will give you players from your server",
	usage: "!rank xp",

	async execute(message, args, user) {
		const allowedTypes = ["xp", "elo", "army", "quest", "sfa"];
		const serverKeyWords = ["s", "server", "this"];


		const rankType = args.find(a=> allowedTypes.includes(a)) || "help";
		const onlyServerRanking = args.some(a=> serverKeyWords.includes(a)) ? { "account.servers":message.channel.id } : {};

		const result = await handleRank(rankType, onlyServerRanking, user);


		return message.channel.send(result);
	},
};