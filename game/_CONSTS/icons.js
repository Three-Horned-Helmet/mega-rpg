const getLocationIcon = (worldLocation)=>{
	const lexicon = {
		"Grassy Plains" : "🌳",
		"Misty Mountains" : "🗻",
	};
	return lexicon[worldLocation];
};

const getPlaceIcon = (type) => {
	const lexicon = {
		raid: "🦹‍♂️",
		hunt: "🐸",
		miniboss: "🧿",
		fishing: "🐡",
		dungeon: "🗺",
	};

	return lexicon[type];
};

module.exports = { getLocationIcon, getPlaceIcon };