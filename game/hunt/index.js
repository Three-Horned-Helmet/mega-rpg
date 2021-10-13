const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_UNIVERSE");
const { getIcon } = require("../_CONSTS/icons");
const { calculatePveHero } = require("../../combat/combat");
const { generateEmbedPveHero } = require("../../combat/pveEmedGenerator");
const { checkQuest } = require("../quest/quest-utils");

const handleHunt = async (user, place = null) => {
	// checks for cooldown
	const cooldownInfo = onCooldown("hunt", user);
	if (cooldownInfo.response) {
		return cooldownInfo.embed;
	}

	// checks for too low hp
	if (user.hero.currentHealth < user.hero.health * 0.05 && user.hero.currentHealth < 50) {
		let feedback = `Your hero's health is too low (**${user.hero.currentHealth}**)`;
		if (user.hero.rank < 2) {
			feedback += "\n You can `!buy` poitions (e.g. `!buy small healing potion`) and `!use` x (e.g. `!use small healing potion`)";
		}
		return feedback;
	}

	const { currentLocation } = user.world;
	const placesInCurrentWorld = worldLocations[currentLocation].places;
	const locationIcon = getIcon(currentLocation);
	const userExploredPlaces = user.world.locations[currentLocation].explored;

	const userExploredHuntPlaces = userExploredPlaces
		.filter(p => placesInCurrentWorld[p].type === "hunt")
		.map(p => p.replace(/\s/g, "").toLowerCase());

	// checks if user has explored any huntable places in current location
	if (!userExploredHuntPlaces.length) {
		return `You have not explored any place to hunt in ${locationIcon} ${currentLocation}, try \`!explore\` to find a place to hunt`;
	}

	const notHuntPlaces = Object.keys(placesInCurrentWorld)
		.filter(p => {
			const notHuntPlace = placesInCurrentWorld[p].type !== "hunt";
			if (notHuntPlace) {
				return placesInCurrentWorld[p];
			}
		})
		.map(p => p.replace(/\s/g, "").toLowerCase());

	// if user tries to hunt a place that is not huntable
	if (notHuntPlaces.includes(place.replace(/\s/g, "").toLowerCase())) {
		return "This place cannot be hunted";
	}

	let placeInfo;

	// if user wants to hunt a specific place
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
		// if user doesn't provide a specific place to hunt, the user will be given a random place

		const listOfPlaces = Object.values(placesInCurrentWorld).filter(p => {

			const friendlyFormat = p.name.replace(/\s/g, "").toLowerCase();
			return userExploredHuntPlaces.includes(friendlyFormat) && !p.notExplorable;
		});
		placeInfo = listOfPlaces[Math.floor(Math.random() * listOfPlaces.length)];

	}

	// if user tries to hunt that doesn't exist
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
	const huntResult = calculatePveHero(user, placeInfo);
	// saves to database
	let questIntro;
	const now = new Date();
	user.setNewCooldown("hunt", now);
	user.heroHpLossFixedAmount(huntResult.damageLost);

	// user.heroHpLoss(huntResult.lossPercentage);
	user.alternativeGainXp(huntResult.expReward);

	if (huntResult.win) {
		user.gainManyResources(huntResult.resourceReward);
		questIntro = await checkQuest(user, placeInfo.name, currentLocation);
	}
	await user.save();
	// generates a Discord embed
	const huntEmbed = generateEmbedPveHero(user, placeInfo, huntResult, questIntro);

	return huntEmbed;

};

module.exports = { handleHunt };
