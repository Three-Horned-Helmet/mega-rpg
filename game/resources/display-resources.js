const Discord = require("discord.js");
const buildingsObject = require("../build/buildings-object");
const { getIcon } = require("../_CONSTS/icons");

const displayResources = (user) => {
	const username = `${user.account.username}'s resources`;
	const sideColor = "#45b6fe";

	const lumber = getProductionResourceValue(user, "lumbermill");

	const ores = getProductionResourceValue(user, "mine");

	const bars = getProductionResourceValue(user, "forge");

	const fields = [
		{
			name: "Gold (raid/hunt/fish/duel/)",
			value:
              `:moneybag: ${user.resources.gold}`,
		},
		{
			name: ":axe: Wood (lumbermill)",
			value:
              lumber,
			inline: true,
		},
		{
			name: ":pick: Ores (mine)",
			value:
              ores,
			inline: true,
		},
		{
			name: ":fire: Bars (forge)",
			value:
              bars,
			inline: true,
		},
	];

	const embedResources = new Discord.MessageEmbed()
		.setTitle(username)
		.setColor(sideColor)
		.addFields(
			...fields,
		);
	return embedResources;
};

const getProductionResourceValue = (user, resource) => {
	const resources = buildingsObject[resource].levels.map(lvl => lvl.produce ?
		lvl.produce : lvl.craftables).flat();
	let message = "";
	resources.forEach(res => {
		if(user.resources[res]) {
			message += `${getIcon(res)} ${Math.floor(user.resources[res])} ${res.split(" ")[0]} \n`;
		}
	});

	if(!message) {
		message = ":cry: no resources";
	}
	return message;
};

module.exports = displayResources;