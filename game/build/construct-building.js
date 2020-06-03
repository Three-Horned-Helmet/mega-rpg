// Takes a user, a building and coordinates and pushes the building to the users Empire array
const constructBuilding = async (user, building, coordinates) => {
	const { response, message, buildingCost } = checkIfBuildIsPossible(user, building, coordinates);
	if(!response) return message;

	// Creates the new building object that is stored in the database
	const newBuilding = {
		name: building.name,
		position: coordinates,
		level: buildingCost.level,
	};

	await user.buyBuilding(newBuilding, buildingCost);

	if(building.execute) await building.execute(user);

	return `You have successfully created ${newBuilding.name} level ${newBuilding.level}`;
};

// Takes a user object, building array, and coordinates array.
// Returns the resource that is missing from the users resources to build a building
const checkIfBuildIsPossible = (user, building, coordinates) => {

	// Checks if the building- and coordinates command is valid
	if(!building) {
		return { response: false, message:"Unknown building command" };
	}
	else if(coordinates.find(cord => cord > 9 || cord < 0) || coordinates.length !== 2) {
		return {
			response: false,
			message:"Please enter two coordinates between 0-9 divided by a punctuation, e.g: !build barracks 1.1 ",
		};
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

	for(const resource in buildingCost.cost) {
		const userRes = user.resources[resource];
		const buildRes = buildingCost.cost[resource];

		if(!(userRes >= buildRes)) {
			return {
				response: false,
				message: `You are missing ${userRes ? buildRes - userRes : buildRes} of ${resource}`,
			};
		}
	}

	return { response: true, buildingCost };
};

module.exports = constructBuilding;