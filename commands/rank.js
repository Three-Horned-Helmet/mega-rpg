const { handleRank } = require("../game/rank");


module.exports = {
	name: "rank",
	description: "Shows best players based upon various ranking systems",

	async execute(message, args, user) {
		const allowedTypes = ["xp", "elo", "army", "quest", "sfa"];
		const serverKeyWords = ["s", "server", "this"];


		const rankType = args.find(a=> allowedTypes.includes(a)) || "help";
		const onlyServerRanking = args.some(a=> serverKeyWords.includes(a)) ? { "account.servers":message.channel.id } : {};

		const result = await handleRank(rankType, onlyServerRanking, user);


		return message.channel.send(result);
	},
};