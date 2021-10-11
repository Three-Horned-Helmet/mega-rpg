const craftItem = require("../game/craft/craft-item");
const displayCrafts = require("../game/craft/show-available-crafts");
const allItemShortcuts = require("../game/items/all-items-shortcut");

module.exports = {
	name: "craft",
	description: "Crafts items from the blacksmith, armorer or forge. Try `!build forge` followed by `!craft bronze bar 2` to get started. Type `!craft` to see all of your available crafts.",
	shortcuts: allItemShortcuts,
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(displayCrafts(user));

		const onlyWords = new RegExp(/[a-zA-Z]/);
		const item = args.filter(arg => onlyWords.test(arg)).join(" ");
		const amount = args.filter(Number)[0] || 1;

		craftItem(user, item, parseInt(amount, 10)).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};