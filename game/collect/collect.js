const { getIcon } = require("../_CONSTS/icons");
const { calculateGoldGained } = require("../_GLOBAL_HELPERS");

// except tax office
const allCollectable = ["mine", "lumbermill"];
const collectResources = async (user) => {

	const taxOfficeBuilding = user.empire.find(building => building.name === "tax office");
	const canBeCollected = checkIfPossibleToCollect(user, taxOfficeBuilding);
	if(!canBeCollected.response) return canBeCollected.message;
	const now = new Date();

	let goldGained = {};
	if(taxOfficeBuilding) {
		goldGained = calculateGoldGained(user, taxOfficeBuilding, now);
		user.gainManyResources(goldGained);
		if (goldGained.gold) {user.setLastCollected("tax office", now);}
	}

	// Adds it to db
	const collectedResources = await user.collectResource(allCollectable, now);
	const totalCollected = { ...collectedResources, ...goldGained };

	// Creates a return message
	let message = "";

	for(const resource in totalCollected) {
		message += `${getIcon(resource)} ${totalCollected[resource]} ${resource}, `;
	}

	return `You have collected ${message.slice(0, -2)}`;
};

const checkIfPossibleToCollect = (user, taxOfficeBuilding) => {
	// Check if you have mine or lumbermill
	if(!user.empire.find(building => allCollectable.includes(building.name)) && !taxOfficeBuilding) {
		return {
			response: false,
			message: "You have no production buildings. \nTry to type `!build mine`, `!build lumbermill` or `!build tax office` to get started"
		};
	}
	return {
		response: true,
		message: "success!",
	};

};

module.exports = collectResources;
