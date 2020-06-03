const allItems = require("../items/all-items");

const craftItem = (user, item, amount) => {
	item = allItems[item];

	const canBeCrafted = checkIfPossibleToCraft(user, item, amount);
	if(!canBeCrafted.response) return canBeCrafted.message;
};

const checkIfPossibleToCraft = (user, item, amount) => {
	// Is there any item at all or invalid number, or was it an invalid arg?
	if(!item || amount < 1) return { response: false, message: "invalid item name or amount" };
};

module.exports = craftItem;