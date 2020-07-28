const prefixes = {
	"of the Boar": {
		chance: 0,
	},
	"of the Cougar": {
		chance: 5,
	},
	"of the Bandit": {
		chance: 10,
	},
	"of the Outlaw": {
		chance: 15,
	},
	"of the Lords": {
		chance: 20,
	},
	"of the Kings": {
		chance: 25,
	},
	"of the Windlow": {
		chance: 30,
	},
	"of the Underworld": {
		chance: 35,
	},
	"of Archangels": {
		chance: 40,
	},
	"of Demons": {
		chance: 45,
	},
	"of Mephistopheles": {
		chance: 50,
	},
};

const getPrefix = () => {
	const randomNumber = Math.random() * 55;

	for(const prefix in prefixes) {
		if(prefixes[prefix].chance < randomNumber && prefixes[prefix].chance > randomNumber + 5) {
			return prefix;
		}
	}
};

module.exports = { getPrefix };