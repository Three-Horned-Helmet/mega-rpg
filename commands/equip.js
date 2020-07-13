const equipItem = require("../game/equip/equip-item");
const showEquipmentEmbed = require("../game/equip/show-available-equipment");
const allItemShortcuts = require("../game/items/all-items-shortcut");

module.exports = {
	name: "equip",
	description: "Equip items for your hero. Equipment worn by your hero gives more stats than items used by your army. Make sure you have crafted an item to equip. Try `!equip` to see all your available equipment, or `!equip bronze sword` to equip an item.",
	shortcuts: allItemShortcuts,
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(showEquipmentEmbed(user));

		const item = args.join(" ");

		equipItem(user, item).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};