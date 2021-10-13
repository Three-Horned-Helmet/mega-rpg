const User = require("../../models/User");
const calculateStats = require("../../combat/calculate-stats");

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
			return await getTop10Xp(user, currentServer);
	}
};

const getTop10Army = async (user, currentServer)=>{
	const allUsers = await User
		.find()
		.select(["account", "army", "hero"])
		.sort({ "hero.currentExp":-1 })
		.limit(500)
		.lean();
	const sortedPlayers = allUsers.map(p=>{
		return { account: p.account, name: p.account.username, userId: p.account.userId, total:  calculateStats(p).unitStats.attack } ;
	});

	sortedPlayers.sort((a, b)=>b.total - a.total);

	const allUsersInServer = sortedPlayers.filter(player=> player.account.servers.includes(currentServer));

	const top10 = allUsersInServer.slice(0, 10);


	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "👮‍♀️" : "";
		return `\`#${i + 1}: ${first}${p.name}${first} --- ${p.total} army strength\``;
	});
	if (!top10.some(player=> player.userId === user.account.userId)) {
		let playerPosition;
		allUsersInServer.forEach((p, i)=>{
			if (p.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${calculateStats(user).unitStats.attack} army strength\``);
	}
	formatted.push(getGlobalPosition(sortedPlayers, user.account.userId));

	return formatted;
};

const getTop10Quest = async (user, currentServer) => {

	const allUsers = await User.aggregate([
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

	const allUsersInServer = allUsers.filter(player=> player.account.servers.includes(currentServer));

	const top10 = allUsersInServer.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "🔥" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- ${p.completedQuests.length} \``;
	});
	if (!top10.some(player=> player.account.userId === user.account.userId)) {
		let playerPosition;
		allUsersInServer.forEach((p, i)=>{
			if (p.account.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${user.completedQuests.length} \``);
	}
	formatted.push(getGlobalPosition(allUsers, user.account.userId));

	return formatted;
};

const getTop10Elo = async (user, currentServer)=> {

	const allUsers = await User
		.find()
		.select(["account", "hero"])
		.sort({ "hero.elo":-1 })
		.lean();

	const allUsersInServer = allUsers.filter(player=> player.account.servers.includes(currentServer));

	const top10 = allUsersInServer.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "🎖" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- ${p.hero.elo} \``;
	});

	if (!top10.some(player=> player.account.userId === user.account.userId)) {
		let playerPosition;
		allUsersInServer.forEach((p, i)=>{
			if (p.account.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- ${user.hero.elo} \``);
	}
	formatted.push(getGlobalPosition(allUsers, user.account.userId));

	return formatted;
};

const getTop10Xp = async (user, currentServer, help = false) => {
	const allUsers = await User
		.find()
		.select(["account", "hero"])
		.sort({ "hero.currentExp":-1 })
		.lean();

	const allUsersInServer = allUsers.filter(player=> player.account.servers.includes(currentServer));

	const top10 = allUsersInServer.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "💎" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- hero lvl: ${p.hero.rank} - ${p.hero.currentExp} XP\``;
	});

	if (!top10.some(player=> player.account.userId === user.account.userId)) {
		let playerPosition;
		allUsersInServer.forEach((p, i)=>{
			if (p.account.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- hero lvl: ${user.hero.rank} - ${user.hero.currentExp} XP\``);
	}
	formatted.push(getGlobalPosition(allUsers, user.account.userId));

	if (help) {
		formatted.push("\n Available rankings are:\n `!rank xp - !rank army - !rank sfa - !rank quest - !rank elo`");
	}

	return formatted;
};

const getTop10Sfa = async (user, currentServer) => {
	const allUsers = await User
		.find()
		.select(["account", "tower"])
		.sort({ "tower.solo full-army.level":-1 })
		.lean();

	const allUsersInServer = allUsers.filter(player=> player.account.servers.includes(currentServer));

	const top10 = allUsersInServer.slice(0, 10);

	const formatted = top10.map((p, i)=>{
		const first = i === 0 ? "💎" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- tower lvl: ${p.tower["solo full-army"].level}\``;
	});

	if (!top10.some(player=> player.account.userId === user.account.userId)) {
		let playerPosition;
		allUsersInServer.forEach((p, i)=>{
			if (p.account.userId === user.account.userId) {
				playerPosition = i + 1;
			}
		});
		formatted.push(`\`#${playerPosition}: ${user.account.username} --- tower lvl: ${user.tower["solo full-army"].level}\``);
	}
	formatted.push(getGlobalPosition(allUsers, user.account.userId));

	return formatted;
};

const getGlobalPosition = (allUsers, userId)=>{
	let globalPlayerPosition;
	allUsers.forEach((p, i)=>{
		if (p.account.userId === userId) {
			globalPlayerPosition = i + 1;
		}
	});
	return `\n\`Your Global position: #${globalPlayerPosition} \``;
};

module.exports = { handleRank };
