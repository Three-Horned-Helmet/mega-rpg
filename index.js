require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const User = require("./models/User");
// const { handleCaptcha } = require("./game/_GLOBAL_HELPERS/captcha");
const { welcomeMessage, createNewUser } = require("./index-helpers");

const token = process.env.DISCORD_TOKEN;
const prefix = process.env.DISCORD_PREFIX;

const client = new Discord.Client();
client.commands = new Discord.Collection();


// reads all .js files from commands folder
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

// configures commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", async (message) => {
	const { author } = message;
	// doesn't have correct prefix or is bot
	if (!message.content.startsWith(prefix) || author.bot) return;
	// splits the argument to an array eg '!duel @hawkmaster' => ['!','duel','@hawkmaster']
	const args = message.content.slice(prefix.length).split(/ +/).map(a => a.toLowerCase());
	// removes prefix and sets to lowercase
	const commandName = args.shift().toLowerCase();

	// looks for command or the alias of a command
	const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName),);

	// if not found, do nothing
	if (!command) return;

	// if no arguments provided when argument is expected. eg '!duel' (should be '!duel @fenrew')
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${author}!`;

		// returns how to actually use the command
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		// sends the reply
		return message.channel.send(reply);
	}

	// Goes through the args and checks if any of them are shortcuts
	const { shortcuts } = command;
	const updatedArgs = shortcuts ? args.map(a => shortcuts[a] || a).map(a => a.match(/\s/g) ? a.split(" ") : a).flat() : args;

	if(args[0] === "shortcuts") {
		if(shortcuts) {
			const msg = Object.keys(shortcuts).map(shortcut => `**${shortcut}**: ${shortcuts[shortcut]}\n`);
			return author.send(`__The shortcuts for '${command.name}' is:__\n\n${msg.join("\n")}`);
		}
		else {
			return author.send(`There are no shortcuts for '${command.name}'.`);
		}
	}

	let userProfile;
	try{
		userProfile = await User.findOne({ "account.userId": author.id });
	}
	catch (err) {
		console.error("error: ", err);
		message.reply("Something went wrong when trying to find the user");
	}

	// creates new user if not exist
	if (!userProfile) {
		userProfile = await createNewUser(author, message.channel.id);
		message.channel.send(welcomeMessage(userProfile));

		if(!(command.name === "help" || command.name === "info")) {
			return;
		}
	}

	// stops banned players
	if (userProfile.account.banned) {
		return message.reply("You are banned from Mega-RPG. You can plead for an unban at our support servers");
	}

	// temporary out of order
	/* if (Math.random() <= 0.03 && userProfile.account.testUser === false && ["hunt", "collect", "raid", "fish"].includes(command.name)) {
		return handleCaptcha(message, userProfile, 3);
	} */

	// adds command to statistics
	if (Object.keys(userProfile.statistics).includes(command.name)) {
		userProfile.statistics[command.name] += 1;
	}

	// saves the server id
	if (!userProfile.account.servers.includes(message.channel.id)) {
		userProfile.account.servers.push(message.channel.id);
	}

	// executes the command
	{
		try {
			command.execute(message, updatedArgs, userProfile);
		}
		catch (error) {
			console.error(error);
			message.reply("there was an error trying to execute that command!");
		}
	}
});

client.login(token);

// Move somewhere else?
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};