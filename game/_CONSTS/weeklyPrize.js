const weeklyprizes = {
    0: {
        gold:200,
    },
    1: {
        gold: 2000,
        ["oak wood"]: 200,
    },
    2: {
        gold: 5000,
        ["oak wood"]: 800,
    },
    3: {
        gold: 10000,
        ["oak wood"]: 1400,
        ["copper ore"]: 200,
    },
    4: {
        gold: 20000,
        ["oak wood"]: 2000,
        ["copper ore"]: 800,
        ["yew wood"]: 200,
    },
};

const getWeeklyPrize = (week)=>{
    return weeklyprizes[week];
};

module.exports = { getWeeklyPrize };