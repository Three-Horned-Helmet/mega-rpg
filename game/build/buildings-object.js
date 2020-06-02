// An object of all buildings. If you want to be able to build another structure,
// add it here and it will work

module.exports = {
	barracks:{
		name: "barracks",
		levels: [
			{
				gold: 15,
				oak: 5,
				level: 0,
			},
			{
				gold: 100,
				oak: 20,
				level: 1,
			},
			{
				gold: 200,
				yew: 20,
				level: 2,
			},
		],
	},
	house:{
		name: "house",
		levels: [
			{
				gold: 15,
				oak: 5,
				level: 0,
			},
			{
				gold: 100,
				oak: 20,
				level: 1,
			},
			{
				gold: 200,
				oak: 30,
				level: 2,
			},
		],
	},
};