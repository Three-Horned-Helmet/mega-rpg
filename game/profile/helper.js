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

const getPlayerPosition = async (discordId, criteria = "hero.currentExp")=>{
    const bestPlayers = await User
    .find({})
    .select("account")
    .sort({ [criteria]:-1 })
    .lean();
	const position = bestPlayers.findIndex(p=> p.account.userId === discordId) + 1;
	if (position > 100) {
		return ">100";
	}
    return position;
};

const generateTip = ()=> {
	let string = "Tip: ";
	const strings = [
		"Supporting Mega RPG on Patreon lowers your cooldown and gives you ingame benefits!",
		"You can gain gold by fishing!",
		"Your elo rating is only affected by staking other players!",
		"Fighting a miniboss is easier if your hero has a high rank!",
		"Shortcut for Large Heal Potion is lhp!",
		"Doing quests allow you to advance into other worlds!",
		"Type !info for available commands!",
		"Daily prizes grows for each consective day you trigger it!",
		"You can recruit stronger units by upgrading your buildings!",
		"Hunting is often easier than raiding!",
		"Make sure to !collect your resources!",
		"Many of the commands have shortcuts, !cooldowns -> !cd",
		"!equip items will increase your stats!",
		"Your surroundings can be explored!",
		"To see your explored areas, type !look",
	];
	string += strings[Math.floor(Math.random() * strings.length)];
	return string;
};


module.exports = { getAllSoldiers, determineSupporterTitle, getPlayerPosition, generateTip };