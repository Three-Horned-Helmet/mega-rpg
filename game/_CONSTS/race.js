const DEFAULT_LENGTH = 20;
const raceData = {
    "🐎": {
        icon : "🐎",
        weight: 20,
        dotsLength: DEFAULT_LENGTH,
        jump: () => Math.floor(Math.random() * 3.25) + 1,
    },
    "🚴": {
        icon : "🚴",
        weight: 18,
        dotsLength: DEFAULT_LENGTH,
        jump: ()=> Math.floor(Math.random() * 3.35) + 1,
    },
    "🚣": {
        icon : "🚣",
        weight: 17,
        dotsLength: DEFAULT_LENGTH,
        jump: ()=> Math.floor(Math.random() * 2.55) + 2,
    },
    "🦇": {
        icon : "🦇",
        weight: 15,
        dotsLength: DEFAULT_LENGTH,
        jump: ()=> Math.floor(Math.random() * 2.05) + 3,
    },
    "🐪": {
        icon : "🐪",
        weight: 10,
        dotsLength: DEFAULT_LENGTH,
        jump: ()=> Math.floor(Math.random() * 5) - 2,
    },
    "👩‍🦼": {
        icon : "👩‍🦼",
        weight: 8,
        dotsLength: DEFAULT_LENGTH,
        jump: ()=> Math.floor(Math.random() * 3.35) + 3,
    },
    "🐢": {
        icon : "🐢",
        weight: 5,
        dotsLength: DEFAULT_LENGTH,
        jump: ()=> Math.floor(Math.random() * 15) - 3,
    },
    "🦆": {
        icon : "🦆",
        weight: 1,
        dotsLength: DEFAULT_LENGTH,
        jump: ()=> Math.floor(Math.random() * 20) - 5,
    },
};

module.exports = { raceData };