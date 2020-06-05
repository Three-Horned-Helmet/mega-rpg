const Discord = require("discord.js");
const icons = require("../../icons/icons");
const calculateStats = require("../../combat/calculate-stats");

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

const displayArmy = (user) => {
	const username = `${user.account.username}'s army`;
	const sideColor = "#9c2200";

	const army = createMessage(user.army.units);
	const armory = createMessage(user.army.armory);
	const armoryHeader = {
		name: "Armory",
		value: "-----------------------------------------------------------------",
	};

	const heroItems = createMessage(user.hero);
	const heroHeader = {
		name: "Hero",
		value: "-----------------------------------------------------------------",
	};

	const allStats = calculateStats(user);
	const totalStatsField = {
		name: "Total Stats",
		value: addObjectToMessage(allStats.totalStats),
		inline: true,
	};

	const heroStatsField = {
		name: "Hero Stats",
		value: addObjectToMessage(allStats.heroStats),
		inline: true,
	};

	const unitStatsField = {
		name: "Unit Stats",
		value: addObjectToMessage(allStats.unitStats),
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

const createMessage = (thing) =>{
	const messageArray = [];

	for(const key in thing) {
		let message = "";

		Object.keys(thing[key]).forEach(el =>{
			if(thing[key][el] && !el.startsWith("$")) {
				message += `${el.capitalize()}: ${thing[key][el]} \n`;
			}
		});

		if(message) {
			messageArray.push({
				name: `${icons[key]} ${key.capitalize()}`,
				value: message,
				inline: true,
			});
		}
	}

	return messageArray;
};

const addObjectToMessage = (obj) => {
	let message = "";

	for(const key in obj) {
		message += `${icons[key]} ${key.capitalize()}: ${obj[key]} \n`;
	}

	return message;
};

module.exports = displayArmy;