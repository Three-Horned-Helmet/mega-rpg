const User = require("../../models/User");
const GOLDPRICE = 40;
const { asyncForEach } = require("../_GLOBAL_HELPERS");

const createChanceArray = (raceDataCopy)=> {
    const result = [];
    for (const key of Object.keys(raceDataCopy)) {
        for (let i = 0; i < raceDataCopy[key].weight; i += 1) {
          result.push(key);
        }
    }
    return result;
};

const racePayOut = async (event) =>{
    const winnersDiscordId = [];
    event.participants.forEach((betInfo)=>{
        if (betInfo.racer === event.winner) {
            winnersDiscordId.push(betInfo.userId);
        }
    });
    let weightedMultiplier = 20 - event.raceDataCopy[event.winner].weight;
    weightedMultiplier = weightedMultiplier ? weightedMultiplier : 1;

    const reward = weightedMultiplier * GOLDPRICE + 40;

    const winners = await User.find({ "account.userId":winnersDiscordId });

    if (winners.length) {
        await asyncForEach(winners, async w=>{
            w.gainManyResources({ gold: reward });
            await w.save();
        });
    }
    return;
};

    const validateUser = async (discordId) =>{
        const user = await User.findOne({ "account.userId": discordId }).lean();
        return user.resources.gold >= GOLDPRICE;
    };


module.exports = { createChanceArray, racePayOut, validateUser };