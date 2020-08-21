const DEFAULT_LENGTH = 20;
const raceData = {
	"🐎": {
		icon : "🐎",
		weight: 20,
		dotsLength: DEFAULT_LENGTH,
		jump: () => Math.floor(Math.random() * 3.85) + 1,
	},
	"🚴": {
		icon : "🚴",
		weight: 18,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 3.95) + 1,
	},
	"🚣": {
		icon : "🚣",
		weight: 17,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 2.90) + 2,
	},
	"🦇": {
		icon : "🦇",
		weight: 15,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 3.05) + 2,
	},
	"🐪": {
		icon : "🐪",
		weight: 13,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 3.15) + 2,
	},
	"👩‍🦼": {
		icon : "👩‍🦼",
		weight: 12,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 3.20) + 2,
	},
	"🐢": {
		icon : "🐢",
		weight: 10,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 7) - 3,
	},
	"🦆": {
		icon : "🦆",
		weight: 5,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 10) - 5,
	},
};

module.exports = { raceData };