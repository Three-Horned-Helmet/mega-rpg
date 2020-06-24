const questHandler = require("../game/quest/questHandler");

module.exports = {
	name: "quest",
	description: "Used to get and complete quests. Try `!quest` to get your first quest and type `!quest` when you completed the objective to gain rewards",
	async execute(message, args, user) {
		const questName = args.join(" ");

		questHandler(user, questName).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};