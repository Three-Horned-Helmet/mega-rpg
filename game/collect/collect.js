const collectResources = (user, collect) => {
	const canBeCollected = checkIfPossibleToCollect(user, collect);
	if(!canBeCollected.response) return canBeCollected.message;


};

const checkIfPossibleToCollect = (user, collect) => {
	// Check if arguments are allowed
	if(!(collect === "mine" || collect === "lumbermill" || collect === "all")) {
		return {
			response: false,
			message: "invalid arguments" };
	}

	// Check if you have mine or lumbermill
	if(!user.empire.find(building => building.name === collect)) {
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