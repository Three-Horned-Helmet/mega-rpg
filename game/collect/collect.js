const collectResources = async (user, collect) => {
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
	// Check if arguments are allowed
	if(!["mine", "lumbermill", "all"].includes(collect)) {
		return {
			response: false,
			message: "invalid arguments" };
	}

	// Check if you have mine or lumbermill
	if(!user.empire.find(building => building.name === collect || collect === "all")) {
		return {
			response: false,
			message: `You have no ${collect}s`,
		};
	}


	return {
		response: true,
		message: "success!",
	};

};

module.exports = collectResources;