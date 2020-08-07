const { duelFullArmy } = require("../../combat/combat");
const { gainHeroExp, removeHeroExp } = require("../_CONSTS/hero-exp");
const artifactItems = require("../items/artifact-blacksmith/artifact-blacksmith");
const calculateStats = require("../../combat/calculate-stats");
const stakeEmbed = require("./stake-embed");
const { eloCalculations } = require("../_GLOBAL_HELPERS");

const stakePlayer = async (user, opponent, stakedItems, msg) =>{
	const { response, message } = checkIfStakeIsPossible(user, opponent, stakedItems);
	if(!response) return message;

	const battleStats = duelFullArmy(user, opponent);
	const { win, winMargin } = battleStats;

	// Set the winner and loser and remove the unit lost
	const winner = win ? user : opponent;
	const loser = win ? opponent : user;

	const elo = {
		eloForWinner: eloCalculations(winner.hero.elo, loser.hero.elo, 1),
		eloForLoser: eloCalculations(loser.hero.elo, winner.hero.elo, 0),
	};

	const { totalStats } = calculateStats(winner);
	const { totalStats: loserStats } = calculateStats(loser);
	battleStats.winnerStats = totalStats;
	battleStats.loserStats = loserStats;

	const totalValue = Object.values(totalStats).reduce((acc, cur) => acc + cur);
	const winnerUnitLoss = 1 - ((totalValue - winMargin) / totalValue) * 0.2;

	winner.changeElo(elo.eloForWinner.newRating);
	await winner.unitLoss(winnerUnitLoss);
	await loser.unitLoss(0.8);

	// Determine item won
	const loserItems = Object.values(opponent.hero.armor).map(item => {
		return artifactItems[item] ? item : false;
	}).filter(item => item);

	const wonItem = loserItems[Math.floor(Math.random() * loserItems.length)];

	loser.removeItem(artifactItems[wonItem], true);
	loser.changeElo(elo.eloForLoser.newRating);
	winner.addItem(artifactItems[wonItem], 1);

	// Determine exp won
	const expWon = Math.floor(opponent.hero.currentExp * 0.2);

	await gainHeroExp(winner, expWon, msg);
	await removeHeroExp(loser, expWon, msg);

	await winner.save();
	await loser.save();
	return stakeEmbed(winner, loser, battleStats, expWon, wonItem, elo);
	// return `${winner.account.username} won the battle with modifiers of ${uModifier} and ${oModifier}. The item won is ${capitalize(wonItem)} and exp won is ${expWon}`;
};

const checkIfStakeIsPossible = (user, opponent, stakedItems) =>{
	if(!opponent) {
		return {
			response: false,
			message: "Invalid opponent to stake",
		};
	}
	const { username } = user.account;
	const { username:oppUsername } = opponent.account;

	// Check if both user and opponent have an artifact item equiped
	const doesOwnArtifact = [];

	[user, opponent].forEach(person => {
		Object.values(person.hero.armor).forEach(item => {
			if(artifactItems[item]) {
				doesOwnArtifact.push(person.account.username);
				if(stakedItems) stakedItems.splice(stakedItems.indexOf(item), 1);
			}
		});
	});

	if(doesOwnArtifact.filter((u, i) => doesOwnArtifact.indexOf(u) === i).length !== 2) {
		const doesNotOwnArtifact = [username, oppUsername].filter(u => !doesOwnArtifact.includes(u));
		return {
			response: false,
			message:`${doesNotOwnArtifact.length === 1 ? "This player" : "These players"} does not have any artifact items equipped on their hero, which is required to stake other players: ${
				doesNotOwnArtifact.join(", ")
			}`,
		};
	}


	// Check if a player has changed out his artifacts between the challenge and the battle start
	if(stakedItems && stakedItems.length > 0) {
		return {
			response: false,
			message:
                `${stakedItems.join(" ")} ${stakedItems.length === 1 ? "is" : "are"
                } missing from the hero equipment and the duel has been canceled`,
		};
	}

	return { response: true };
};

const getStakes = (user) => {
	const artifacts = [];
	Object.values(user.hero.armor).forEach(item => {
		if(artifactItems[item]) {
			artifacts.push(item.replace(/\w\S*/g, (word) => capitalize(word)));
		}
	});
	return artifacts;
};

const capitalize = (word) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};

module.exports = { stakePlayer, checkIfStakeIsPossible, getStakes };