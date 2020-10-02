const { weaponInformation } = require("../_CONSTS/weapons");

const getRandomWeapons = (num = 3)=>{
	const alphabet = ["a", "b", "c", "d", "e", "f", "g"];
	const shuffled = Object
		.entries(weaponInformation)
		.sort(() => 0.5 - Math.random())
		.slice(0, num)
		.reduce((obj, [k, v]) => ({
			...obj,
			[k]: v,
		}), {});
		// Sorry
	for (const i in Object.keys(shuffled)) {
		shuffled[Object.keys(shuffled)[i]].answer = alphabet[i];
	}
	return shuffled;
};

const getWeaponInfo = (weapon) => {
	if (weapon && weaponInformation[weapon]) {
		return weaponInformation[weapon];
	}
	return weaponInformation;
};

module.exports = { getRandomWeapons, getWeaponInfo };