const Discord = require("discord.js");
const { getIcon } = require("../../_CONSTS/icons");

// Takes an array of results and displays the results
const towerInfoEmbed = (results) => {
	const { combatResults, users, drops, enemy, highestLevel, newLevel, won } = results;
	const username = `${users.map(user => user.account.username).join(", ")} fought ${getIcon("tower header")}${enemy.name}${getIcon("tower header")} in tower level ${highestLevel}!`;
	const sideColor = "#45b6fe";

	const combatResultsField = combatResults.map((cr, index) => {
		const { username: usernameCr, win, lossPercentage: lossPer } = cr;

		const field = {
			name: `${getIcon("tower fight")}Round ${index + 1}${getIcon("tower fight")}`,
			value:
              `${usernameCr} ${win ? "won" : "lost"} the battle with ${Math.floor((1 - lossPer) * 100)}% of the army getting killed of!`,
		};

		return field;
	});

	const wonString = `Congratulations! You won the battle at level ${highestLevel} and advance to the next level: **${newLevel}**.`;
	const lostString = `You lost the battle at level ${highestLevel} and go down to level: **${newLevel}**.\n\nRemaining enemy power: ${combatResults.reduce((acc, cur) => acc + cur.remainingForces, 0)}`;

	const wonIcon = getIcon("tower won");
	const lostIcon = getIcon("tower lost");
	const resultsField = [{
		name: `${won ? wonIcon : lostIcon}Results${won ? wonIcon : lostIcon}`,
		value: won ? wonString : lostString,
	}];

	if(drops.length > 0) {
		drops.forEach(drop => {
			resultsField[0].value += `\n\n__${drop.user.account.username} got a drop!__\n${drop.item}`;
		});
	}

	resultsField.push({
		name: `${getIcon("xp")}Exp rewards${getIcon("xp")}`,
		value: users.map(user => `${user.account.username}: ${combatResults.filter(cr => cr.userId === user.account.userId).reduce((acc, cur) => acc + cur.expReward, 0)} exp`)
	});

	const embedTowerInfo = new Discord.MessageEmbed()
		.setTitle(username)
		.setColor(sideColor)
		.addFields(
			...combatResultsField,
			...resultsField,
		);

	return { embedTowerInfo };
};

module.exports = towerInfoEmbed;