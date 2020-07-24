// const { worldLocations } = require("../game/_UNIVERSE");
const { worldLocations } = require("../game/_UNIVERSE");


module.exports = {
	name: "test",
	description: "dev tool",
	async execute(message, args, user) {
		const r = worldLocations["Grassy Plains"].places.Forest;
		console.log(Object.keys(r));
		console.log(typeof r);
		console.log(r.length);

	},
};