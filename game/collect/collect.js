const collectResources = async (user, collect) => {
	if(!["mine", "lumbermill", "all"].includes(collect)) collect = "all";

	const canBeCollected = checkIfPossibleToCollect(user, collect);
	if(!canBeCollected.response) return canBeCollected.message;

	// Update this is a new building can be collected (add the new bulding to the array)
	const toBeCollected = collect === "all" ? ["mine", "lumbermill"] : [collect];

	// Adds it to db
	const totalCollected = await user.collectResource(toBeCollected, new Date());

	// Creates a return message
	let message = "";

	for(const resource in totalCollected) {
		message += `${totalCollected[resource]} ${resource}, `;
	}

	return `You have collected ${message}`;
};

const checkIfPossibleToCollect = (user, collect) => {
	// Check if you have mine or lumbermill
	if(!user.empire.find(building => building.name === collect || collect === "all")) {
		let message;
		if(collect === "all") message = "You have no production buildings. \nTry to type `!build mine` or `!build lumbermill` to get started";
		else message = `You have no ${collect}s`;

		return {
			response: false,
			message,
		};
	}


	return {
		response: true,
		message: "success!",
	};

};

module.exports = collectResources;