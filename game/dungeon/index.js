const User = require("../../models/User");
const { worldLocations } = require("../_CONSTS/explore");

const { createDungeonInvitation, generateDungeonBossRound, generateDungeonBossResult } = require("./embedGenerator");
const { getWeaponInfo, dungeonBossStartAllowed, validateHelper, randomIntBetweenMinMax } = require("./helper");

const handleDungeonBoss = async (message, user)=>{
    // cooldown, health, explored dungeon and dungeon key
    const disallowed = dungeonBossStartAllowed(user);
		if (disallowed) {
            return message.channel.send(disallowed);
        }

    const dungeon = createDungeonEvent(user);

    const now = new Date();
    await user.setNewCooldown("dungeon", now);

    const dungeonInvitation = createDungeonInvitation(dungeon, user);
    const invitation = await message.channel.send(dungeonInvitation);
    await invitation.react("🗺");

    const reactionFilter = (reaction) => {
        return reaction.emoji.name === "🗺";
    };

    const collector = await invitation.createReactionCollector(reactionFilter, { time: 1000 * 5, errors: ["time"] });
    collector.on("collect", async (result, rUser) => {
        if (rUser.bot || dungeon.boss.helpers.length > 4) {
            return;
        }
        if (dungeon.boss.helpers.includes(rUser.id)) {
            return;
        }
        const allowedHelper = await validateHelper(rUser.id);
        if (!allowedHelper) {
            return;
        }
        dungeon.boss.helpers.push(rUser.id);
    });

     collector.on("end", async () => {
        await startDungeonEvent(message, dungeon);
    });
};

// Finds dungeon in current world
const createDungeonEvent = (user) =>{
    const { currentLocation } = user.world;
    const dungeonName = Object.keys(worldLocations[currentLocation].places).find(p=>{
        return worldLocations[currentLocation].places[p].type === "dungeon";
    });
    const dungeon = worldLocations[currentLocation].places[dungeonName];
    dungeon.boss.helpers.unshift(user.account.userId);
    return dungeon;
};


// c
const startDungeonEvent = async (message, dungeon) => {
    const users = await User.find({ "account.userId": dungeon.boss.helpers });
    const initiativeTaker = users.filter(u=> u.account.userId === dungeon.boss.helpers[0]);

    const progress = {
        win: false,
        bossAttempts: 0,
        currentRoom:0,
        initiativeTaker: initiativeTaker[0],
        players: users,
        dungeon: dungeon,
        roundResults:[],
        weaponAnswer:new Map(),
    };

    // recursive starts here
    const result = await createDungeonRound(message, progress);
    message.channel.send(result);

};

const createDungeonRound = async (message, progress)=>{

    const { numOfAllowedWeapons } = progress.dungeon.boss;
    const threeRandomWeapons = getWeaponInfo(null, numOfAllowedWeapons);
    progress.dungeon.boss.allowedWeapons = threeRandomWeapons;
    const weaponAnswerFilter = Object.keys(threeRandomWeapons).map(w=> [threeRandomWeapons[w].answer, threeRandomWeapons[w].name]).flat();

    // send a nice embed here
    const dungeonRound = generateDungeonBossRound(progress);
    await message.channel.send(dungeonRound);

        const filter = (response) => {
            // checks for not already submitted answer, includes in the original team and answer is among the accepted answers.
            return progress.weaponAnswer.has(response.author.id) === false && progress.dungeon.boss.helpers.includes(response.author.id) && weaponAnswerFilter.some(alternative => alternative === response.content.toLowerCase());
        };

        const collector = await message.channel.createMessageCollector(filter, { time: 1000 * 5, errors: ["time"] });
        collector.on("collect", async (result)=>{
            if (result.author.bot) {
                return;
            }
            const answer = result.content.toLowerCase();
            // adds answer to progress object
            if (Object.keys(threeRandomWeapons).includes(answer)) {
                progress.weaponAnswer.set(result.author.id, answer);
            }
            else {
                const weaponInformation = Object.values(threeRandomWeapons).find(w=>w.answer === answer);
                progress.weaponAnswer.set(result.author.id, weaponInformation.name);
            }
            // stops collecting if all users have answered
            if (progress.weaponAnswer.size >= progress.dungeon.boss.helpers.length) {
                collector.stop();
            }
        });
        collector.on("end", async () => {
            const result = await calculateDungeonResult(progress);
            if (result.dungeon.boss.helpers.length && result.dungeon.boss.stats.currentHealth > 0 && result.bossAttempts < 4) {
                await createDungeonRound(message, result);
            }
            else {
                console.error("round over");
                console.error(result.dungeon.boss.helpers.length, result.dungeon.boss.stats.currentHealth > 0, result.bossAttempts < 4);
                return generateDungeonBossResult(progress);
            }
    });
};

// Calculates the fight between players and boss
// function includes db-calls to set new hp

const calculateDungeonResult = async (progress)=>{
    let damageGiven = 0;
    let disarmGiven = 0;
    let bossSelfHeal = 0;

    // cleans up roundResults from previous round
    progress.roundResults = [];

    const awaitHealPromises = {};
    const awaitDamagePromises = {};

    progress.weaponAnswer.forEach(async (weapon, player)=>{
        const playerInfo = progress.players.find(p=>{
            return p.account.userId === player;
        });
        const chance = Math.random();

        const weaponInfo = getWeaponInfo(weapon);
        const playerName = playerInfo.account.username;

        if (weaponInfo.chanceforSuccess > 0) {
            if (weaponInfo.type === "attack") {
                const tempDamageGiven = randomIntBetweenMinMax(playerInfo.hero.attack / 2 * weaponInfo.damage, (playerInfo.hero.attack * weaponInfo.damage));
                // playerResult.damageGiven = tempDamageGiven;
                damageGiven += tempDamageGiven;
                progress.roundResults.push(generateAttackString(playerName, weaponInfo, tempDamageGiven, progress.dungeon.boss.name));
            }
            if (weaponInfo.type === "heal") {
                const playerWithLowestHp = progress.players
                    .sort((a, b)=>a.hero.currentHealth - b.hero.currentHealth)
                    .filter(p=> p.hero.currentHealth > 0)[0];
                const playerHealedName = playerWithLowestHp.account.username;
                const healGiven = randomIntBetweenMinMax((playerInfo.hero.health * weaponInfo.damage / 2), (playerInfo.hero.health * weaponInfo.damage));
                // todo, same thing here as other object
                await playerWithLowestHp.healHero(healGiven);
                if (awaitHealPromises[playerHealedName]) {
                    awaitHealPromises[playerHealedName].healGiven += healGiven;
                }
                    else {
                        awaitHealPromises[playerHealedName] = {
                        user: playerWithLowestHp,
                        damage: healGiven,
                    };
                }
                progress.roundResults.push(generateHealString(playerName, weaponInfo, healGiven, playerHealedName));

            }
            if (weaponInfo.type === "disarm") {
                const tempDisarmGiven = randomIntBetweenMinMax((progress.dungeon.boss.stats.attack / 2 * weaponInfo.damage), (progress.dungeon.boss.stats.attack * weaponInfo.damage));
                disarmGiven += tempDisarmGiven;
                progress.roundResults.push(generateDisarmString(playerName, weaponInfo, tempDisarmGiven));
            }
        }
    });


    for (let i = 0; i < progress.dungeon.boss.rules.attacksEachRound; i += 1) {
        const alivePlayers = progress.players.filter(p=> p.hero.currentHealth > 0);
        const randomPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

        const bossName = progress.dungeon.boss.name;

        const randomWeaponName = progress.dungeon.boss.bossWeapons[Math.floor(Math.random() * progress.dungeon.boss.bossWeapons.length)];
        const weaponInfo = getWeaponInfo(randomWeaponName);
        const { stats } = progress.dungeon.boss;

        if (randomPlayer) {
            if (weaponInfo.type === "attack") {
                const tempDamageGiven = randomIntBetweenMinMax((stats.attack * weaponInfo.damage), (stats.attack / 2 * weaponInfo.damage));

                if (awaitDamagePromises[randomPlayer.account.username]) {
                    awaitDamagePromises[randomPlayer.account.username].damage += tempDamageGiven;
                }
                    else {
                    awaitDamagePromises[randomPlayer.account.username] = {
                        user: randomPlayer,
                        damage: tempDamageGiven,
                    };
                }
                // removes user from helper array if dead
                if (randomPlayer.hero.currentHealth - tempDamageGiven <= 0) {
                    progress.dungeon.boss.helpers = progress.dungeon.boss.helpers.filter(h=> h !== randomPlayer.account.userId);
                }
                progress.roundResults.push(generateAttackString(bossName, weaponInfo, tempDamageGiven, randomPlayer.account.username));
            }
        }
        if (weaponInfo.type === "heal") {
            const healGiven = randomIntBetweenMinMax((stats.health * weaponInfo.damage), (stats.health * weaponInfo.damage / 2));
            bossSelfHeal += healGiven;
            progress.roundResults.push(generateHealString(bossName, weaponInfo, healGiven));
        }
    }
    // takes care of healing
    await asyncForEach(Object.keys(awaitHealPromises), async (u)=>{
        return await awaitHealPromises[u].user.healHero(awaitHealPromises[u].healGiven);
    });

    // inflicts damage on user document
    await asyncForEach(Object.keys(awaitDamagePromises), async (u)=>{
        return await awaitDamagePromises[u].user.heroHpLossFixedAmount(awaitDamagePromises[u].damage);
    });


    progress.dungeon.boss.stats.currentHealth += bossSelfHeal;

    // prevents boss from healing more than max hp
    if (progress.dungeon.boss.stats.currentHealth >= progress.dungeon.boss.stats.health) {
        progress.dungeon.boss.stats.currentHealth = progress.dungeon.boss.stats.health;
    }

    progress.dungeon.boss.stats.currentHealth -= damageGiven;
    progress.dungeon.boss.stats.attack -= disarmGiven;
    progress.bossAttempts += 1;
    progress.weaponAnswer.clear();

    // checks if boss dead
    if (progress.dungeon.boss.stats.currentHealth <= 0) {
        progress.win = true;
    }

    return progress;
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  const generateAttackString = (playerName, weaponInfo, damageGiven, playerAttacked = null)=>{
    const string = `\n- **${playerName}** used ${weaponInfo.name} attack causing **${damageGiven}** damage to **${playerAttacked}**`;
    return string;
};
const generateHealString = (playerName, weaponInfo, healGiven, playerHealed = null)=>{
    if (playerHealed) {
        return `\n${playerName} helead ${playerHealed}. +${healGiven} HP`;
    }
    return `\n${playerName} used self heal. +${healGiven}HP`;
};

const generateDisarmString = (playerName, weaponInfo, disarmGiven)=>{
    return `${playerName} used ${weaponInfo.name} to lower the boss attack with ${disarmGiven}`;
};


module.exports = { handleDungeonBoss, createDungeonEvent, calculateDungeonResult };