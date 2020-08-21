// const { worldLocations } = require("../_UNIVERSE");
const sleep = require("util").promisify(setTimeout);
const { dungeonStartAllowed } = require("./helper");
const { checkQuest } = require("../quest/quest-utils");
const { getIcon } = require("../_CONSTS/icons");

const { createDungeonBossRound } = require("./dungeonBoss");
const { calculatePveFullArmyResult } = require("../../combat/combat");
const {
	generateRoomEmbed,
	generateRoomDescriptionEmbed,
} = require("./embedGenerator");
const { asyncForEach } = require("../_GLOBAL_HELPERS/");

const ICON_FORBIDDEN = getIcon("false", "icon");
const ICON_CHECK = getIcon("true", "icon");

const startDungeonRooms = async (message, progress) => {
	const { initiativeTaker } = progress;

	const disallowed = dungeonStartAllowed(initiativeTaker);
	if (disallowed) {
		return message.channel.send(disallowed);
	}

	const placeInfo = progress.dungeon.rooms[progress.currentRoom];

	const roomDescription = await message.channel.send(
		generateRoomDescriptionEmbed(progress, placeInfo, 1)
	);

	await sleep(3000);
	await roomDescription.edit(
		generateRoomDescriptionEmbed(progress, placeInfo, 2)
	);
	await sleep(3000);
	await roomDescription.edit(
		generateRoomDescriptionEmbed(progress, placeInfo, 3)
	);
	await sleep(4500);

	// perform raid
	const raidResults = progress.players.map((player) => {
		const balancedPlaceInfo = placeInfo;
		balancedPlaceInfo.stats.attack =
			balancedPlaceInfo.stats.attack / progress.players.length;
		balancedPlaceInfo.stats.health =
			balancedPlaceInfo.stats.health / progress.players.length;
		return calculatePveFullArmyResult(player, balancedPlaceInfo);
	});

	let questIntro;
	// saves to database
	await asyncForEach(progress.players, async (player, i) => {
		player.unitLoss(raidResults[i].lossPercentage);
		player.alternativeGainXp(raidResults[i].expReward);

		if (raidResults[i].win) {
			player.gainManyResources(raidResults[i].resourceReward);
			const { currentLocation } = player.world;
			questIntro = await checkQuest(player, placeInfo.name, currentLocation);
		}
		await player.save();
	});

	// removes dead players from event
	progress.players = progress.players.filter((player, i) => {
		if (raidResults[i].win) {
			return player;
		}
		else {
			const playerIndex = progress.dungeon.helperIds.indexOf(
				player.account.userId
			);
			progress.dungeon.helperIds.splice(playerIndex, 1);
		}
	});

	// generates a Discord embed
	const raidEmbed = generateRoomEmbed(
		initiativeTaker,
		placeInfo,
		raidResults,
		questIntro,
		true
	);
	const msg = await message.channel.send(raidEmbed);
	try {
		await msg.react(ICON_FORBIDDEN);
		await msg.react(ICON_CHECK);
	}
	catch (err) {
		console.error("error: ", err);
	}

	const filter = (reaction, rUser) => {
		const emoji = reaction.emoji.name;
		return (
			progress.dungeon.helperIds.includes(rUser.id + "") &&
			(emoji === ICON_CHECK || emoji === ICON_FORBIDDEN)
		);
	};
	const acceptedPlayers = new Set();
	const maxPlayers = progress.dungeon.helperIds.length;

	const collector = await msg.createReactionCollector(filter, {
		max: maxPlayers,
		time: 1000 * 20,
		errors: ["time"],
	});
	collector.on("collect", async (result, rUser) => {
		const emoji = result._emoji.name;
		if (emoji === ICON_FORBIDDEN) {
			// Player chose not to continue the dungeon
			// and are kicked out of group
			const playerIndex = progress.dungeon.helperIds.indexOf(rUser.id);
			progress.dungeon.helperIds.splice(playerIndex, 1);
			progress.players.filter((p) => {
				return progress.dungeon.helperIds.includes(p.account.userId);
			});
		}
		if (emoji === ICON_CHECK) {
			acceptedPlayers.add(rUser.id);
			// stops if all players have accepted
			if (acceptedPlayers.size === progress.dungeon.helperIds.length) {
				collector.stop();
			}
		}
	});

	collector.on("end", async () => {
		const newHelpers = Array.from(acceptedPlayers);

		// if someone dropped did not react, they are kicked out
		if (newHelpers.length !== progress.players.length) {
			progress.players.filter((p) => {
				return newHelpers.includes(p.account.userId);
			});
		}
		// noone wanted to proceed
		if (!newHelpers.length) {
			return message.channel.send("Dungeon raid ended");
		}
		progress.dungeon.helperIds = newHelpers;
		if (progress.currentRoom >= 2) {
			return await createDungeonBossRound(message, progress);
		}
		const { requiredQuest } = progress.dungeon.boss;
		if (!!requiredQuest && !progress.initiativeTaker.completedQuests.includes(requiredQuest)) {
			const { username } = progress.initiativeTaker.account;
			return message.channel.send(
				`${username} has not completed the required quest to proceed`
			);
		}
		progress.currentRoom += 1;
		startDungeonRooms(message, progress);
	});
};

module.exports = { startDungeonRooms };
