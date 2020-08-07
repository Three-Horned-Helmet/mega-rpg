const allItems = require("../items/all-items");

const craftItem = async (user, item, amount) => {
	item = allItems[item];

	const canBeCrafted = checkIfPossibleToCraft(user, item, amount);
	if(!canBeCrafted.response) return canBeCrafted.message;

	// Save to user
	user.addItem(item, amount, true);

	await user.save();

	return `You successfully crafted ${amount} ${item.name}${amount === 1 ? "" : "s"}`;
};

const checkIfPossibleToCraft = (user, item, amount) => {
	// Is there any item at all or invalid number, or was it an invalid arg?
	if(!item || amount < 1) return { response: false, message: "invalid item name or amount" };

	// Is the crafting building (like blacksmith) on sufficient level?
	const { building:reqBuilding, level:reqLevel } = item.requirement;
	if(!user.empire.find(building => building.name === reqBuilding && building.level >= reqLevel)) {
		return { response: false, message: `Your ${reqBuilding} needs to be level ${reqLevel}` };
	}

	// Check if sufficient resources
	for(const resource in item.cost) {
		if(!(user.resources[resource] >= item.cost[resource] * amount)) {
			return {
				response: false,
				message: `You are missing ${user.resources[resource] ?
					item.cost[resource] * amount - user.resources[resource] :
					item.cost[resource] * amount} of ${resource}`,
			};
		}
	}

	return { response: true, message: "success" };
};

module.exports = craftItem;