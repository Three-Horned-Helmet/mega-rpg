const { onCooldown } = require("../_CONSTS/cooldowns");
const { objectFilter } = require("../_GLOBAL_HELPERS");
const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");

const CHANCE_FOR_SUCCESS = 0.95;

const handleExplore = async (user) => {
	const cd = onCooldown("explore", user);
	if (cd.response) {
		return cd.embed;
	}
	const { currentLocation } = user.world;
	const now = new Date();
	const { places } = worldLocations[currentLocation];
	const explorablePlaces = objectFilter(places, place => !place.notExplorable);

	const exploreResult = exploreArea(user, explorablePlaces, currentLocation, now);
	return exploreResult;
};

const exploreArea = async (user, places, currentLocation, now) => {
	user.setNewCooldown("explore", now);
	const placeNames = Object.keys(places);
	let newlyExploredPlaceName = placeNames[Math.floor(Math.random() * placeNames.length)];
	const previouslyExploredPlaces = user.world.locations[currentLocation].explored;
	if (previouslyExploredPlaces.length === 0 && currentLocation === "Grassy Plains") {
		newlyExploredPlaceName = "River";
	}
	let msg;

	if (CHANCE_FOR_SUCCESS < Math.random() || previouslyExploredPlaces.includes(newlyExploredPlaceName)) {
		msg = generateFailExploreMessage(currentLocation);
	}
	else {
		user.handleExplore(currentLocation, newlyExploredPlaceName);
		msg = generateSuccessExploreMessage(currentLocation, newlyExploredPlaceName, user.hero.rank);
	}
	await user.save();
	return msg;
};

module.exports = { handleExplore };

const generateFailExploreMessage = (currentLocation) => {
	const worldIcon = getIcon(currentLocation);
	const responses = [
		"After a long adventure, you came back exploring nothing new",
		`You wander aimlessly around in ${worldIcon} ${currentLocation} seing the same stuff you've seen before`,
		`You walked around in ${worldIcon} ${currentLocation} finding nothing you haven't seen before`,
		"You chose the comfortable path exploring the same old stuff",
		`You find nothing new in ${worldIcon} ${currentLocation}`,
		"After a lot of exploration, you find nothing interesting ",
		"After adventuring for hours, your men fell tired and you decided to head back without any result",
		"A thick fog hinders you to do any exploration"
	];
	const response = responses[Math.floor(Math.random() * responses.length)];
	return response;
};
const generateSuccessExploreMessage = (currentLocation, place, heroRank) => {
	const worldIcon = getIcon(currentLocation);
	const { type, name } = worldLocations[currentLocation].places[place];
	const placeIcon = getIcon(type);
	const strings = [
		`You went onto a new path and found a ${placeIcon} **${place}**`,
		`You explored for hours and upon your return you found a ${placeIcon} **${place}** behind your empire`,
		`You saw a small elf and decided to follow it, the elf lead you to a ${placeIcon} **${place}** `,
		`Your scouts reports of a ${placeIcon} **${place}**, not far from your base`,
		`As you travel through the land of ${worldIcon} ${currentLocation}, you find a ${placeIcon} **${place}**`,
		`You can't belive your eyes, you have just encountered a ${placeIcon} **${place}**`,
	];
	let response = `${strings[Math.floor(Math.random() * strings.length)]}`;
	if (heroRank < 3) {
		response += ` ~~~ type \`!${type} ${name}\` to interact`;
	}
	return response;
};
