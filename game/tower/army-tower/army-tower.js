const { calculatePveFullArmyResult } = require("../../../combat/combat");
const { getArmyTowerEnemies } = require("./army-tower-enemies/army-tower-enemies");
const { getNewTowerItem, getTowerItem, removeTowerItemFromUser } = require("../../../game/items/tower-items/tower-item-functions");

// Takes an array of users and makes them fight together in the Tower
// Category is "solo" or "trio" etc
const armyTowerFight = async (users, category) => {
	// The results sent to the results embed after the combat
	const allResults = {
		users,
		combatResults: [],
		drops: [],
		enemy: {},
		highestLevel: 0,
		newLevel: 0,
		won: false,
	};

	// user with highest level
	const highestLevel = users.reduce((acc, cur) => {
		return cur.tower[`${category} full-army`].level > acc ? cur.tower[`${category} full-army`].level : acc;
	}, 0);

	const originalEnemy = getArmyTowerEnemies(highestLevel);
	const enemy = { ...originalEnemy, stats: { ...originalEnemy.stats } };

	allResults.enemy = enemy;

	const enemyCombatModifier = Math.pow(highestLevel, 1.4) * 0.5 * (1 + Math.random() * 0.5);

	for(const stat in enemy.stats) {
		enemy.stats[stat] = Math.floor(enemy.stats[stat] * enemyCombatModifier);
	}


	const combatResults = users.map(user => calculatePveFullArmyResult(user, enemy));

	// Make the users lose hero hp and units depending on lossPercentage and give exp
	users.forEach(user => {
		const userCombatResults = combatResults.find(cr => cr.userId === user.account.userId);
		// user.setNewCooldown("tower", new Date());
		user.unitLoss(userCombatResults.lossPercentage, true);
		user.alternativeGainXp(userCombatResults.expReward);
	});

	// While loop to iterate over combat results and let the other users fight the remaining forces
	let losingCombatResults = combatResults.filter(cr => !cr.win);
	const winningCombatResults = combatResults.filter(cr => cr.win);


	let healthLeft = users.filter(user => healthLeftOnArmy(user)).length > 0;

	// This has not been tested yet. It is used when there are several players attending the fight. Lets the remaining players fight the remaining enemies.
	while(!(losingCombatResults.length === 0 || !healthLeft)) {
		losingCombatResults = losingCombatResults.map(cr => {
			const remainingUsers = users.filter(user => healthLeftOnArmy(user));
			const randomUser = Math.floor(Math.random() * remainingUsers.length);

			const newEnemy = { ...enemy };
			const statsLength = Object.keys(newEnemy.stats).length;
			for(const stat in newEnemy.stats) {
				newEnemy[stat] = newEnemy[stat] - Math.floor(cr.remainingForces / statsLength);
			}

			const remainingFightResult = calculatePveFullArmyResult(remainingUsers[randomUser]);
			combatResults.push(remainingFightResult);

			if(remainingFightResult.win) {
				winningCombatResults.push(remainingFightResult);
				return false;
			}
			else {
				return remainingFightResult;
			}
		}).filter(el => el);

		const remainingUsers = users.filter(user => healthLeftOnArmy(user));

		healthLeft = remainingUsers.filter(user => healthLeftOnArmy(user)).length > 0;
	}

	// Add item rewards and progression to the next level if win
	if(losingCombatResults.length === 0) {
		// Progression
		const newLevel = highestLevel + 1;

		users.forEach(user => {
			user.changeTowerLevel(`${category} full-army`, newLevel);
		});

		allResults.highestLevel = highestLevel;
		allResults.newLevel = newLevel;
		allResults.won = true;


		// Add item
		users.filter(user => winningCombatResults.find(wcr => wcr.userId === user.account.userId)).forEach(user => {
			const dropChance = Math.random() * ((winningCombatResults.filter(wcr => wcr.userId === user.account.userId).length / 2) + 0.5);
			let itemDrop;
			if(dropChance > 0.85) {
				itemDrop = getNewTowerItem(highestLevel);
				const itemObject = { ...getTowerItem(itemDrop) };

				const resultTower = removeTowerItemFromUser(user, itemObject);

				// Returns if the droped item is worse
				if(!resultTower) return;

				user.addItem(itemObject);

				// Saves the drops to the results for the Embed
				const userDrop = {
					user,
					item: itemDrop
				};

				allResults.drops.push(userDrop);
			}
		});
	}

	// Go down in a level if loss
	else {
		let newLevel = highestLevel + "";
		newLevel = parseInt(newLevel.slice(0, newLevel.length - 1) + 1);

		users.forEach(user => {
			user.changeTowerLevel(`${category} full-army`, newLevel);
		});

		allResults.highestLevel = highestLevel;
		allResults.newLevel = newLevel;
	}

	users.forEach(user => {
		user.setNewCooldown("tower", new Date());
	});

	// Save the users
	await Promise.all(users.map(user => user.save()));

	allResults.combatResults = combatResults;

	return allResults;
};

// Takes the user and returns true if it still has health left on some units
const healthLeftOnArmy = (user) => {
	const totalUnitsArray = Object.values(user.army.units).map(unitBuild => Object.values(unitBuild)).flat();
	const totalUnits = totalUnitsArray.filter(unitNumbers => typeof unitNumbers === "number").reduce((acc, cur) => acc + cur);
	return totalUnits > 0 || user.hero.currentHealth > 0;
};


module.exports = { armyTowerFight };