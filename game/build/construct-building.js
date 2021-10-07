const { checkBuildQuests } = require("../quest/quest-utils");

const onlyOneBuildnings = ["tax office", "senate"];
const userHasBuilding = (user, building) => user.empire.find(b => b.name === building.name);

// Takes a user, a building and coordinates and pushes the building to the users Empire array
const constructBuilding = async (user, building, coordinates) => {
	// Finds next available spot if no coordinates are given
	if(!coordinates[0] && coordinates[0] !== 0) {
		coordinates = findAvailableSpot(user);
		if(!coordinates) return "There's no available spots in your empire" ;
	}
	// Only allowed to have one of certain buildings
	if (onlyOneBuildnings.includes(building.name) && userHasBuilding(user, building) && !coordinates) {
		return `You can only have one ${building.name}`;
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

	const questIntro = await checkBuildQuests(user, newBuilding);

	let msg = `You have successfully created ${newBuilding.name} level ${newBuilding.level}`;
	if(questIntro) msg += `\n\n**New Quest:**\n${questIntro}`;

	await user.save();
	return msg;
};

// Takes a user object, building array, and coordinates array.
// Returns the resource that is missing from the users resources to build a building
const checkIfBuildIsPossible = (user, building, coordinates) => {
	// Is this actually needed?
	if(coordinates.find(el => !el) || !coordinates) {
		return {
			response: false,
			message: "You have one or more faulty coordinate",
		};
	}

	// Checks if the building- and coordinates command is valid
	if(coordinates.find(cord => cord > Math.ceil(Math.pow(user.maxBuildings, 1 / 2)) || cord < 0) || coordinates.length !== 2) {
		return {
			response: false,
			message:"Please enter two coordinates between 0-2 divided by a punctuation, e.g: !build barracks 1.1 ",
		};
	}
	else if(!building) {
		return { response: false, message:"Unknown building command" };
	}

	// Is the building coordinates taken
	const usersBuilding = user.empire.find(structure =>
		structure.position[0] === coordinates[0] && structure.position[1] === coordinates[1],
	);

	const upgradeBuilding = !(usersBuilding && usersBuilding.name !== building.name);

	if(!upgradeBuilding) {
		return { response: false, message:`The position is occupied by ${usersBuilding.name}` };
	}

	// Check if maxBuilding has been reached
	if(!usersBuilding && user.empire.length >= user.maxBuildings) {
		return {
			response: false,
			message: "You need to level up your Senate to get additional building spots"
		};
	}

	// Check if the building is unique and already exist
	if(!upgradeBuilding && building.unique && user.empire.find(structure => structure.name === building.name)) {
		return {
			response: false,
			message: "You can only have one of this building"
		};
	}

	// Check for resources and max level
	const buildingCost = building.levels.find(b => usersBuilding ? b.level === usersBuilding.level + 1 : b.level === 0);

	if(!buildingCost) return { response: false, message:"You have already reached max level" };

	for(const resource in buildingCost.cost) {
		const userRes = user.resources[resource];
		const buildRes = buildingCost.cost[resource];

		if(!(userRes >= buildRes)) {
			let msg = "";
			if(resource === "Copper Ore" || resource === "Iron Ore") msg += "Build a Mine to gather ore.";
			else if (resource === "Oak Wood" || resource === "Yew Wood") msg += "Buil a Lumbermill to gather wood.";
			else if (resource === "Gold") msg += "You can gather gold by `!hunt`, `!raid`, `!fish` or `!duel`.";

			return {
				response: false,
				message: `You are missing ${userRes ? buildRes - userRes : buildRes} of ${resource} to build a ${building.name.capitalize()} level ${buildingCost.level}. ` + msg,
			};
		}
	}
	return { response: true, buildingCost };
};

const findAvailableSpot = (user) => {
	const gridSize = Math.ceil(Math.sqrt(user.maxBuildings));
	for(let y = 0; y < gridSize; y++) {
		for(let x = 0; x < gridSize; x++) {
			if(!user.empire.find(b => b.position[0] === x && b.position[1] === y)) {
				return [x, y];
			}
		}
	}

	return false;
};

module.exports = constructBuilding;