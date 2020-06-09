const { duelFullArmy } = require("../../combat/combat");
const { gainHeroExp } = require("../_CONSTS/hero-exp");
const artifactItems = require("../items/artifact-blacksmith/artifact-blacksmith");

const stakePlayer = async (user, opponent, stakedItems) =>{
   const { response, message } = checkIfStakeIsPossible(user, opponent, stakedItems);
   if(!response) return message;

   return `You lost the duel against ${opponent.account.username}`;
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