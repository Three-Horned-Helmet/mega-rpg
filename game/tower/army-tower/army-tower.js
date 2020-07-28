const { calculatePveFullArmyResult } = require("../../../combat/combat");
const { getArmyTowerEnemies } = require("./army-tower-enemies/army-tower-enemies");

// Takes an array of users and makes them fight together in the Tower
// Category is "solo" or "trio" etc
const armyTowerFight = (users, category) => {
	const highestLevel = users.reduce((acc, cur) => {
		console.log("Acc", acc);
		console.log("Cur", cur.tower[`${category} full-army`]);
		return cur.tower[`${category} full-army`] > acc ? cur.tower[`${category} `] : acc;
	}, 0);

	console.log("highest Level", highestLevel);

	const enemy = getArmyTowerEnemies(highestLevel);

	console.log("ENEMY", enemy);

	const enemyCombatModifier = Math.random() * 0.5 + highestLevel + 1;

	for(const stat in enemy.stats) {
		enemy.stats[stat] = Math.floor(enemy.stats[stat] * enemyCombatModifier);
	}

	console.log("UPDATED ENEMY", enemy);

	const combatResults = users.map(user => calculatePveFullArmyResult(user, enemy));

	console.log("COMBAT RESULTS", combatResults);
};


module.exports = { armyTowerFight };