const { raceData } = require("../_CONSTS/race.js");

const sleep = require("util").promisify(setTimeout);
const { generateRace, generateEndResult, createRaceInvitation } = require("./embedGenerators");
const { createChanceArray, racePayOut, asyncForEach, validateUser } = require("./helpers");
const User = require("../../models/User");
const GOLDPRIZE = 500;

const handleRace = async (message, user)=>{
    const generatedInvitation = createRaceInvitation(user, raceData);

    const raceInvitation = await message.channel.send(generatedInvitation);
    // todo: cooldown

    await asyncForEach(Object.keys(raceData), async (r, i)=>{
        if (i === 5) {
            await raceInvitation.edit(createRaceInvitation(user, raceData, "ready"));
        }
        await raceInvitation.react(r);
    });

    await raceInvitation.edit(createRaceInvitation(user, raceData, "go"));

    const reactionFilter = (reaction) => {
        return Object.keys(raceData).some(r=> r === reaction.emoji.name);
    };

    const participants = new Map();

    const collector = await raceInvitation.createReactionCollector(reactionFilter, { time: 1000 * 10, errors: ["time"] });
    collector.on("collect", async (result, rUser) => {
        if (rUser.bot || participants.size > 9 || participants.has(rUser.id)) {
            return;
        }
        const allowedParticipater = await validateUser(rUser.id);
        if (!allowedParticipater) {
            return;
        }
            else {
            const participater = await User.findOne({ "account.userId":rUser.id });
            participater.removeManyResources({ gold:GOLDPRIZE });
            await participater.save();
        }
        participants.set(rUser.username, { racer:result._emoji.name, userId:rUser.id });
    });
    collector.on("end", async () => {
        if (participants.size < 1) {
            return message.channel.send("Race over - noone participated");
        }
        const event = {
            winner: null,
            participants,
            raceData,
            weightedChance: createChanceArray(raceData),
        };
        await startRace(message, event);
});
};


    const startRace = async (message, event, raceInProgress)=>{
        const raceEmbed = generateRace(event);
        let progress;
        if (raceInProgress) {
           progress = await raceInProgress.edit(raceEmbed);
        }
  else {
            progress = await message.channel.send(raceEmbed);
        }
        if (event.winner) {
            const gameOverResults = generateEndResult(event, raceData);
            await racePayOut(event, raceData);
            return await message.channel.send(gameOverResults);
        }

        const newResults = generateResult(event);

        await sleep(1000);
        return await startRace(message, newResults, progress);

    };

    const generateResult = (event) =>{
        const mover = event.weightedChance[Math.floor(Math.random() * event.weightedChance.length)];
        event.raceData[mover].dotsLength -= event.raceData[mover].jump();
        if (event.raceData[mover].dotsLength <= 0) {
            event.winner = mover;
        }
        return event;
    };


    module.exports = { handleRace };