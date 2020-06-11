const equipItem = require("../game/equip/equip-item");
const showEquipmentEmbed = require("../game/equip/show-available-equipment");


module.exports = {
	name: "equip",
	description: "Equip items for your hero",
	execute(message, args, user) {
		if(args.length === 0) return message.channel.send(showEquipmentEmbed(user));

		const item = args.join(" ");

		equipItem(user, item).then((response) => {
			message.channel.send(`<@${message.author.id}>: ${response}`);
		});
	},
};