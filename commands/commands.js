const Discord = require("discord.js");
const prefix = process.env.DISCORD_PREFIX;

module.exports = {
	name: "commands",
	aliases: ["command", "help", "info"],
	description: "Shows information about either all or specific commands",
	usage: "!commands [command]",
	async execute(message, args) {
		// if no specific command is typed in
		if (!args.length) {
			return message.channel.send(generateCommandEmbed());
		}
		const data = [];
		const { commands } = message.client;

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("that's not a valid command!");
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) {data.push(`**Aliases:** ${command.aliases.join(", ")}`);}
		if (command.description) {data.push(`**Description:** ${command.description}`);}
		if (command.usage) {data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);}

		return message.channel.send(data, { split: true });


	},
};

const generateCommandEmbed = ()=> {
	const allStatisticsCommands = ["army", "cooldowns", "grid", "rank", "resources", "tax", "hero"];
	const allFightingCommands = ["duel [@player]", "dungeon", "hunt", "miniboss", "raid", "stake [@player]", "tower"];
	const allEconomyCommands = ["build", "buy", "dailyPrize", "lottery", "use", "weeklyPrize"];
	const allWorkingCommands = ["collect", "craft", "destroy", "equip", "explore", "look", "produce", "recruit", "travel"];
	const allMiscCommands = ["fish", "race", "quest", "vote", "donate"];

	const inviteUrl = "https://discordapp.com/oauth2/authorize?client_id=721024429345341560&scope=bot&permissions=1074121792";
	const supportServerUrl = "https://discord.gg/BHrHQfs6Mm";
	const patreonUrl = "https://www.patreon.com/megarpg/";

	const links = `[Invite](${inviteUrl} "Invite Mega RPG to your server") | [Support Server](${supportServerUrl} "Join our support server") | [Patreon](${patreonUrl} "Patreon")`;

	const title = "For more info: !help [command]";

	function formatCommands(commands) {
		const formatted = commands.map((c, i)=>{
			const seperator = i !== commands.length - 1 ? ", " : "\n \u200B";
			return `\`!${c}\`${seperator}`;
		});
		const result = formatted.join("");
		return result;
	}

	/* const titleWithIcons = [
		"🎖 Statistics commands 🎖",
		"⚔️ Fighting commands ⚔️",
		"💰 Economy commands 💰",
		"🛠 Working commands 🛠",
		"💡 Misc commands 💡",
	]; */


	const fields = [
		{ name: "Statistics commands", value: formatCommands(allStatisticsCommands), inline: false },
		{ name: "Fighting commands", value: formatCommands(allFightingCommands), inline: false },
		{ name: "Economy commands", value: formatCommands(allEconomyCommands), inline: false },
		{ name: "Working commands", value: formatCommands(allWorkingCommands), inline: false },
		{ name: "Misc commands", value: formatCommands(allMiscCommands), inline: false },
		{ name: "Links", value:links }
	];

	const exampleEmbed = new Discord.MessageEmbed()
		.setColor("#0099ff")
		.setTitle(title)
		.setAuthor("Commands", "https://i.imgur.com/Wury0ZX.png", "https://top.gg/bot/721024429345341560/vote")
		.setThumbnail("https://i.imgur.com/Wury0ZX.png")
		.addFields(...fields);

	return exampleEmbed;

};