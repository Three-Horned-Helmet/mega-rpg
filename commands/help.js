/* const prefix = process.env.DISCORD_PREFIX;

module.exports = {
	name: "help",
	description: "List all of my commands or info about a specific command.",
	aliases: ["commands"],
	usage: "[command name]",
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		const { commands } = message.client;
		 if (!args.length) {
			data.push("*You can type `!info` for more detailed info about the game, or `!quest` to start questing*\n");
			data.push("__Here's a list of all my commands:__");
			data.push(commands.map((command) => command.name).join(", "));
			data.push(
				`\nYou can send \`${prefix}help [command name]\` to get info on a specific command or \`!info\` for more info!`,
			);

			return message.author
				.send(data, { split: true })
				.then(() => {
					if (message.channel.type === "dm") return;
					message.reply("I've sent you a DM with all my commands!");
				})
				.catch((error) => {
					console.error(
						`Could not send help DM to ${message.author.tag}.\n`,
						error,
					);
					message.reply("it seems like I can't DM you!");
				});
		}


		const name = args[0].toLowerCase();
		const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("that's not a valid command!");
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) {data.push(`**Aliases:** ${command.aliases.join(", ")}`);}
		if (command.description) {data.push(`**Description:** ${command.description}`);}
		if (command.usage) {data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);}

		message.channel.send(data, { split: true });
	},
};
 */