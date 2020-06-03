const buildingObject = require("../build/buildings-object");

const changeProducedResource = async (user, resource) => {
    	// Finds the required building to profuce that resource
	let buildingReqLevel = null;
	const buildingReq = Object.keys(buildingObject).find((buildKey) => {

		return buildingObject[buildKey].levels.find(buildLevel => {
			if(buildLevel.produce === resource) {
				buildingReqLevel = buildLevel.level;
				return true;
			}
		});
	});

	console.log(buildingReq, buildingReqLevel);

	const canBeProduced = checkIfPossibleToProduce(user, resource, buildingReq, buildingReqLevel);
	if(!canBeProduced.response) return canBeProduced.message;

};

const checkIfPossibleToProduce = (user, resource, buildingReq, buildingReqLevel) => {
	// Check if valid produce command
	if(!buildingReq || (!buildingReqLevel && buildingReqLevel !== 0)) {
		return {
			response: false,
			message: `It is not possible to produce ${resource}`,
		};
	}

	// Check if user has the required building and level to produce it
	const userBuilding = user.empire.find(building =>
		building.name === buildingReq && building.level >= buildingReqLevel,
	);

	if(!userBuilding) {
		return {
			response: false,
			message: `You need ${buildingReq} level ${buildingReqLevel}, but only have ${userBuilding.name} level ${userBuilding.level}`,
		};
	}

	return {
		response: true,
	};
};

module.exports = changeProducedResource;