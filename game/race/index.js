const User = require("../../models/User");

const { generateRace, generateEndResult, createRaceInvitation } = require("./embedGenerators");
const { createChanceArray, racePayOut, validateUser } = require("./helpers");
const { asyncForEach, deepCopyFunction } = require("../_GLOBAL_HELPERS");
const { onCooldown } = require("../_CONSTS/cooldowns");
const { getResourceIcon } = require("../_CONSTS/icons");
const sleep = require("util").promisify(setTimeout);

const GOLDPRICE = 40;
const { raceData } = require("../_CONSTS/race.js");


const handleRace = async (message, user)=>{
	const cooldownInfo = onCooldown("race", user);
	if (cooldownInfo.response) {
		return message.channel.send(cooldownInfo.embed);
	}

	if (user.resources.gold <= GOLDPRICE) {
		return message.channel.send(`You need at least ${getResourceIcon("gold")} **${GOLDPRICE}** gold to trigger the race. You have ${getResourceIcon("gold")} **${user.resources.gold}** gold `);
	}
	const now = new Date();
	user.setNewCooldown("race", now);
	await user.save();

	const raceDataCopy = (deepCopyFunction(raceData));
	const generatedInvitation = createRaceInvitation(user, raceDataCopy);

	const raceInvitation = await message.channel.send(generatedInvitation);

	await asyncForEach(Object.keys(raceDataCopy), async (r, i)=>{
		if (i === 5) {
			await raceInvitation.edit(createRaceInvitation(user, raceDataCopy, "ready"));
		}
		await raceInvitation.react(r);
	});

	await raceInvitation.edit(createRaceInvitation(user, raceDataCopy, "go"));

	const reactionFilter = (reaction) => {
		return Object.keys(raceDataCopy).some(r=> r === reaction.emoji.name);
	};

	const participants = new Map();

	const collector = await raceInvitation.createReactionCollector(reactionFilter, { time: 1000 * 10, errors: ["time"] });
	collector.on("collect", async (result, rUser) => {
		if (rUser.bot || participants.size > 9 || participants.has(rUser.id)) {
			return message.channel.send(`<@${rUser.id}>: You can only do one bet!`);
		}
		const participater = await User.findOne({ "account.userId": rUser.id });
		const allowedParticipater = await validateUser(participater);
		if (!allowedParticipater) {
			return message.channel.send(`<@${rUser.id}>: Insufficent gold!`);
		}
		else {
			participater.removeManyResources({ gold:GOLDPRICE });
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
			raceDataCopy,
			weightedChance: createChanceArray(raceDataCopy),
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
		const gameOverResults = generateEndResult(event);
		await racePayOut(event);
		return await message.channel.send(gameOverResults);
	}

	const newResults = generateResult(event);

	await sleep(1000);
	return await startRace(message, newResults, progress);

};

const generateResult = (event) =>{
	const mover = event.weightedChance[Math.floor(Math.random() * event.weightedChance.length)];
	event.raceDataCopy[mover].dotsLength -= event.raceDataCopy[mover].jump();
	if (event.raceDataCopy[mover].dotsLength <= 0) {
		event.winner = mover;
	}
	return event;
};


module.exports = { handleRace };