const allItems = require("../items/all-items");

const equipItem = async (user, item) => {
	item = allItems[item];

	const canBeEquiped = checkIfItemCanBeEquiped(user, item);
	if(!canBeEquiped.response) return canBeEquiped.message;

	const currentItem = allItems[user.hero.armor[item.typeSequence[item.typeSequence.length - 1]]];
	await user.equipItem(item, currentItem);

	return `${item.name} was successfully equiped`;
};

const checkIfItemCanBeEquiped = (user, item) => {
	// Check if the item exists
	if(!item) {
		return {
			response: false,
			message: "This item does not exist",
		};
	}

	const { armory } = user.army;
	const { name, typeSequence } = item;
	const itemType = typeSequence[typeSequence.length - 1];
	const usersItems = Object.keys(armory[itemType]);

	// Check if user owns the item
	if(!usersItems.includes(name) || armory[itemType][name] < 1) {
		return {
			response: false,
			message: `You do not own ${name}`,
		};
	}

	return { response: true };
};

module.exports = equipItem;