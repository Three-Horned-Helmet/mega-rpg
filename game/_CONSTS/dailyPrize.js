const dailyPrizes = {
    0: {
        gold: 50,
    },
    1: {
        gold: 110,
        ["oak wood"]: 50,
    },
    2: {
        gold: 250,
        ["oak wood"]: 110,
    },
    3: {
        gold: 500,
        ["oak wood"]: 250,
        ["copper ore"]: 50,
    },
    4: {
        gold: 1200,
        ["oak wood"]: 500,
        ["copper ore"]: 110,
        ["yew wood"]: 10,
    },
};

const getDailyPrize = (day)=>{
    return dailyPrizes[day];
};

module.exports = { getDailyPrize };