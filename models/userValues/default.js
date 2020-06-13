const cooldowns = {
    duel:{
        type: Date,
        default: 0,
    },
    dailyPrice:{
        type:Date,
        default:0,
    },
    explore: {
        type:Date,
        default:0,
    },
    fish:{
        type:Date,
        default:0,
    },
    hunt:{
        type:Date,
        default:0,
    },
    raid:{
        type:Date,
        default:0,
    },
    weeklyPrice:{
        type:Date,
        default:0,
    },
};

const statistics = {
    army: {
        type: Number,
        default:0,
    },
    build: {
        type: Number,
        default:0,
    },
    buy: {
        type: Number,
        default:0,
    },
    cooldowns: {
        type: Number,
        default:0,
    },
    craft: {
        type: Number,
        default:0,
    },
    dailyPrice: {
        type: Number,
        default:0,
    },
    duel: {
        type: Number,
        default:0,
    },
    dungeon: {
        type: Number,
        default:0,
    },
    explore: {
        type: Number,
        default:0,
    },
    fish: {
        type: Number,
        default:0,
    },
    look: {
        type: Number,
        default:0,
    },
    miniboss: {
        type: Number,
        default:0,
    },
    raid: {
        type: Number,
        default:0,
    },
    recruit: {
        type: Number,
        default:0,
    },
    stake: {
        type: Number,
        default:0,
    },
    weeklyPrice:{
        type: Number,
        default:0,
    },
};

module.exports = { cooldowns, statistics };