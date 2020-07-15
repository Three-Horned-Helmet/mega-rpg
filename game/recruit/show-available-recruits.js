const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const allUnits = require("./all-units");

const duelEmbed = (user) => {
	const title = `${user.account.username}'s available recruits with the current level of barracks and archery (usage: \`!recruit unitName\`)`;
	const sideColor = "#45b6fe";
	const fields = [];

	for(const unit in allUnits) {
		if(user.empire.find(b => b.name === allUnits[unit].requirement.building && b.level >= allUnits[unit].requirement.level)) {
			fields.push(addUnitField(allUnits[unit]));
		}
	}

	if(fields.length === 0) {
		fields.push({
			name: "You do not own any buildings that are able to recruit units.",
			value: "Try to build a barracks or an archery to get started: `!build barracks` followed by `!recruit peasant`",
		});
	}

	if((fields.length + 2) % 3) {
		fields.push({
			name: "\u200B",
			value: "\u200B",
			inline: true,
		});
	}

	const embedRecruit = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	return embedRecruit;
};

const addUnitField = (unit) => {
	const field = {
		name: unit.name.capitalize(),
		value: `Costs: \n${statsMessage(unit.cost)} \n Stats: \n${statsMessage(unit.stats)}`,
		inline: true,
	};

	return field;
};

const statsMessage = (stats) => {
	let message = "";

	for(const stat in stats) {
		message += `${getIcon(stat)} ${stat.capitalize()}: ${stats[stat]} \n`;
	}

	return message;
};

module.exports = duelEmbed;