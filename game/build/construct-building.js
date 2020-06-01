// Takes a user object, building array, and coordinates array. Returns the resource that is missing from the users resources to build a building
const checkIfBuildIsPossible = async (user, building, coordinates) => {

	// Checks if the building- and coordinates command is valid
	if(!building) {
		return { response: false, message:"Unknown building command" };
	}
	else if(coordinates.find(el => el > 9 || el < 0) || coordinates.length !== 2) {
		console.log(coordinates, coordinates.length !== 2, coordinates.find(el => el > 9 || el < 0));
		return { response: false, message:"Please enter two coordinates from 0-9 in this format divided by a punctuation. e.g. !build barracks 1.1 " };
	}

	// For testing purposes
	// user = { empire: [
	// 	{ name: "barracks", position: [1, 1], level: 1 },
	// ],
	// resources: {
	// 	gold: 20,
	// 	oak: 30,
	// } };


	// Is the building coordinates taken
	const usersBuilding = user.empire.find(structure =>
		structure.position[0] === coordinates[0] && structure.position[1] === coordinates[1],
	);

	if(usersBuilding && usersBuilding.name !== building.name) {
		return { response: false, message:`The position is occupied by ${usersBuilding.name}` };
	}

	// Check for resources
	const buildingCost = building.levels[usersBuilding ? usersBuilding.level : 0];
	for(const resource in buildingCost) {
		if(user.resources[resource] < buildingCost[resource]) return { response: false, message: `You are missing ${buildingCost[resource] - user.resources[resource]} of ${resource}` };
	}

	// Constructs building
	await constructBuilding(user, { ...buildingCost, name: building }, coordinates);

	return { response: true, message: "success" };
};

// Takes a user, a building and coordinates and pushes the building to the users Empire array
const constructBuilding = async (user, buildingCost, coordinates) => {
	const building = {
		name: buildingCost.name,
		position: coordinates,
		level: buildingCost.level,
	};

	console.log("BUILDING", building);

	return await user.buyBuilding(building);
};


module.exports = checkIfBuildIsPossible;