const recruitUnits = require("../game/build/buildings/barracks/recruit-units");

module.exports = {
	name: "recruit",
	description: "recruit commands.",
	execute(message, args, user) {
		console.log("AARRG", args);
		if(args.length === 0) return message.channel.send("You need to apply arguments");

		const unit = args.slice(0, args.length - 1).join(" ");
		const amount = Math.floor(args[args.length - 1]);


		recruitUnits(user, unit, amount).then((response) => {
			message.channel.send(response);
		});
	},
};