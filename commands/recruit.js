const recruitUnits = require("../game/recruit/recruit-units");
const showRecruitsEmbed = require("../game/recruit/show-available-recruits");

module.exports = {
	name: "recruit",
	description: "Recruitment of units for your army. You need a barracks or archery to recruit units. `!recruit` will show you all your available recruits and `!recruit <unitName` is the usage to recruit units.",
	aliases: ["r"],
	shortcuts: {
		pe: "peasant",
		mi: "militia",
		gu: "guardsman",
		kn: "knight",
		be: "berserker",
		ju: "justicar",
		hu: "huntsman",
		ar: "archer",
		ra: "ranger",
		su: "survivalist",
		sh: "sharpshooter",
	},
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(showRecruitsEmbed(user));

		const onlyWords = new RegExp(/[a-zA-Z]/);
		const unit = args.filter(arg => onlyWords.test(arg))[0];
		const amount = args.filter(Number)[0] || 1;

		recruitUnits(user, unit, parseInt(amount, 10)).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};