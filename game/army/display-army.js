const Discord = require("discord.js");
const { getIcon } = require("../_CONSTS/icons");
const calculateStats = require("../../combat/calculate-stats");

const displayArmy = (user) => {
	const username = `${user.account.username}'s army`;
	const sideColor = "#9c2200";

	const { totalStats, unitStats, heroStats } = calculateStats(user);

	const totalStatsField = {
		name: "Total Stats",
		value: addObjectToMessage(totalStats),
		inline: true,
	};

	const armoryHeader = {
		name: "Armory",
		value: "-----------------------------------------------------------------",
	};
	const army = createMessage(user.army.units);
	const armory = createMessage(user.army.armory);
	const unitStatsField = {
		name: "Unit Stats",
		value: addObjectToMessage(unitStats),
		inline: true,
	};

	const heroHeader = {
		name: "Hero",
		value: "-----------------------------------------------------------------",
	};
	const heroItems = createMessage(user.hero);
	const heroStatsField = {
		name: "Hero Stats",
		value: addObjectToMessage(heroStats),
		inline: true,
	};

	const emptySpace = { name: "\u200B", value: "\u200B" };

	const embedArmy = new Discord.MessageEmbed()
		.setTitle(username)
		.setColor(sideColor)
		.addFields(
			totalStatsField, heroStatsField, unitStatsField, emptySpace,
			armoryHeader, ...army, ...armory,
			emptySpace, heroHeader, ...heroItems,
		);


	return embedArmy;
};

const createMessage = (mainCategory) => {
	const messageArray = [];

	for (const category in mainCategory) {
		let message = "";

		Object.keys(mainCategory[category]).forEach(subCategory => {
			if (mainCategory[category][subCategory] && !subCategory.startsWith("$")) {
				const iValue = mainCategory[category][subCategory];
				message += `${subCategory.capitalize()}: ${typeof iValue === "string" ? iValue.capitalize() : iValue} \n`;
			}
		});

		if (message) {
			messageArray.push({
				name: `${getIcon(category)} ${category.capitalize()}`,
				value: message,
				inline: true,
			});
		}
	}

	return messageArray;
};

const addObjectToMessage = (obj) => {
	let message = "";

	for (const key in obj) {
		if (key !== "currentHealth") {
			message += `${getIcon(key)} ${key.capitalize()}: ${(obj.currentHealth && key === "health") ?
				obj.currentHealth + "/" : ""}${obj[key]} \n`;
		}
	}

	return message;
};

module.exports = displayArmy;