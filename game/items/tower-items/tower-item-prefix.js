const prefixes = {
	"of the Boar": {
		chance: 0,
		multiplier: 1,
	},
	"of the Cougar": {
		chance: 5,
		multiplier: 1.1,
	},
	"of the Bandit": {
		chance: 10,
		multiplier: 1.2,
	},
	"of the Outlaw": {
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
	"of the Windlow": {
		chance: 30,
		multiplier: 1.6,
	},
	"of the Underworld": {
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
	return prefixes[prefix].multiplier || 1;
};

module.exports = { getRandomPrefix, getPrefixMultiplier };