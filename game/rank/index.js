const User = require("../../models/User");

const handleRank = async (rankType, currentServer, user)=> {
	switch (rankType) {
		case "xp":
			return await getTop10Xp(user, currentServer);
		case "help":
			return await getTop10Xp(user, currentServer, "help");
		case "elo":
			return await getTop10Elo(user, currentServer);
		case "quest":
			return await getTop10Quest(user, currentServer);
		case "army":
			return await getTop10Army(user, currentServer);
		case "sfa":
			return await getTop10Sfa(user, currentServer);
		default:
			return await getTop10Xp(user, currentServer, "help");
	}
};

const getTop10Army = async (user, currentServer = {})=>{
	const allUsers = await User
		.find(currentServer)
		.select(["account", "army", "hero"])
		.sort({ "hero.currentExp":-1 })
		.limit(500)
		.lean();
	const sortedPlayers = allUsers.map(p=>{
		return { name: p.account.username, userId: p.account.userId, total:  getAllSoldiers(p.army.units) } ;
	});
	const top10 = sortedPlayers.slice(0, 10);


	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "👮‍♀️" : "";
		return `\`#${i + 1}: ${first}${p.name}${first} --- ${p.total} army power\``;
	});
	if (!top10.some(player=> player.userId === user.account.userId)) {
		let playerPosition;
		sortedPlayers.forEach((p, i)=>{
			if (p.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${getAllSoldiers(user.army.units)} army power\``);
	}
	return formatted;
};

const getTop10Quest = async (user, currentServer = {})=>{

	const allUsers = await User.aggregate([
		{ $match: currentServer },
		{
			$addFields: {
				completedQuestsLength: {
					$size: "$completedQuests"
				}
			}
		},
		{ $project:{
			account:1,
			completedQuestsLength:1,
			completedQuests: 1
		}
		},
		{
			$sort: {
				completedQuestsLength: -1
			}
		}
	]);

	const top10 = allUsers.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "🔥" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- ${p.completedQuests.length} \``;
	});
	if (!top10.some(player=> player.account.userId === user.account.userId)) {
		let playerPosition;
		allUsers.forEach((p, i)=>{
			if (p.account.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${user.completedQuests.length} \``);
	}
	return formatted;
};

const getTop10Elo = async (user, currentServer = {})=> {

	const allUsers = await User
		.find(currentServer)
		.select(["account", "hero"])
		.sort({ "hero.elo":-1 })
		.lean();

	const top10 = allUsers.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "🎖" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- ${p.hero.elo} \``;
	});

	if (!top10.some(player=> player.account.userId === user.account.userId)) {
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

const getTop10Xp = async (user, currentServer = {}, help = false) => {
	const allUsers = await User
		.find(currentServer)
		.select(["account", "hero"])
		.sort({ "hero.currentExp":-1 })
		.lean();

	const top10 = allUsers.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "💎" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- hero lvl: ${p.hero.rank} - ${p.hero.currentExp} XP\``;
	});

	if (!top10.some(player=> player.account.userId === user.account.userId)) {
		let playerPosition;
		allUsers.forEach((p, i)=>{
			if (p.account.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- hero lvl: ${user.hero.rank} - ${user.hero.currentExp} XP\``);
	}

	if (help && Object.keys(currentServer).length === 0) {
		formatted.push("\n Available rankings are:\n `!rank xp - !rank army - !rank sfa - !rank quest - !rank elo`\n `!rank server` for players on this server!");
	}

	return formatted;
};

const getTop10Sfa = async (user, currentServer = {}) => {
	const allUsers = await User
		.find(currentServer)
		.select(["account", "tower"])
		.sort({ "tower.solo full-army.level":-1 })
		.lean();

	const top10 = allUsers.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "💎" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- tower lvl: ${p.tower["solo full-army"].level}\``;
	});

	if (!top10.some(player=> player.account.userId === user.account.userId)) {
		let playerPosition;
		allUsers.forEach((p, i)=>{
			if (p.account.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- tower lvl: ${user.tower["solo full-army"].level}\``);
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
