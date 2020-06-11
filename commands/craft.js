const craftItem = require("../game/craft/craft-item");
const displayCrafts = require("../game/craft/show-available-crafts");
const allItemShortcuts = require("../game/items/all-items-shortcut");

module.exports = {
	name: "craft",
	description: "crafts items",
	shortcuts: allItemShortcuts,
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(displayCrafts(user));

		const item = args.slice(0, args.length - 1).join(" ");
		const amount = Math.floor(args[args.length - 1]);


		craftItem(user, item, amount).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};