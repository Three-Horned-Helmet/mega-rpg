const levelTen = require("./level-10");
const levelTwenty = require("./level-20");
const levelThirty = require("./level-30");
const levelForty = require("./level-40");
const levelFifty = require("./level-50");
const levelSixty = require("./level-60");

const getArmyTowerEnemies = (level) => {
	level = level % 100;

	if(level <= 10) {
		return pickUnitHandler(levelTen, level);
		// if(level === 10) return levelTen.boss;
		// const randomEnemy = Math.floor(Math.random() * levelTen.units.length);

		// return levelTen.units[randomEnemy];
	}
	else if(level >= 11 && level <= 20) {
		return pickUnitHandler(levelTwenty, level);
	}
	else if(level >= 21 && level <= 30) {
		return pickUnitHandler(levelThirty, level);
	}
	else if(level >= 31 && level <= 40) {
		return pickUnitHandler(levelForty, level);
	}
	else if(level >= 41 && level <= 50) {
		return pickUnitHandler(levelFifty, level);
	}
	else if(level >= 51 && level <= 60) {
		return pickUnitHandler(levelSixty, level);
	}

	// Add the other 90 levels here

	else {
		if(level % 10 === 0) return levelTen.boss;
		const randomEnemy = Math.floor(Math.random() * levelTen.units.length);

		return levelTen.units[randomEnemy];
	}
};

const pickUnitHandler = (units, level) => {
	if(level === 10) return units.boss;
	const randomEnemy = Math.floor(Math.random() * units.units.length);

	return units.units[randomEnemy];
};

module.exports = { getArmyTowerEnemies };