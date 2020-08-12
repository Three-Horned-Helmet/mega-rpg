const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");
const { calculatePveFullArmyResult } = require("../../combat/combat");
const { generateEmbedPveFullArmy } = require("../../combat/pveEmedGenerator");
const { checkQuest } = require("../quest/quest-utils");

const handleRaid = async (user, place = null) => {

	// checks for cooldown
	const cooldownInfo = onCooldown("raid", user);
	if (cooldownInfo.response) {
		return cooldownInfo.embed;
	}

	// checks for too low hp
	if (user.hero.currentHealth < user.hero.health * 0.05 && user.hero.currentHealth < 50) {
		return `Your hero's health is too low (**${user.hero.currentHealth}**)`;
	}

	const { currentLocation } = user.world;
	const placesInCurrentWorld = worldLocations[currentLocation].places;
	const locationIcon = getIcon(currentLocation);

	const userExploredPlaces = user.world.locations[currentLocation].explored;
	const userExploredRaidPlaces = userExploredPlaces
		.filter(p => placesInCurrentWorld[p].type === "raid")
		.map(p => p.replace(/\s/g, "").toLowerCase());

	// checks if user has explored any raidable place in current location
	if (!userExploredRaidPlaces.length) {
		return `You have not explored any place to raid in ${locationIcon} ${currentLocation}, try \`!explore\` to find a place to raid`;
	}

	const notHuntPlaces = Object.keys(placesInCurrentWorld)
		.filter(p => {
			const notHuntPlace = placesInCurrentWorld[p].type !== "raid";
			if (notHuntPlace) {
				return placesInCurrentWorld[p];
			}
		})
		.map(p => p.replace(/\s/g, "").toLowerCase());

	// if user tries to raid a place that is not raidable
	if (notHuntPlaces.includes(place.replace(/\s/g, "").toLowerCase())) {
		return "This place cannot be raided";
	}

	let placeInfo;

	// if user wants to raid a specific place
	if (place) {
		placeInfo = Object.values(placesInCurrentWorld).find(p => {
			const friendlyFormat = p.name.replace(/\s/g, "").toLowerCase();
			return friendlyFormat === place.replace(/\s/g, "");

			// if we want to make it user friendly
			// and let the user type in the first 4 letters of the place
			// but then we can't 4 places starting with 'bandit'
			// friendlyFormat.slice(0, 4) === place.slice(0, 4)
		});
	}
	else {
		// if user doesn't provide a specific place to raid, the user will be given a random place

		const listOfPlaces = Object.values(placesInCurrentWorld).filter(p => {
			const friendlyFormat = p.name.replace(/\s/g, "").toLowerCase();
			return userExploredRaidPlaces.includes(friendlyFormat);
		});
		placeInfo = listOfPlaces[Math.floor(Math.random() * listOfPlaces.length)];

	}

	// if user tries to raid that doesn't exist
	if (!placeInfo) {
		if (place.length > 10) {
			place = `${place.slice(0, 10)}[...]`;
		}
		return `${place} does not exist in ${locationIcon} ${currentLocation}. Use !look to see your surroundings`;
	}

	if (!userExploredPlaces.includes(placeInfo.name)) {
		return "You haven't explored this place yet. Try `!explore` in order to find it!";
	}

	// calculates result
	const raidResult = calculatePveFullArmyResult(user, placeInfo);

	// saves to database
	let questIntro;
	const now = new Date();
	user.setNewCooldown("raid", now);
	user.unitLoss(raidResult.lossPercentage);
	user.alternativeGainXp(raidResult.expReward);
	if (raidResult.win) {
		user.gainManyResources(raidResult.resourceReward);
		questIntro = await checkQuest(user, placeInfo.name, currentLocation);
	}
	await user.save();

	// generates a Discord embed
	const raidEmbed = generateEmbedPveFullArmy(user, placeInfo, raidResult, questIntro);
	return raidEmbed;

};

module.exports = { handleRaid };
