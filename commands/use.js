const consumablesObject = require("../game/use/consumables-object");

module.exports = {
	name: "use",
	description: "Use any consumables like healing potions from your inventory. Type `!army` to see your inventory. Try `!use small heal potion` to use a healing potion. You need a shop to buy more consumables.",
	shortcuts: {
		shp: "small heal potion",
		lhp: "large heal potion",
	},
	async execute(message, args, user) {
		if(args.length === 0) {
			return message.channel.send(`<@${message.author.id}>: What consumable do you want to use? Try \`!use small heal potion\``);
		}

		args = args.map(a => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase());

		const item = consumablesObject[args.join(" ")];

		if(item) {
			const response = await item.execute(user, item);
			return message.channel.send(`<@${message.author.id}>: ${response}`);
		}
		else {
			return message.channel.send(`<@${message.author.id}>: There are no consumables called ${args.join(" ")}`);
		}
	},
};