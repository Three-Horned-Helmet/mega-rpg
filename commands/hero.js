const fs = require("fs");

module.exports = {
	name: "hero",
	description: "All hero commands",
	async execute(message, args, user) {
		const subcommands = fs
			.readdirSync("./commands/subcommands/hero")
			.filter((file) => file.endsWith(".js"));
		if(subcommands.find(subcommand => subcommand.split(".js")[0] === args[0])) {
			const command = require(`./subcommands/hero/${args[0]}`);
			return command.execute(message, args.slice(1), user);
		}
		else {
			// Show hero embed
		}
	},
};