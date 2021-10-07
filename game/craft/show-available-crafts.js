const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const allItems = require("../items/all-items");

const craftsEmbed = (user) => {
	const title = `${user.account.username}'s available crafts (usage: \`!craft <itemName> <amount>\`):`;
	const sideColor = "#45b6fe";

	const fields = Object.values(allItems).filter(item => {
		if(!item.requirement || item.towerItem) return false;
		const { building, level } = item.requirement;
		return user.empire.find(b => b.name === building && b.level >= level);
	}).map(item => {
		return addCraftsField(item);
	});

	if(fields.length === 0) {
		fields.push({
			name: "You need a building like blacksmith, armorer or forge to craft items",
			value: "Try `!build forge` followed by `!craft bronze bar 2` to get started",
		});
	}

	if((fields.length + 2) % 3) {
		fields.push({
			name: "\u200B",
			value: "\u200B",
			inline: true,
		});
	}

	const embedCrafts = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	return embedCrafts;
};

const addCraftsField = (item) => {
	const { name, typeSequence, cost, stats } = item;

	const field = {
		name: name.capitalize(),
		value: `${typeSequence[typeSequence.length - 1].capitalize()} \n ${objectMessage(stats)} ${objectMessage(stats) ? "\n" : ""} ${objectMessage(cost)}`,
		inline: true,
	};

	return field;
};

const objectMessage = (costs) => {
	let message = "";

	for(const cost in costs) {
		message += `${getIcon(cost) || ""} ${cost.capitalize()}: ${costs[cost]} \n`;
	}

	return message;
};

module.exports = craftsEmbed;