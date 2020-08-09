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
		jump: ()=> Math.floor(Math.random() * 2.25) + 2,
	},
	"🦇": {
		icon : "🦇",
		weight: 15,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 2.55) + 2,
	},
	"🐪": {
		icon : "🐪",
		weight: 13,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 2.8) + 2,
	},
	"👩‍🦼": {
		icon : "👩‍🦼",
		weight: 12,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 3) + 2,
	},
	"🐢": {
		icon : "🐢",
		weight: 10,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 5) - 3,
	},
	"🦆": {
		icon : "🦆",
		weight: 5,
		dotsLength: DEFAULT_LENGTH,
		jump: ()=> Math.floor(Math.random() * 7) - 5,
	},
};

module.exports = { raceData };