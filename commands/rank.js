// const { handleRank } = require("../game/rank");


module.exports = {
	name: "rank",
	description: "Shows best players based upon various ranking systems",
	execute(message) {
	/* async execute(message, args, user) {
		const allowedTypes = ["xp", "elo", "army", "quest"];
		let rankType;
		if (allowedTypes.includes(args.join(""))) {
			rankType = args.join("");
		}
		else {
			rankType = "xp";
		}
		const result = await handleRank(rankType, user);


		return message.channel.send(result); */
		return message.channel.send("Rank is under construction and will be deployed first week of Augst");
	},
};