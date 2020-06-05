const allUnits = require("../game/recruit/all-units");
const allItems = require("../game/items/all-items");

// Takes the user and calculates the total amount of combat stats for that user
// Returns an object with the values listed in the user
const calculateStats = (user) => {
	const totalStats = {};
	const unitStats = {};
	const heroStats = {};
	let totalUnits = 0;

	// Get stats from units
	Object.values(user.army.units).forEach(unitType => {
		Object.keys(unitType).forEach(unit =>{
			if(!unit.startsWith("$")) {
				for(const stat in allUnits[unit].stats) {
					unitStats[stat] = unitStats[stat] ? unitStats[stat] + allUnits[unit].stats[stat] : allUnits[unit].stats[stat];
				}
				totalUnits += unitType[unit];
			}
		});
	});

	// Add the stats from the items
	for(const slot in user.army.armory.toJSON()) {
		let slotsTaken = 0;
		const allSlotItems = Object.keys(user.army.armory[slot]).map(item => allItems[item]);

		allSlotItems.sort((a, b) => Object.values(b.stats).reduce((acc, cur) => acc + cur) -
            Object.values(a.stats).reduce((acc, cur) => acc + cur));

		// Add the stats of up to the amount of units that you have (e.g. 60 units can onlyuse 60 helmets)
		allSlotItems.every((item, index) => {
			const iQuantity = user.army.armory[slot][item.name];
			const iToAdd = totalUnits - slotsTaken - iQuantity;
			for(const stat in item.stats) {
				unitStats[stat] += item.stats[stat] * (iToAdd < 0 ? totalUnits - slotsTaken : iQuantity);
			}
			slotsTaken += iToAdd;

			if(slotsTaken >= totalUnits) return false;
			return true;
		});
	}

	// Add hero stats
	heroStats["health"] = heroStats["health"] ? heroStats["health"] + user.hero.health : user.hero.health;
	heroStats["attack"] = heroStats["attack"] ? heroStats["attack"] + user.hero.attack : user.hero.attack;

	// Add Total Stats
	for(const stat in unitStats) {
		totalStats[stat] = unitStats[stat] + heroStats[stat];
	}

	return {
		totalStats,
		unitStats,
		heroStats,
	};
};

module.exports = calculateStats;