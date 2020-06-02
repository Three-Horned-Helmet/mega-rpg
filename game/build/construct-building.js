// Takes a user object, building array, and coordinates array. Returns the resource that is missing from the users resources to build a building
const checkIfBuildIsPossible = (user, building, coordinates) => {

	// Checks if the building- and coordinates command is valid
	if(!building) {
		return { response: false, message:"Unknown building command" };
	}
	else if(coordinates.find(cord => cord > 9 || cord < 0) || coordinates.length !== 2) {
		return { response: false, message:"Please enter two coordinates from 0-9 in this format divided by a punctuation. e.g. !build barracks 1.1 " };
	}

	// Is the building coordinates taken
	const usersBuilding = user.empire.find(structure =>
		structure.position[0] === coordinates[0] && structure.position[1] === coordinates[1],
	);

	if(usersBuilding && usersBuilding.name !== building.name) {
		return { response: false, message:`The position is occupied by ${usersBuilding.name}` };
	}

	// Check for resources and max level
	const buildingCost = building.levels[usersBuilding ? usersBuilding.level + 1 : 0];

	if(!buildingCost) return { response: false, message:"You have already reached max level" };

	for(const resource in buildingCost) {
		if(user.resources[resource] < buildingCost[resource]) return { response: false, message: `You are missing ${buildingCost[resource] - user.resources[resource]} of ${resource}` };
	}


	return { response: true, message: "success", buildingCost };
};

// Takes a user, a building and coordinates and pushes the building to the users Empire array
const constructBuilding = async (user, building, coordinates) => {
	const responseBuild = checkIfBuildIsPossible(user, building, coordinates);
	if(!responseBuild.response) return responseBuild;

	const { buildingCost } = responseBuild;
	const newBuilding = {
		name: building.name,
		position: coordinates,
		level: buildingCost.level,
	};

	await user.buyBuilding(newBuilding, buildingCost);

	if(building.execute) await building.execute(user);

	return { response: true, message: "success" };
};


module.exports = constructBuilding;