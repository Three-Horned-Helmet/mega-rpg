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
        hu: "huntsman",
        ar: "archer",
        ra: "ranger",
	},
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(showRecruitsEmbed(user));

		const unit = Math.floor(args[args.length - 1]) ? args.slice(0, args.length - 1).join(" ") : args.slice(0, args.length).join(" ");
		const amount = Math.floor(args[args.length - 1]) || 1;

		recruitUnits(user, unit, amount).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};