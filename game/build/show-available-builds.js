const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const buildingsObj = require("./buildings-object");

const buildingEmbed = (user) => {
	const title = `${user.account.username}'s available buildings (usage: \`!build <buildingName>\`):`;
	const sideColor = "#45b6fe";
	const fields = [];

	for(const building in buildingsObj) {
		const userBuildings = user.empire.filter(b => b.name === buildingsObj[building].name)
			.sort((a, b) => b.level - a.level);
		fields.push(addBuildingField(buildingsObj[building], userBuildings));
	}

	if(fields.length === 0) {
		fields.push({
			name: "An error has occured with displaying buildings",
			value: "\u200B",
		});
	}

	if((fields.length + 2) % 3) {
		fields.push({
			name: "\u200B",
			value: "\u200B",
			inline: true,
		});
	}

	const embedBuilding = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(sideColor)
		.addFields(
			...fields,
		);

	return embedBuilding;
};

const addBuildingField = (building, userBuildings) => {
	const { name, levels } = building;
	const nextLevel = userBuildings[0] ? levels.find(l => userBuildings[0].level + 1 === l.level) : levels[0];
	if(!nextLevel) {
		return {
			name: name.capitalize(),
			value: "Max level reached",
			inline: true,
		};
	}

	const field = {
		name: name.capitalize(),
		value: `Next level is ${nextLevel.level}:\n ${costsMessage(nextLevel.cost)}`,
		inline: true,
	};

	return field;
};

const costsMessage = (costs) => {
	let message = "";
	for(const cost in costs) {
		message += `${getIcon(cost) || ""} ${cost.capitalize()}: ${costs[cost]} \n`;
	}

	return message;
};

module.exports = buildingEmbed;