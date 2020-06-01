// Takes a user, a building and coordinates and builds the building if requirements are met
const constructBuilding = (user, building, coordinates) => {};

// Takes a user object, building array, and coordinates array. Returns the resource that is missing from the users resources to build a building
const checkIfBuildIsPossible = (user, building, coordinates) => {
	// Is the building coordinates takes
	const usersBuilding = user.empire.find(structure => structure.position[0] === coordinates[0] && structure.position[1] === coordinates[1]);

	if(usersBuilding && usersBuilding.name !== building.name) {
		return { response: false, message:`The position is occupied by ${usersBuilding.name}` };
	}

	// Check for resources
	const buildingCost = building.levels[usersBuilding ? usersBuilding.level : 0];
	for(const resource in buildingCost) {
		console.log(user.resources[resource], buildingCost[resource]);
		if(user.resources[resource] < buildingCost[resource]) return { response: false, message: `You are missing ${buildingCost[resource] - user.resources[resource]} of ${resource}` };
	}

	return {
		response: true,
	};
};

module.exports = {
	constructBuilding,
	checkIfBuildIsPossible,
};