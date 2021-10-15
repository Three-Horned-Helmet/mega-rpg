const User = require("../../models/User");

// foreach that respects async
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index += 1) {
		await callback(array[index], index, array);
	}
}

// deep copies an array or object
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

// fightResult: [1, 0.5, 0] (1 means that playerRating won the fight)
// eloCalculations(1000,1500,1) --> { delta: 30, newRating: 1030 }
const eloCalculations = (playerRating, opponentRating, fightResult)=>{
	if (![0, 0.5, 1].includes(fightResult)) {
		console.error("fightResult must be either 1, 0.5 or 0 (Number)");
		return null;
	}

	const chanceToWin = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
	const delta = Math.round(32 * (fightResult - chanceToWin));
	const newRating = playerRating + delta;

	return {
		delta,
		newRating,
	};
};

const randomIntBetweenMinMax = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

// works as .filter for arrays, but objects
// https://stackoverflow.com/questions/5072136/javascript-filter-for-objects
// usage: objectFilter(someObject, x => x > 1);
const objectFilter = (obj, predicate) => {
	return Object.keys(obj)
		.filter(key => predicate(obj[key]))
		.reduce((res, key) => (res[key] = obj[key], res), {});
};

const msToHumanTime = (ms)=>{
	const oneDayInMs = 8.64e+7;
	if (ms >= oneDayInMs) {
		const days = Math.round(ms / oneDayInMs);
		return `${days} days`;
	}
	const humanTime = new Date(ms).toISOString().slice(11, 19).split(":");
	["h ", "m ", "s"].forEach((t, i)=>{
		humanTime[i] += t;
	});
	return humanTime.join("");
};

// calculates gold per minute through taxes
const calculateGoldGained = (user, taxOfficeBuilding, now) => {
	// (all buildings level + total completed quests) / 10 * (1 tax office.level / 4) * minutesSinceLastCollect

	const { lastCollected, level } = taxOfficeBuilding;
	let minutesSinceLastCollect = (now - lastCollected) / 60000;
	const fourHoursInMinutes = 240;
	if (minutesSinceLastCollect > fourHoursInMinutes) minutesSinceLastCollect = fourHoursInMinutes;
	const totalBuildingLevels = user.empire.reduce((acc, building) => acc + building.level + 1, 0);
	const totalCompletedQuests = user.completedQuests.length;
	const taxOfficeMultiplier = level === 0 ? 0 : level / 4;
	const goldPerMinute = Math.round((totalBuildingLevels + totalCompletedQuests) / 10 * (1 + taxOfficeMultiplier));
	const availableGoldToCollect = Math.round(goldPerMinute * minutesSinceLastCollect);
	return { availableGoldToCollect, goldPerMinute, totalBuildingLevels, totalCompletedQuests, taxOfficeMultiplier, taxOfficeLevel:level };
};

const getWelcomeMessage = (user) => {
	return `Welcome to Mega-RPG, ${user.account.username}!\n\nIt's recommended to start by completing the tutorial quest line.\nYou can start it by typing \`!quest\` in the chat. To see all available commands you can type \`!help\` or to get a more detailed version of what the commands do type \`!info\`!\n\nGood luck adventurer!`;
};

const createNewUser = (user, channelId) => {
	if (user.bot) {
		console.error("No bots allowed");
		return;
	}
	const account = {
		username: user.username,
		userId: user.id,
		servers:[channelId]
	};
	const newUser = new User({ account });
	return newUser.save();
};


module.exports = { asyncForEach, deepCopyFunction, eloCalculations, randomIntBetweenMinMax, objectFilter, msToHumanTime, calculateGoldGained, getWelcomeMessage, createNewUser };