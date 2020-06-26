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
		console.log(place, "place");
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
	const fields = [
		{
			name: "Current location:",
			value: currentLocationWithIcon,
			inline: false,
		},
		{ name: "\u200B", value: "\u200B" },
		{
			name: `Explored Places in ${currentLocation}:`,
			value: exploredPlacesWithIcons,
			inline: false,
		},
	];

	const availableLocations = Object.keys(user.world.locations)
		.filter(l=> user.world.locations[l].available === true && l !== currentLocation)
		.map(l=> `${getLocationIcon(l)} ${l}`);

	if (availableLocations.length) {
		fields.splice(1, 0, {
			name: "Available locations",
			value: availableLocations,
			inline: false,
		});
	}

	const embedUser = new Discord.MessageEmbed()
		.setTitle(`${username}'s world`)
		.setColor(sideColor)
		.addFields(
			...fields,
		)
		.setFooter(`Legend:\n ${footerFriendlyLegend}`);
	return embedUser;
};

module.exports = { getWorld };

