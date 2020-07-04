const getLocationIcon = (worldLocation)=>{

	const lexicon = {
		"Grassy Plains" : "🌳",
		"Misty Mountains" : "🏔",
		"Deep Caves" : "🌋",
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
const getDungeonKeyIcon = (type) =>{
	const lexicon = {
		["CM Key"]:"🗝",
		["The One Shell"]:"🐚",
		["Eridian Vase"]: "🏺",

	};
	return lexicon[type];
};

const getWeaponIcon = (weapon)=>{
	const lexicon = {
		strike: "🔪",
		critical: "‼️",
		slash: "🗡",
		disarm: "🕊",
		heal: "🧪",
		poke: "👉",
	};
	return lexicon[weapon];
};

const getGreenRedIcon = (bool)=>{
	return bool ? "✅" : "❌";
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
	["xp"]: "🎓",
	};
	return lexicon[type];
};

const getStatsIcon = (type)=>{
	const lexicon = {
	["health"]: ":heart:",
	["attack"]: ":crossed_swords:",
	["defense"]: ":shield:",
	};
	return lexicon[type];
};

module.exports = { getLocationIcon, getPlaceIcon, getResourceIcon, getDungeonKeyIcon, getGreenRedIcon, getStatsIcon, getWeaponIcon };