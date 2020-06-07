const { consumablesObject } = require("../game/use/consumables-object");

module.exports = {
	name: "use",
	description: "Use any consumables like healing potions.",
	async execute(message, args, user) {
		if(args.length === 0) {
			return message.channel.send("What item do you want to use");
		}

		args = args.map(a => a.charAt(0).toUpperCase() + a.slice(1));

		const item = consumablesObject[args.join(" ")];

		if(item) {
			const response = await item.execute(user, item);
			message.channel.send(response);
		}
		else {
			message.channel.send(`There are no consumables called ${args.join(" ")}`);
		}

	},
};