const { getRandomPrefix, getPrefixMultiplier, getPrefix } = require("./tower-item-prefix");
const towerItems = require("./tower-items");

const getNewTowerItem = (level) => {
	const prefix = getRandomPrefix();

	const towerItemsValues = Object.values(towerItems);

	const randomItemNumber = Math.floor(Math.random() * towerItemsValues.length);

	return `${towerItemsValues[randomItemNumber].name} ${prefix} (${typeof level === "number" ? level : 1})`;
};

// Takes an item name generated from Tower and gives back the item object /w updated stats
const getTowerItem = (itemName) => {
	const regex = /(?<item>.+?)\s(?<prefix>of\s.+?)\s\((?<level>\d+)\)/g;

	const itemMatch = regex.exec(itemName).groups;

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

// If the item is from a tower it returns true, else false
const isTowerItem = (itemName) => {
	const regex = /.+?\sof\s.+?\(\d+\)/;
	return regex.test(itemName);
};

module.exports = { getNewTowerItem, getTowerItem, isTowerItem };