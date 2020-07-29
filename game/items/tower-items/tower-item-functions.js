const { getRandomPrefix, getPrefixMultiplier } = require("./tower-item-prefix");
const towerItems = require("./hero-tower-items");

const getNewTowerItem = (level) => {
	const prefix = getRandomPrefix();

	const towerItemsValues = Object.values(towerItems);

	const randomItemNumber = Math.floor(Math.random() * towerItemsValues.length);

	return `${towerItemsValues[randomItemNumber].name} ${prefix} (${typeof level === "number" ? level : 1})`;
};

// Takes an item name generated from Tower and gives back the item object /w updated stats
const getTowerItemStats = (itemName) => {
	const regex = /(?<item>.+?)\s(?<prefix>of\s.+?)\s\((?<level>\d+)\)/g;

	const itemMatch = regex.exec(itemName).groups;

	const item = towerItems[itemMatch.item];

	for(const stat in item.stats) {
		// Will the original item from towerItems be mutated here? It should NOT be so...
		item.stats[stat] = Math.floor(item.stats[stat] * getPrefixMultiplier(itemMatch.prefix) * (itemMatch.level / 3));
	}

	return item;
};

// If the item is from a tower it returns true, else false
const isTowerItem = (itemName) => {
	const regex = /.+?\sof\s.+?\(\d+\)/;
	return regex.test(itemName);
};

module.exports = { getNewTowerItem, getTowerItemStats, isTowerItem };