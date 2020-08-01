const prefixes = {
	"of Boar": {
		chance: 0,
		multiplier: 1,
	},
	"of Cougar": {
		chance: 5,
		multiplier: 1.1,
	},
	"of Bandit": {
		chance: 10,
		multiplier: 1.2,
	},
	"of Outlaw": {
		chance: 15,
		multiplier: 1.3,
	},
	"of the Lords": {
		chance: 20,
		multiplier: 1.4,
	},
	"of the Kings": {
		chance: 25,
		multiplier: 1.5,
	},
	"of Windlow": {
		chance: 30,
		multiplier: 1.6,
	},
	"of Underworld": {
		chance: 35,
		multiplier: 1.65,
	},
	"of Archangels": {
		chance: 40,
		multiplier: 1.70,
	},
	"of Demons": {
		chance: 45,
		multiplier: 1.75,
	},
	"of Mephistopheles": {
		chance: 50,
		multiplier: 1.80,
	},
};

const getRandomPrefix = () => {
	const prefixKeys = Object.keys(prefixes);
	const randomNumber = Math.floor(Math.random() * prefixKeys.length);

	return prefixKeys[randomNumber];
};

const getPrefixMultiplier = (prefix) => {
	const prefixKey = Object.keys(prefixes).find(p => p.toLowerCase() === prefix.toLowerCase());

	return prefixes[prefixKey] ? prefixes[prefixKey].multiplier : 1;
};

const getPrefix = (prefix) => {
	return Object.keys(prefixes).find(originalPrefix => originalPrefix.toLowerCase() === prefix.toLowerCase());
};

module.exports = { getRandomPrefix, getPrefixMultiplier, getPrefix };