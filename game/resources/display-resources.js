const Discord = require("discord.js");
const buildingsObject = require("../build/buildings-object");
const icons = require("../../icons/icons");

const displayResources = (user) => {
	const username = `${user.account.username}'s resources`;
	const sideColor = "#45b6fe";

	const lumber = getProductionResourceValue(user, "lumbermill");

	const ores = getProductionResourceValue(user, "mine");

	const bars = getProductionResourceValue(user, "forge");


	const embedResources = new Discord.MessageEmbed()
		.setTitle(username)
		.setColor(sideColor)
		.addFields(
			{
				name: "gold",
				value:
                  `:moneybag: ${user.resources.gold}`,
			},
			{
				name: ":axe: Wood",
				value:
                  lumber,
				inline: true,
			},
			{
				name: ":pick: Ores",
				value:
                  ores,
				inline: true,
			},
			{
				name: ":fire: Bars",
				value:
                  bars,
				inline: true,
			},
		);

	// .setFooter(`PVP: #${pvpRank} ~~~ Total: #${totalRank}`);
	return embedResources;
};

const getProductionResourceValue = (user, resource) => {
	const resources = buildingsObject[resource].levels.map(lvl => lvl.produce ?
		lvl.produce : lvl.craftables).flat();
	let message = "";
	console.log(resources);
	resources.forEach(res => {
		if(user.resources[res]) {
			message += `${icons[res]} ${Math.floor(user.resources[res])} ${res.split(" ")[0]} \n`;
		}
	});

	return message;
};

module.exports = displayResources;