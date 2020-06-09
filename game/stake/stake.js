const { duelFullArmy } = require("../../combat/combat");
const { gainHeroExp } = require("../_CONSTS/hero-exp");
const artifactItems = require("../items/artifact-blacksmith/artifact-blacksmith");
const calculateStats = require("../../combat/calculate-stats");

const stakePlayer = async (user, opponent, stakedItems, msg) =>{
   const { response, message } = checkIfStakeIsPossible(user, opponent, stakedItems);
   if(!response) return message;

    const { win, winMargin, uModifier, oModifier } = duelFullArmy(user, opponent);

    // Set the winner and loser and remove the unit lost
    const winner = win ? user : opponent;
    const loser = win ? opponent : user;

    const { totalStats } = calculateStats(winner);
    const totalValue = Object.values(totalStats).reduce((acc, cur) => acc + cur);
    const winnerUnitLoss = 1 - ((totalValue - winMargin) / totalValue) * 0.2;

    console.log("WINNER UNIT LOSS", winnerUnitLoss);
    await winner.unitLoss(winnerUnitLoss);
    await loser.unitLoss(0.8);

    // Determine item won
    const loserItems = Object.values(opponent.hero.armor).map(item => {
            return artifactItems[item] ? item : false;
        }).filter(item => item);

        const wonItem = loserItems[Math.floor(Math.random() * loserItems.length)];

        console.log(wonItem, artifactItems[wonItem], loserItems);
        await loser.removeItem(artifactItems[wonItem], true);
        await winner.addItem(artifactItems[wonItem], 1);

    // Determine exp won
    const expWon = Math.floor(opponent.hero.currentExp * 0.2);

    await gainHeroExp(user, expWon, msg);
    // ADD REMOVEHEROEXP HERE!!


   return `${winner.account.username} won the battle with modifiers of ${uModifier} and ${oModifier}. The item won is ${capitalize(wonItem)} and exp won is ${expWon}`;
};

const checkIfStakeIsPossible = (user, opponent, stakedItems) =>{
    console.log("STAKED ITEMS", stakedItems);
    if(!opponent) {
        return {
            response: false,
            message: "Invalid opponent to stake",
        };
    }
    const { username } = user.account;
    const { oppUsername } = opponent.account;

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
            message:`It is not allowed to change equipment while waiting for stake to be accepted. These items are missing: ${
                doesNotOwnArtifact.join(", ")
            }`,
        };
    }

    console.log("SECOND STAKE", stakedItems);

    // Check if a player has changed out his artifacts between the challenge and the battle start
    if(stakedItems && stakedItems.length > 0) {
        return {
            response: false,
            message:
                `${
                    stakedItems.join(" ")} ${stakedItems.length === 1 ? "is" : "are"
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