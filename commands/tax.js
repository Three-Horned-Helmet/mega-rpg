const { getIcon } = require("../game/_CONSTS/icons");
const { calculateGoldGained } = require("../game/_GLOBAL_HELPERS");
module.exports = {
	name: "tax",
	description: "Shows your current gold income through taxes",

	async execute(message, args, user) {
		const taxOfficeBuilding = user.empire.find(building => building.name === "tax office");
		if (!taxOfficeBuilding) return message.channel.send(`<@${message.author.id}>: You're not collecting taxes at the moment. Try building a tax office!`);
		const goldPerMinute = calculateGoldGained(user, taxOfficeBuilding, new Date());
		return message.channel.send(`<@${message.author.id}>: You're making ${getIcon("gold")}${goldPerMinute.gold} gold per minute through taxes. Type \`!collect\` to collect!`);

	},
};
