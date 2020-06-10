const consumablesObject = require("../game/use/consumables-object");

module.exports = {
	name: "use",
	description: "Use any consumables like healing potions from your inventory (!army).",
	shortcuts: {
		shp: "small heal potion",
		lhp: "large heal potion",
	},
	async execute(message, args, user) {
		if(args.length === 0) {
			return message.channel.send(`<@${message.author.id}>: What item do you want to use`);
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