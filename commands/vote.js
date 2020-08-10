const Discord = require("discord.js");
const { getIcon } = require("../game/_CONSTS/icons");

module.exports = {
	name: "vote",
	description: "Players can vote for Mega RPG at top.gg and receive a small bonus",
	async execute(message) {
		const voteEmbed = generateVoteEmbed();
		return message.channel.send(voteEmbed);
	},
};


const generateVoteEmbed = ()=>{
	const carrotIcon = getIcon("carrot");
	const healIcon = getIcon("Large Healing Potion");
	const minibossIcon = getIcon("miniboss");
	const dungeonIcon = getIcon("dungeon");

	const isWeekend = new Date().getDay() % 6 == 0;
	let dungeonInfo = "**Dungeon cooldown reset!**";
	if (!isWeekend) {
		dungeonInfo = `~~ ${dungeonInfo} ~~ | Only available in weekends`;
	}

	const voteEmbed = new Discord.MessageEmbed()

		.setColor("#0099ff")
		.setTitle("Vote for Mega RPG and get rewards!")
		.setDescription(`**1 ${carrotIcon} Carrot**\n **1 ${healIcon} heal potion** \n ${minibossIcon} ** Miniboss cooldown reset** \n ${dungeonIcon} ${dungeonInfo}  `)
		.setURL("https://top.gg/bot/721024429345341560/vote")
		.setFooter("You can vote every 12 hour");
	return voteEmbed;
};