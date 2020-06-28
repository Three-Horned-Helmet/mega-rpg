const User = require("../../models/User");
const GOLDPRIZE = 500;

// https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
const deepCopyFunction = (inObject) => {
    let value, key;

    if (typeof inObject !== "object" || inObject === null) {
      return inObject;
    }

    const outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key];

      outObject[key] = deepCopyFunction(value);
    }

    return outObject;
  };

const createChanceArray = (raceDataCopy)=> {
    const result = [];
    for (const key of Object.keys(raceDataCopy)) {
        for (let i = 0; i < raceDataCopy[key].weight; i += 1) {
          result.push(key);
        }
    }
    return result;
};

const racePayOut = async (event, raceDataCopy) =>{
    const winnersDiscordId = [];
    event.participants.forEach((betInfo)=>{
        if (betInfo.racer === event.winner) {
            winnersDiscordId.push(betInfo.userId);
        }
    });
    let weightedMultiplier = 20 - raceDataCopy[event.winner].weight;
    weightedMultiplier = weightedMultiplier ? weightedMultiplier : 1;

    const reward = weightedMultiplier * GOLDPRIZE + 500;

    const winners = await User.find({ "account.userId":winnersDiscordId });

    if (winners.length) {
        await asyncForEach(winners, async w=>{
            w.gainManyResources({ gold: reward });
            await w.save();
        });
    }
    return;
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }


    const validateUser = async (discordId) =>{
        const user = await User.findOne({ "account.userId": discordId }).lean();
        return user.resources.gold >= GOLDPRIZE;
    };


module.exports = { createChanceArray, racePayOut, asyncForEach, validateUser, deepCopyFunction };