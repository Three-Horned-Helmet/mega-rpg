const equipItem = require("../game/equip/equip-item");

module.exports = {
	name: "equip",
	description: "Equip items for your hero",
	execute(message, args, user) {
		const item = args.join(" ");
		if(!item) {
			// Execute show all items here
		}

		equipItem(user, item).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};