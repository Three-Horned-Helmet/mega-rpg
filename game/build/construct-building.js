// Takes a user, a building and coordinates and pushes the building to the users Empire array
const constructBuilding = async (user, building, coordinates) => {
	if(isNaN(coordinates)) {
		coordinates = findAvailableSpot(user);
		if(!coordinates) return { response: false, message: "There's no available spots in your empire" };
	}


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
	if(coordinates.find(cord => cord > 3 || cord < 0) || coordinates.length !== 2) {
		return {
			response: false,
			message:"Please enter two coordinates between 0-3 divided by a punctuation, e.g: !build barracks 1.1 ",
		};
	}
	else if(!building) {
		return { response: false, message:"Unknown building command" };
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

const findAvailableSpot = (user) => {
	for(let y = 0; y < 4; y++) {
		for(let x = 0; x < 4; x++) {
			if(!user.empire.find(b => b.position[0] === x && b.position[1] === y)) {
				return [x, y];
			}
		}
	}

	return false;
};

module.exports = constructBuilding;