const craftItem = require("../game/craft/craft-item");

module.exports = {
	name: "craft",
	description: "crafts items",
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send("You need to apply arguments");

		const item = args.slice(0, args.length - 1).join(" ");
		const amount = Math.floor(args[args.length - 1]);


		craftItem(user, item, amount).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};