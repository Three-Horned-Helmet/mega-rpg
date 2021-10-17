const {
	generateDungeonBossRound,
	generateDungeonBossResult,
} = require("./embedGenerator");
const { getWeaponInfo } = require("./helper");
const { asyncForEach, randomIntBetweenMinMax } = require("../_GLOBAL_HELPERS/");
const { checkQuest } = require("../quest/quest-utils");


const createDungeonBossRound = async (message, progress) => {
	const { numOfAllowedWeapons } = progress.dungeon.boss;
	const threeRandomWeapons = getWeaponInfo(null, numOfAllowedWeapons);
	progress.dungeon.boss.allowedWeapons = threeRandomWeapons;
	const weaponAnswerFilter = Object.keys(threeRandomWeapons)
		.map((w) => [threeRandomWeapons[w].answer, threeRandomWeapons[w].name])
		.flat();

	const dungeonRound = generateDungeonBossRound(progress);
	await message.channel.send(dungeonRound);

	const filter = (response) => {
		// checks for including in the original team
		return progress.dungeon.helperIds.includes(response.author.id);
	};

	const collector = await message.channel.createMessageCollector(filter, {
		time: 1000 * 20,
		errors: ["time"],
	});
	collector.on("collect", async (result) => {
		if (result.author.bot) {
			return;
		}
		if (progress.weaponAnswer.has(result.author.id)) {
			return message.channel.send("You've already chosen a weapon");
		}
		if (!weaponAnswerFilter.includes(result.content.toLowerCase())) {
			return message.channel.send("Invalid weapon");
		}
		const answer = result.content.toLowerCase();
		// adds answer to progress object
		if (Object.keys(threeRandomWeapons).includes(answer)) {
			progress.weaponAnswer.set(result.author.id, answer);
		}
		else {
			const weaponInformation = Object.values(threeRandomWeapons).find(
				(w) => w.answer === answer
			);
			progress.weaponAnswer.set(result.author.id, weaponInformation.name);
		}
		// stops collecting if all users have answered
		if (progress.weaponAnswer.size >= progress.dungeon.helperIds.length) {
			collector.stop();
		}
	});
	collector.on("end", async () => {
		const result = await calculateDungeonResult(progress);
		if (result.finish) {
			const finalResult = await generateDungeonBossResult(progress);
			message.channel.send(finalResult);
		}
		else {
			return await createDungeonBossRound(message, result);
		}
	});
};

// Calculates the fight between players and boss
// function includes db-calls to set new hp

const calculateDungeonResult = async (progress) => {
	let damageGiven = 0;
	let disarmGiven = 0;
	let bossSelfHeal = 0;

	// cleans up roundResults from previous round
	progress.roundResults = [];

	const awaitHealPromises = {};
	const awaitDamagePromises = {};

	progress.weaponAnswer.forEach(async (weapon, player) => {
		const playerInfo = progress.players.find((p) => {
			return p.account.userId === player;
		});
		const chance = Math.random();

		const weaponInfo = getWeaponInfo(weapon);
		const playerName = playerInfo.account.username;

		if (weaponInfo.chanceforSuccess > chance) {
			if (weaponInfo.type === "attack") {
				const tempDamageGiven = randomIntBetweenMinMax(
					(playerInfo.hero.attack / 2) * weaponInfo.damage,
					playerInfo.hero.attack * weaponInfo.damage
				);
				// playerResult.damageGiven = tempDamageGiven;
				damageGiven += tempDamageGiven;
				progress.roundResults.push(
					generateAttackString(
						playerName,
						weaponInfo,
						tempDamageGiven,
						progress.dungeon.boss.name
					)
				);
			}
			if (weaponInfo.type === "heal") {
				const playerWithLowestHp = progress.players
					.sort((a, b) => a.hero.currentHealth - b.hero.currentHealth)
					.filter((p) => p.hero.currentHealth > 0)[0];
				const playerHealedName = playerWithLowestHp.account.username;
				const healGiven = randomIntBetweenMinMax(
					(playerInfo.hero.health * weaponInfo.damage) / 2,
					playerInfo.hero.health * weaponInfo.damage
				);
				// todo, same thing here as other object
				if (awaitHealPromises[playerHealedName]) {
					awaitHealPromises[playerHealedName].healGiven += healGiven;
				}
				else {
					awaitHealPromises[playerHealedName] = {
						user: playerWithLowestHp,
						damage: healGiven,
					};
				}
				progress.roundResults.push(
					generateHealString(
						playerName,
						weaponInfo,
						healGiven,
						playerHealedName
					)
				);
			}
			if (weaponInfo.type === "disarm") {
				const tempDisarmGiven = randomIntBetweenMinMax(
					(progress.dungeon.boss.stats.attack / 2) * weaponInfo.damage,
					progress.dungeon.boss.stats.attack * weaponInfo.damage
				);
				disarmGiven += tempDisarmGiven;
				progress.roundResults.push(
					generateDisarmString(playerName, weaponInfo, tempDisarmGiven)
				);
			}
		}
	});

	for (let i = 0; i < progress.dungeon.boss.rules.attacksEachRound; i += 1) {
		const alivePlayers = progress.players.filter(
			(p) => p.hero.currentHealth > 0
		);
		const randomPlayer =
      alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

		const bossName = progress.dungeon.boss.name;

		const randomWeaponName =
      progress.dungeon.boss.bossWeapons[Math.floor(Math.random() * progress.dungeon.boss.bossWeapons.length)];
		const weaponInfo = getWeaponInfo(randomWeaponName);
		const { stats } = progress.dungeon.boss;

		if (randomPlayer) {
			if (weaponInfo.type === "attack") {
				const tempDamageGiven = randomIntBetweenMinMax(
					stats.attack * weaponInfo.damage,
					(stats.attack / 2) * weaponInfo.damage
				);

				if (awaitDamagePromises[randomPlayer.account.username]) {
					awaitDamagePromises[
						randomPlayer.account.username
					].damage += tempDamageGiven;
				}
				else {
					awaitDamagePromises[randomPlayer.account.username] = {
						user: randomPlayer,
						damage: tempDamageGiven,
					};
				}
				// removes user from helper array if dead
				if (randomPlayer.hero.currentHealth - tempDamageGiven <= 0) {
					progress.dungeon.helperIds = progress.dungeon.helperIds.filter(
						(h) => h !== randomPlayer.account.userId
					);
				}
				progress.roundResults.push(
					generateAttackString(
						bossName,
						weaponInfo,
						tempDamageGiven,
						randomPlayer.account.username
					)
				);
			}
		}
		if (weaponInfo.type === "heal") {
			const healGiven = randomIntBetweenMinMax(
				stats.health * weaponInfo.damage,
				(stats.health * weaponInfo.damage) / 2
			);
			bossSelfHeal += healGiven;
			progress.roundResults.push(
				generateHealString(bossName, weaponInfo, healGiven)
			);
		}
	}

	// takes care of healing
	await asyncForEach(Object.keys(awaitHealPromises), async (u) => {
		return await awaitHealPromises[u].user.healHero(
			awaitHealPromises[u].healGiven
		);
	});

	// inflicts damage on user document
	await asyncForEach(Object.keys(awaitDamagePromises), async (u) => {
		return await awaitDamagePromises[u].user.heroHpLossFixedAmount(
			awaitDamagePromises[u].damage
		);
	});

	progress.dungeon.boss.stats.currentHealth += bossSelfHeal;

	// prevents boss from healing more than max hp
	if (
		progress.dungeon.boss.stats.currentHealth >=
    progress.dungeon.boss.stats.health
	) {
		progress.dungeon.boss.stats.currentHealth =
      progress.dungeon.boss.stats.health;
	}

	progress.dungeon.boss.stats.currentHealth -= damageGiven;
	progress.dungeon.boss.stats.attack -= disarmGiven;
	progress.bossAttempts += 1;
	progress.weaponAnswer.clear();

	// checks if fight is over
	if (
		progress.dungeon.helperIds.length === 0 ||
    progress.dungeon.boss.stats.currentHealth <= 0 ||
    progress.bossAttempts > 3
	) {
		progress.finish = true;
		progress.win =
      progress.dungeon.helperIds.length &&
      progress.dungeon.boss.stats.currentHealth <= 0;
		if (progress.win) {
			const rewards = await calculateDungeonBossRewards(progress);
			const questPromise = progress.players.map((player) => {
				const { currentLocation } = player.world;
				const { name } = progress.dungeon.boss;

				return new Promise((resolve) => {
					return resolve(checkQuest(player, name, currentLocation));
				});
			});
			await Promise.all(questPromise);

			progress.rewards = rewards;
		}
	}

	return progress;
};

const generateAttackString = (
	playerName,
	weaponInfo,
	damageGiven,
	playerAttacked = null
) => {
	const string = `\n- **${playerName}** used ${weaponInfo.name} attack causing **${damageGiven}** damage to **${playerAttacked}**`;
	return string;
};
const generateHealString = (
	playerName,
	weaponInfo,
	healGiven,
	playerHealed = null
) => {
	if (playerHealed) {
		return `\n${playerName} helead ${playerHealed}. +${healGiven} HP`;
	}
	return `\n${playerName} used self heal. +${healGiven}HP`;
};

const generateDisarmString = (playerName, weaponInfo, disarmGiven) => {
	return `${playerName} used ${weaponInfo.name} to lower the boss attack with ${disarmGiven}`;
};

const calculateDungeonBossRewards = async (progress) => {
	const { initiativeTaker } = progress;
	const initiativeTakerAlive = progress.initiativeTaker.hero.currentHealth > 0;

	const alivePlayers = progress.players.filter(
		(p) =>
			p.hero.currentHealth > 0 &&
      p.account.userId !== initiativeTaker.account.userId
	);
	const helperIds = alivePlayers.length;

	const staticRewards = progress.dungeon.boss.rewards;

	const rewards = {
		initiativeTaker: {},
		helperIds: [],
	};

	if (initiativeTakerAlive) {
		rewards.initiativeTaker.gold = Math.round(staticRewards.gold / 2);
		rewards.initiativeTaker.xp = Math.round(staticRewards.gold / 2);
		rewards.initiativeTaker.drop =
      staticRewards.drop[Math.floor(Math.random() * staticRewards.drop.length)];
		rewards.initiativeTaker.locationUnlocked = progress.dungeon.boss.unlocks;

		await initiativeTaker.alternativeGainXp(rewards.initiativeTaker.xp);
		initiativeTaker.gainManyResources({
			gold: rewards.initiativeTaker.gold,
		});
		initiativeTaker.unlockNewLocation(
			rewards.initiativeTaker.locationUnlocked
		);
		await initiativeTaker.save();
	}

	await asyncForEach(alivePlayers, async (p) => {
		const helperReward = {
			name: p.account.username,
			gold: Math.round(staticRewards.gold / helperIds),
			xp: Math.round(staticRewards.xp / helperIds),
			drop:
        staticRewards.drop[Math.floor(Math.random() * staticRewards.drop.length)],
		};
		p.alternativeGainXp(helperReward.xp);
		p.gainManyResources({ gold: helperReward.gold });
		// await give drop
		rewards.helperIds.push(helperReward);
		await p.save();
	});
	return rewards;
};

module.exports = { createDungeonBossRound };
