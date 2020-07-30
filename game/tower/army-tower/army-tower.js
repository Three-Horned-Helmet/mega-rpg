const { calculatePveFullArmyResult } = require("../../../combat/combat");
const { getArmyTowerEnemies } = require("./army-tower-enemies/army-tower-enemies");
const { getNewTowerItem, getTowerItem } = require("../../../game/items/tower-items/tower-item-functions");
// Takes an array of users and makes them fight together in the Tower
// Category is "solo" or "trio" etc
const armyTowerFight = async (users, category) => {
	const highestLevel = users.reduce((acc, cur) => {
		return cur.tower[`${category} full-army`].level > acc ? cur.tower[`${category} full-army`].level : acc;
	}, 0);

	console.log("highest Level", highestLevel);

	const originalEnemy = getArmyTowerEnemies(highestLevel);
	const enemy = { ...originalEnemy, stats: { ...originalEnemy.stats } };

	console.log("ENEMY", enemy);

	const enemyCombatModifier = highestLevel * 0.8 * (1 + Math.random() * 0.5);

	for(const stat in enemy.stats) {
		enemy.stats[stat] = Math.floor(enemy.stats[stat] * enemyCombatModifier);
	}

	console.log("UPDATED ENEMY", enemy);

	const combatResults = users.map(user => calculatePveFullArmyResult(user, enemy));

	console.log("COMBAT RESULTS", combatResults);

	// Make the users lose hero hp and units depending on lossPercentage and give exp
	users.forEach(user => {
		const userCombatResults = combatResults.find(cr => cr.userId === user.account.userId);
		// user.setNewCooldown("tower", new Date());
		user.unitLoss(userCombatResults.lossPercentage);
		user.alternativeGainXp(userCombatResults.expReward);
	});

	// While loop to iterate over combat results and let the other users fight the remaining forces
	let losingCombatResults = combatResults.filter(cr => !cr.win);
	const winningCombatResults = combatResults.filter(cr => cr.win);


	let healthLeft = users.filter(user => healthLeftOnArmy(user)).length > 0;
	console.log("Before WHILE", losingCombatResults.length, !healthLeft);

	// This has not been tested yet
	while(!(losingCombatResults.length === 0 || !healthLeft)) {
		console.log("WHILE LOOP");

		losingCombatResults = losingCombatResults.map(cr => {
			const remainingUsers = users.filter(user => healthLeftOnArmy(user));
			const randomUser = Math.floor(Math.random() * remainingUsers.length);

			const newEnemy = { ...enemy };
			const statsLength = Object.keys(newEnemy.stats).length;
			for(const stat in newEnemy.stats) {
				newEnemy[stat] = newEnemy[stat] - Math.floor(cr.remainingForces / statsLength);
			}

			console.log("NEW ENEMIES", newEnemy, enemy);

			const remainingFightResult = calculatePveFullArmyResult(remainingUsers[randomUser]);

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
		console.log("HEALTH LEFT", healthLeft);
	}

	let response;
	// Add item rewards and progression to the next level if win
	if(losingCombatResults.length === 0) {
		const newLevel = highestLevel + 1;

		users.forEach(user => {
			user.changeTowerLevel(`${category} full-army`, newLevel);
		});

		response = {
			message: `You won the battle at level ${highestLevel} and advance to the next level: **${newLevel}**.`
		};

		// Add item
		users.filter(user => winningCombatResults.find(wcr => wcr.userId === user.account.userId)).forEach(user => {
			const dropChance = Math.random() * ((winningCombatResults.filter(wcr => wcr.userId === user.account.userId).length / 2) + 0.5);
			let itemDrop;
			if(dropChance > 0.85) {
				itemDrop = getNewTowerItem(highestLevel);
				const itemObject = { ...getTowerItem(itemDrop) };

				user.addItem(itemObject);

				response.message += `In the battle ${user.account.username} found a new item: ${itemDrop}`;
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

		response = {
			message: `You lost the battle at level ${highestLevel} and go down to level: **${newLevel}**`
		};
	}

	// Save the users
	await Promise.all(users.map(user => user.save()));

	return response;
};

// Takes the user and returns true if it still has health left on some units
const healthLeftOnArmy = (user) => {
	const totalUnitsArray = Object.values(user.army.units).map(unitBuild => Object.values(unitBuild)).flat();

	const totalUnits = totalUnitsArray.filter(unitNumbers => typeof unitNumbers === "number").reduce((acc, cur) => acc + cur);

	if(totalUnits > 0 || user.hero.currentHealth > 0) return true;
	return false;
};


module.exports = { armyTowerFight };