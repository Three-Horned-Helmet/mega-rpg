const Discord = require("discord.js");
const icons = require("../../icons/icons");

const displayArmy = (user) => {
	const username = `${user.account.username}'s army`;
	const sideColor = "#45b6fe";

	const army = createMessage(user.army.units);
	const armory = createMessage(user.army.armory);

	const embedArmy = new Discord.MessageEmbed()
		.setTitle(username)
		.setColor(sideColor)
		.addFields(
			...army, ...armory,
		);

	return embedArmy;
};

const createMessage = (thing) =>{
	const messageArray = [];

	for(const key in thing) {
		let message = "";

		Object.keys(thing[key]).forEach(el =>{
			if(thing[key][el] && !el.startsWith("$")) {
				message += `${el}: ${thing[key][el]} \n`;
			}
		});

		if(message) {
			messageArray.push({
				name: `${icons[key]} ${key}`,
				value: message,
				inline: true,
			});
		}
	}

	return messageArray;
};

module.exports = displayArmy;