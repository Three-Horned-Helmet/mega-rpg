const buildingObject = require("../build/buildings-object");

const changeProducedResource = async (user, resource) => {
	// Finds the required building to profuce that resource
	let buildingReqLevel = null;
	const buildingReq = Object.keys(buildingObject).find((buildKey) => {

		return buildingObject[buildKey].levels.find(buildLevel => {
			if (buildLevel.produce === resource) {
				buildingReqLevel = buildLevel.level;
				return true;
			}
		});
	});

	// Check if it can be produced
	const canBeProduced = checkIfPossibleToProduce(user, resource, buildingReq, buildingReqLevel);
	if (!canBeProduced.response) return canBeProduced.message;

	// Collects the resouce and changes the buildings production
	const totalCollected = user.collectResource([buildingReq], new Date(), resource);
	await user.save();

	// Creates a return message
	let message = "";

	for (const collectedResource in totalCollected) {
		message += `${totalCollected[collectedResource]} ${collectedResource}, `;
	}

	return `You have collected: ${message} and the ${buildingReq}s have now been set to produce ${resource}`;
};

const checkIfPossibleToProduce = (user, resource, buildingReq, buildingReqLevel) => {
	// Check if valid produce command
	if (!buildingReq || (!buildingReqLevel && buildingReqLevel !== 0)) {
		return {
			response: false,
			message: `It is not possible to produce ${resource}. You need **Mine** or **Lumbermill** level 1 to be able to produce different resources! See \`!help produce\``,
		};
	}

	// Check if user has the required building and level to produce it
	const userBuilding = user.empire.find(building =>
		building.name === buildingReq && building.level >= buildingReqLevel,
	);

	if (!userBuilding) {
		return {
			response: false,
			message: `You need ${buildingReq} level ${buildingReqLevel}`,
		};
	}

	return {
		response: true,
	};
};

module.exports = changeProducedResource;