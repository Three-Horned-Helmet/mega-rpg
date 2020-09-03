const allItems = require("../items/all-items");
const { getTowerItem } = require("../items/tower-items/tower-item-functions");

const equipItem = async (user, itemName) => {
	let item = allItems[itemName] || getTowerItem(itemName);
	if(!item) {
		itemName = Object.values(user.army.armory).map(allItemsCat => {
			return Object.keys(allItemsCat).find(i => i.includes(itemName)) || false;
		}).filter(el => el)[0];

		item = allItems[itemName] || getTowerItem(itemName);
	}

	const canBeEquiped = checkIfItemCanBeEquiped(user, item, itemName);
	if(!canBeEquiped.response) return canBeEquiped.message;

	const currentItemName = user.hero.armor[item.typeSequence[item.typeSequence.length - 1]];
	const currentItem = allItems[currentItemName] || getTowerItem(currentItemName);

	await user.equipItem(item, currentItem);

	return `${item.name} was successfully equiped`;
};

const checkIfItemCanBeEquiped = (user, item, itemName) => {
	// Check if the item exists
	if(!item) {
		return {
			response: false,
			message: "This item does not exist",
		};
	}

	const { armory } = user.army;
	const { name, typeSequence, towerItem } = item;
	const itemType = typeSequence[typeSequence.length - 1];
	const usersItems = Object.keys(armory[itemType]);

	// Check if user owns the item
	if((!usersItems.includes(name) && !towerItem) || armory[itemType][name] < 1 || (towerItem && !usersItems.find(it => it.toLowerCase() === itemName))) {
		return {
			response: false,
			message: `You do not own ${name}`,
		};
	}

	return { response: true };
};

module.exports = equipItem;