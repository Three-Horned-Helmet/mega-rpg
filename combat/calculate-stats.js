const allUnits = require("../game/recruit/all-units");
const allItems = require("../game/items/all-items");
const { getTowerItem } = require("../game/items/tower-items/tower-item-functions");

// Takes the user and calculates the total amount of combat stats for that user
// Returns an object with the values listed in the user
const calculateStats = (user) => {
	const { units, armory } = user.army;

	const totalStats = {};
	const unitStats = {};
	const heroStats = {};
	// let totalUnits = 0;

	// Get stats from units
	Object.values(units).forEach(unitType => {
		Object.keys(unitType).forEach(unit => {
			if (!unit.startsWith("$")) {
				const { stats } = allUnits[unit];
				for (const stat in stats) {
					unitStats[stat] = unitStats[stat] && unitStats[stat] !== 0 ? (unitStats[stat] + stats[stat] * unitType[unit]) : stats[stat] * unitType[unit];
				}

				// totalUnits += unitType[unit];
			}
		});
	});

	// Add the stats from the items
	/* for (const slot in armory.toJSON()) {
			let slotsTaken = 0;
			const allSlotItems = Object.keys(armory[slot]).map(item => allItems[item] || getTowerItem(item));

			// Sorts depending on what item that gives the most stats
			const sortHelper = (a) => {
				return Object.values(a.stats).reduce((acc, cur) => acc + cur);
			};

			allSlotItems.sort((a, b) => sortHelper(b) - sortHelper(a));

			// Add the stats of up to the amount of units that you have (e.g. 60 units can onlyuse 60 helmets)
			allSlotItems.forEach((item) => {
				if (slotsTaken >= totalUnits) return false;

				const iQuantity = armory[slot][item.name];
				const iToAdd = totalUnits - slotsTaken - iQuantity;
				const itemAdded = iToAdd < 0 ? totalUnits - slotsTaken : iQuantity;

				for (const stat in item.stats) {
					unitStats[stat] += item.stats[stat] * itemAdded;
				}

				slotsTaken += itemAdded;
			});
		} */


	// Add hero
	const { currentHealth, health, attack } = user.hero;

	heroStats["health"] = heroStats["health"] ? heroStats["health"] + health : health;
	heroStats["currentHealth"] = heroStats["currentHealth"] ? heroStats["currentHealth"] + currentHealth : currentHealth;
	heroStats["attack"] = Math.floor((heroStats["attack"] ? heroStats["attack"] + attack : attack) * (currentHealth / health));

	// Add Total Stats
	totalStats["health"] = unitStats["health"] + heroStats["currentHealth"];
	totalStats["attack"] = unitStats["attack"] + heroStats["attack"];

	return {
		totalStats,
		unitStats,
		heroStats,
	};
};

module.exports = calculateStats;