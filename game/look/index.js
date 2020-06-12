const Discord = require("discord.js");

const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getPlaceIcon } = require("../_CONSTS/icons");

const getWorld = (user) => {

	const { currentLocation } = user.world;
	const currentLocationWithIcon = `${getLocationIcon(currentLocation)} ${currentLocation}`;

	const exploreCommand = "```!explore```";
	const defaultNonExplored = `You have not explored anything in ${currentLocation}\ntry: ${exploreCommand}`;

	const exploredPlaces = user.world.locations[currentLocation].explored;
	const exploredPlacesWithIcons = exploredPlaces.length ? exploredPlaces.map(place=>{
		const type = worldLocations[currentLocation].places[place].type;
		return `${getPlaceIcon(type)} ${place}`;
	}) : defaultNonExplored;

	const sideColor = "#45b6fe";
	const username = `${user.account.username}`;
	const legend = new Set();

	Object.keys(worldLocations[currentLocation].places).map(p=>{
		const type = worldLocations[currentLocation].places[p].type;
		legend.add(`${getPlaceIcon(type)}: ${type} - `);
	});
	const footerFriendlyLegend = Array.from(legend).join("");
	console.log(footerFriendlyLegend);

	const embedUser = new Discord.MessageEmbed()
		.setTitle(`${username}'s world`)
		.setColor(sideColor)
		.addFields(
			{
				name: "Current location:",
				value: currentLocationWithIcon,
				inline: false,
			},
			{ name: "\u200B", value: "\u200B" },
			{
				name: "Explored Locations:",
				value: exploredPlacesWithIcons,
				inline: false,
			},
		)
		.setFooter(`Legend:\n ${footerFriendlyLegend}`);
	return embedUser;
};

module.exports = { getWorld };

