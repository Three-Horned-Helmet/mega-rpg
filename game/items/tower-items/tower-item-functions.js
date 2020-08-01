const { getRandomPrefix, getPrefixMultiplier, getPrefix } = require("./tower-item-prefix");
const towerItems = require("./tower-items");

const getNewTowerItem = (level) => {
	const prefix = getRandomPrefix();

	const towerItemsValues = Object.values(towerItems);

	const randomItemNumber = Math.floor(Math.random() * towerItemsValues.length);

	return `${towerItemsValues[randomItemNumber].name} ${prefix} (${typeof level === "number" ? level : 1})`;
};

// Takes an item name generated from Tower and gives back the item object /w updated stats
// This function needs to be as efficient as possible (frequently used)
const getTowerItem = (itemName) => {
	const regex = /(?<item>.+?)\s(?<prefix>of\s.+?)\s\((?<level>\d+)\)/g;
	const regexMatch = regex.exec(itemName);

	if(!regexMatch) return false;

	const itemMatch = regexMatch.groups;

	const originalTowerItem = Object.values(towerItems).find(i => i.name.toLowerCase() === itemMatch.item.toLowerCase());
	if(!originalTowerItem) return false;

	const item = { ...originalTowerItem, stats: { ...originalTowerItem.stats } };
	item.name = `${item.name} ${getPrefix(itemMatch.prefix)} (${itemMatch.level})`;

	for(const stat in item.stats) {
		// Will the original item from towerItems be mutated here? It should NOT be so...
		item.stats[stat] = Math.floor(item.stats[stat] * getPrefixMultiplier(itemMatch.prefix) * (0.5 + itemMatch.level / 5));
	}

	return item;
};

// Takes a full tower item name and a user and removes the item from the user if it has a worse item or no item (returns true) otherwise returns false
const removeTowerItemFromUser = (user, itemName) => {
	const item = typeof itemName === "string" ? getTowerItem(itemName) : itemName;
	const { typeSequence, stats } = item;

	// Get the item Name without prefix
	let itemNameMatch;
	try {
		const regex = /(?<item>.+?)\sof\s/g;
		const regexMatch = regex.exec(item.name);
		itemNameMatch = regexMatch.groups.item;
	}
	catch {
		console.error("Something went wrong with the regex matching of tower item", item);
		return false;
	}

	// Get the users items
	const userItems = typeSequence.reduce((acc, cur) => acc[cur], user);
	const userItem = Object.keys(userItems).find(i => i.includes(itemNameMatch) && userItems[i] > 0);

	if(userItem && Object.values(getTowerItem(userItem).stats)[0] < Object.values(stats)[0]) {
		// If User item is worse
		user.removeItem(getTowerItem(userItem));

		return true;
	}
	else {
		// If User is better
		return !userItem;
	}
};

// If the item is from a tower it returns true, else false
const isTowerItem = (itemName) => {
	const regex = /.+?\sof\s.+?\(\d+\)/;
	return regex.test(itemName);
};

module.exports = { getNewTowerItem, getTowerItem, removeTowerItemFromUser, isTowerItem };