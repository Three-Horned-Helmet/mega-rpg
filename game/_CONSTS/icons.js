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
		miniboss: "🧟",
		fish: "🐡",
		dungeon: "🗺",
	};

	return lexicon[type];
};

const getResourceIcon = (type)=>{
	const lexicon = {
	["gold"]: ":moneybag:",
	["oak wood"]: ":evergreen_tree:",
	["yew wood"]: ":deciduous_tree:",
	["copper ore"]: ":orange_circle:",
	["iron ore"]: ":white_circle:",
	["bronze bar"]: ":orange_square:",
	["iron bar"]: ":white_large_square:",
	["steel bar"]: ":brown_square:",
	};
	return lexicon[type];
};

module.exports = { getLocationIcon, getPlaceIcon, getResourceIcon };