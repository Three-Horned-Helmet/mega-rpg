const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getPlaceIcon } = require("../_CONSTS/icons");

// TODO: finish handleRandomEvent
// needed: a battlefunction

const handleExplore = (user) => {
	const cd = onCooldown("explore", user);
	if (cd.response) {
		return cd.embed;
	}
	const { currentLocation } = user.world;

	const chanceForRandomEvent = 0.1;
	const randomNumber = Math.random();

	const now = new Date();

	// triggers randomevent 1:10
	if (chanceForRandomEvent > randomNumber) {
		const { randomEvents } = worldLocations[currentLocation];
		user.setNewCooldown("explore", now);
		return handleRandomEvent(randomEvents);
	}

	const places = worldLocations[currentLocation].places;
	const exploreResult = exploreArea(user, places, currentLocation, now);
	return exploreResult;
};

const handleRandomEvent = (randomEvents) => {
	const randomEventNames = Object.keys(randomEvents);
	const randomEvent = randomEventNames[Math.floor(Math.random() * randomEventNames.length)];
	return `randomEvent triggered --> ${randomEvent}`;
};

const exploreArea = (user, places, currentLocation, now)=>{
	const placeNames = Object.keys(places);
	const newlyExploredPlaceName = placeNames[Math.floor(Math.random() * placeNames.length)];
	const previouslyExploredPlaces = user.world.locations[currentLocation].explored;
	const msg = previouslyExploredPlaces.includes(newlyExploredPlaceName) ?
		generateFailExploreMessage(currentLocation)
		: generateSuccessExploreMessage(currentLocation, newlyExploredPlaceName);


	user.handleExplore(now, currentLocation, newlyExploredPlaceName);
	return msg;
};

module.exports = { handleExplore };
// user.setNewCooldown("explore", now);

const generateFailExploreMessage = (currentLocation) => {
	const worldIcon = getLocationIcon(currentLocation);
	const responses = [
		"After a long adventure, you came back exploring nothing new",
		`You walked around in ${worldIcon} ${currentLocation} finding nothing you haven't seen before`,
		"You chose the comfortable path exploring the same old stuff",
		`You find nothing new in ${worldIcon} ${currentLocation}`,
		"After a lot of exploration, you find nothing interesting ",
		"After adventuring for hours, your men fell tired and you decided to head back without any result",
	];
	const response = responses[Math.floor(Math.random() * responses.length)];
	return response;
};
const generateSuccessExploreMessage = (currentLocation, place) => {
	const worldIcon = getLocationIcon(currentLocation);
	const placeType = worldLocations[currentLocation].places[place].type;
	const placeIcon = getPlaceIcon(placeType);
	const responses = [
		`You went onto a new path and found a ${placeIcon} **${place}**`,
		`You explored for hours and upon your return you found a ${placeIcon} **${place}** behind your empire`,
		`You saw a small elf and decided to follow it, the elf lead you to a ${placeIcon} **${place}** `,
		`Your scouts reports of a ${placeIcon} **${place}**, not far from your base`,
		`As you travel through the land of ${worldIcon} ${currentLocation}, you find a ${placeIcon} **${place}**`,
		`You can't belive your eyes, you have just encountered a ${placeIcon} **${place}**`,
	];
	const response = responses[Math.floor(Math.random() * responses.length)];
	return response;
};