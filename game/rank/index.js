const User = require("../../models/User");

const handleRank = async (rankType, user)=> {
	switch (rankType) {
		case "xp":
			return await getTop5Xp(user);
		case "help":
			return await getTop5Xp(user, "help");
		case "elo":
			return await getTop5Elo(user);
		case "quest":
			return await getTop5Quest(user);
		case "army":
			return await getTop5Army(user);
		case "sfa":
			return await getTop5Sfa(user);
		default:
			return await getTop5Xp(user, "help");
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

	const top5 = allUsers.slice(0, 5);

	const formatted = top5.map((p, i)=>{
		const first = i === 0 ? "🔥" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- ${p.completedQuests.length} \``;
	});
	if (!top5.some(player=> player.account.userId === user.account.userId)) {
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

const getTop5Xp = async (user, help = false) => {
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

	if (help) {
		formatted.push("\n Available rankings are:\n `!rank xp - !rank army - !rank sfa - !rank quest - !rank elo` ");
	}

	return formatted;
};

const getTop5Sfa = async (user) => {
	const allUsers = await User
		.find({})
		.select(["account", "tower"])
		.sort({ "tower.solo full-army.level":-1 })
		.lean();

	const top5 = allUsers.slice(0, 5);

	const formatted = top5.map((p, i)=>{
		const first = i === 0 ? "💎" : "";
		return `\`#${i + 1}: ${first}${p.account.username}${first} --- tower lvl: ${p.tower["solo full-army"].level}\``;
	});

	if (!top5.some(player=> player.account.userId === user.account.userId)) {
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
