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


module.exports = { asyncForEach, deepCopyFunction, eloCalculations, randomIntBetweenMinMax, objectFilter };