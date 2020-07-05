const User = require("../../models/User");

const handleRank = async (rankType, user)=> {
    switch (rankType) {
        case "xp":
            return await getTop5Xp(user);
        case "elo":
            return await getTop5Elo(user);
        case "quest":
            return await getTop5Quest(user);
        case "army":
            return await getTop5Army(user);
        default:
            return await getTop5Xp(user);
        }
};

const getTop5Army = async (user)=>{
    const allUsers = await User
        .find({})
        .select(["account", "army", "hero"])
        .sort({ "hero.currentExp":-1 })
        .limit(500)
        .lean();
    const sortedPlayers = allUsers.map(p=>{
        return { name: p.account.username, userId: p.account.userId, total:  getAllSoldiers(p.army.units) } ;
    });
    const top5 = sortedPlayers.slice(0, 5);


    const formatted = top5.map((p, i)=>{
        console.log(p, "p");
        const first = i === 0 ? "👮‍♀️" : "";
            return `\`#${i + 1}: ${first}${p.name}${first} --- ${p.total} soldiers\``;
        });
    if (!top5.some(player=> player.userId === user.account.userId)) {
        let playerPosition;
        sortedPlayers.forEach((p, i)=>{
            if (p.userId === user.account.userId) {
                playerPosition = i + 1;
            }
        });
        formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${getAllSoldiers(user.army.units)} soldiers\``);
    }
    return formatted;
};

const getTop5Quest = async (user)=>{
    const allUsers = await User
        .find({})
        .select(["account", "quests"])
        .sort({ "completedQuests":-1 })
        .lean();

    const top5 = allUsers.slice(0, 5);

    const formatted = top5.map((p, i)=>{
        const first = i === 0 ? "🔥" : "";
            return `\`#${i + 1}: ${first}${p.account.username}${first} --- ${p.quests.length} \``;
        });
    if (!top5.some(player=> player.account.userId === user.account.userId)) {
        let playerPosition;
        allUsers.forEach((p, i)=>{
            if (p.account.userId === user.account.userId) {
                playerPosition = i + 1;
            }
        });
        formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${user.quests.length} \``);
    }
    return formatted;
};

const getTop5Elo = async (user)=> {

    const allUsers = await User
        .find({})
        .select(["account", "hero"])
        .sort({ "hero.elo":-1 })
        .lean();

    const top5 = allUsers.slice(0, 5);

    const formatted = top5.map((p, i)=>{
        const first = i === 0 ? "🎖" : "";
            return `\`#${i + 1}: ${first}${p.account.username}${first} --- ${p.hero.elo} \``;
        });

    if (!top5.some(player=> player.account.userId === user.account.userId)) {
        let playerPosition;
        allUsers.forEach((p, i)=>{
            if (p.account.userId === user.account.userId) {
                playerPosition = i + 1;
            }
        });
        formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${user.hero.elo} \``);
    }

    return formatted;
};

const getTop5Xp = async (user) => {
    const allUsers = await User
        .find({})
        .select(["account", "hero"])
        .sort({ "hero.currentExp":-1 })
        .lean();

    const top5 = allUsers.slice(0, 5);

    const formatted = top5.map((p, i)=>{
        const first = i === 0 ? "💎" : "";
            return `\`#${i + 1}: ${first}${p.account.username}${first} --- hero lvl: ${p.hero.rank} - ${p.hero.currentExp} XP\``;
        });

    if (!top5.some(player=> player.account.userId === user.account.userId)) {
        let playerPosition;
        allUsers.forEach((p, i)=>{
            if (p.account.userId === user.account.userId) {
                playerPosition = i + 1;
            }
        });
        formatted.push(`\`#${playerPosition}: ${user.account.username} --- hero lvl: ${user.hero.rank} - ${user.hero.currentExp} XP\``);
    }

    return formatted;
};


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


module.exports = { handleRank };