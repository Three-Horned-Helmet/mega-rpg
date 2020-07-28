const levelTen = require("./level-10");

const getArmyTowerEnemies = (level) => {
	level = level % 100;

	if(level <= 10) {
		if(level === 10) return levelTen.boss;
		const randomEnemy = Math.floor(Math.random() * levelTen.units.length);

		return levelTen.units[randomEnemy];
	}

	// Add the other 90 levels here
};

module.exports = { getArmyTowerEnemies };