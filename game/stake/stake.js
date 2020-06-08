const { duelFullArmy } = require("../../combat/combat");
const { gainHeroExp } = require("../_CONSTS/hero-exp");
const artifactItems = require("../items/artifact-blacksmith/artifact-blacksmith");

const stakePlayer = async (user, opponent, msg) =>{
   const { response, message } = checkIfStakeIsPossible(user, opponent);
   if(!response) return message;

   return `You lost the duel against ${opponent.account.username}`;
};

const checkIfStakeIsPossible = (user, opponent) =>{
    if(!opponent) {
        return {
            response: false,
            message: "Invalid opponent to stake",
        };
    }

    // Check if both user and opponent have an artifact item equiped
    const doesOwnArtifact = [];
    [user, opponent].forEach(person => {
        Object.values(person.hero.armor).forEach(item => {
            if(artifactItems[item]) {
                doesOwnArtifact.push(person.account.username);
            }
        });
    });

    if(doesOwnArtifact.length !== 2) {
        const doesNotOwnArtifact = [user.account.username, opponent.account.username].filter(u => !doesOwnArtifact.includes(u));
        return{
            response: false,
            message:`These players does not own an artifact item that is required for staking: ${
                doesNotOwnArtifact.join(", ")
            }`,
        };
    }

    return { response: true };
};

module.exports = stakePlayer;