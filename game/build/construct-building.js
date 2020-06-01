// Takes a user object, building array, and coordinates array. Returns the resource that is missing from the users resources to build a building
const checkIfBuildIsPossible = (user, building, coordinates) => {

	if(!building) {
		return { response: false, message:"Unknown building command" };
	}
	else if(coordinates.find(el => el > 9 || el < 0) || coordinates.length !== 1) {
		return { response: false, message:"Please enter two coordinates from 0-9 in this format divided by a punctuation. e.g. !build barracks 1.1 " };
	}

	user = { empire: [
		{ name: "barracks", position: [1, 1], level: 1 },
	],
	resources: {
		gold: 20,
		oak: 30,
	} };


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

	constructBuilding(user, buildingCost, coordinates).then(result => {
		console.log(result);
		return { response: true };
	});
};

// Takes a user, a building and coordinates and builds the building if requirements are met
const constructBuilding = (user, buildingCost, coordinates) => {
	const buildingPromise = [];
	for(const resource in buildingCost) {
		// NB: Handle the reject pl0x
		buildingPromise.push(new Promise((resolve, reject) => {
			resolve(user.removeResource(resource, buildingCost[resource]));
		}));
	}

	const building = {
		name: buildingCost.name,
		position: coordinates,
		level: buildingCost.level,
	};

	buildingPromise.push(user.addBuilding(building));

	return Promise.all(buildingPromise).then(result => result);
};


module.exports = {
	constructBuilding,
	checkIfBuildIsPossible,
};