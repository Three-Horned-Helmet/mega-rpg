const allItems = require("../items/all-items");

const craftItem = (user, item, amount) => {
	item = allItems[item];

	const canBeCrafted = checkIfPossibleToCraft(user, item, amount);
	if(!canBeCrafted.response) return canBeCrafted.message;
};

const checkIfPossibleToCraft = (user, item, amount) => {

};

module.exports = craftItem;