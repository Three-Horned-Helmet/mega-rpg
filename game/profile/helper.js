const User = require("../../models/User");

const getAllSoldiers = (units) => {
	let result = 0;
	Object.keys(units).forEach(b => {
		Object.values(units[b]).forEach(n => {
			if (typeof n === "number") {
				result += n;
			}
		});
	});
	return result;
};

const determineSupporterTitle = (subscription) => {
	const titles = {
		Bronze: "🎗 Supporter 🎗",
		Silver: "🎖 Supporter 🎖",
		Gold: "👑 Ultra Supporter 👑",
		Platinum: "💎 Epic Supporter 💎",
	};
	const result = subscription ? titles[subscription] : "Casual player";
	return result;
};

// gets best players. use this for simple ranking
/* const getTopExpPlayers = async (limit = 5)=>{
    const bestPlayers = await User
    .find({})
    .sort("hero.currentExp")
    .limit(limit)
    .lean()

    return bestPlayers;
}; */

const getPlayerPosition = async (discordId, criteria = "hero.currentExp")=>{
    const bestPlayers = await User
    .find({})
    .select("account")
    .sort(criteria)
    .lean();
    const position = bestPlayers.findIndex(p=> p.account.userId === discordId);
    return position;
};


module.exports = { getAllSoldiers, determineSupporterTitle, getPlayerPosition };