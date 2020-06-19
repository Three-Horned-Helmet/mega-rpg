const { onCooldown } = require("../_CONSTS/cooldowns");
const { worldLocations } = require("../_CONSTS/explore");
const { getLocationIcon, getDungeonKeyIcon } = require("../_CONSTS/icons");
const { createDungeonInvitation, createDungeonResult, generateDungeonBossRound } = require("./embedGenerator");

const User = require("../../models/User");

// Note: The success of defeating the dungeon is based soley on user rank
const handleDungeon = async (message, user)=>{

    // cooldown, health, explored dungeon
    const disallowed = dungeonStartAllowed(user);
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
        const allowedHelper = await validateHelper(rUser.id);
        if (!allowedHelper) {
            return;
        }
        dungeon.boss.helpers.push(rUser.id);
        // if helpers length, end collection
    });

     collector.on("end", async () => {
        await startDungeonEvent(message, dungeon);
    });
};

const createDungeonEvent = (user) =>{
    const { currentLocation } = user.world;
    const dungeonName = Object.keys(worldLocations[currentLocation].places).find(p=>{
        return worldLocations[currentLocation].places[p].type === "dungeon";
    });
    const dungeon = worldLocations[currentLocation].places[dungeonName];
    dungeon.boss.helpers.unshift(user.account.userId);
    return dungeon;
};


const startDungeonEvent = async (message, dungeon) => {
    const users = await User.find({ "account.userId": dungeon.boss.helpers });
    const initiativeTaker = users.filter(u=> u.account.userId === dungeon.boss.helpers[0]);

    const progress = {
        win: false,
        earlyfinish: false,
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
    // const round = message.channel.send(dungeonRound);

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
            // calculate process and generate strings
            // if length == 0, end
            // if round > 3, end
            // if boss.health <= 0, end

            const result = await calculateDungeonResult(progress);
            console.log("end");
    });
        // if length is something, collection end after timeout

};


const calculateDungeonResult = async (progress)=>{
    let damageGiven = 0;
    let disarmGiven = 0;
    progress.weaponAnswer.forEach((weapon, player)=>{
        const playerInfo = progress.players.find(p=>{
            return p.account.userId === player;
        });
        const playerName = playerInfo.account.username;
        const weaponInfo = getWeaponInfo(weapon);
        const chance = Math.random();
        const result = {
            type: weaponInfo.type,
            playerName: playerName,
            weaponName: weaponInfo.name,
            damageGiven:0,
            healGiven: 0,
            disarmGiven: 0,

            playerHealed: null,
        };
        if (weaponInfo.chanceforSuccess > 0) {
            if (weaponInfo.type === "attack") {
                console.log("attack");
                result.damageGiven = Math.round(Math.random() * (playerInfo.hero.attack * weaponInfo.damage - (playerInfo.hero.attack / 2 * weaponInfo.damage)) + (playerInfo.hero.attack / 2 * weaponInfo.damage));
                damageGiven += result.damageGiven;
            }
            if (weaponInfo.type === "heal") {
                console.log("heal");
                result.playerHealed = progress.players.sort((a, b)=>b.hero.currentHealth - a.hero.currentHealth);
                result.healGiven = Math.round(Math.random() * (playerInfo.hero.health * weaponInfo.damage - (playerInfo.hero.health * weaponInfo.damage / 2)) + (playerInfo.hero.health * weaponInfo.damage / 2));
                // await result.playerHealed.givehp
            }
            if (weaponInfo.type === "disarm") {
                console.log("disarm");
                result.disarmGiven = Math.round(Math.random() * (progress.dungeon.boss.stats.attack * weaponInfo.damage - (progress.dungeon.boss.stats.attack / 2 * weaponInfo.damage)) + (progress.dungeon.boss.stats.attack / 2 * weaponInfo.damage));
                disarmGiven += result.disarmGiven;
            }
        }
        progress.roundResults.push(result);
    });

    progress.dungeon.boss.stats.currentHealth -= damageGiven;
    progress.dungeon.boss.stats.attack -= disarmGiven;
    console.log(progress.dungeon.boss.stats, "progress");

    return progress;
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  const dungeonStartAllowed = (user)=>{
    // checks for cooldown
    const cooldownInfo = onCooldown("dungeon", user);
    if (cooldownInfo.response) {
        return cooldownInfo.embed;
    }

    const { currentLocation } = user.world;
    const locationIcon = getLocationIcon(currentLocation);
    const dungeonInformation = Object.values(worldLocations[currentLocation].places).find(p=>{
        return p.type === "dungeon";
    });

    if (!user.world.locations[currentLocation].explored.includes([dungeonInformation.name])) {
        return `You haven't found any dungeon in ${locationIcon} ${currentLocation}`;
    }

    // Checks if user has the correct key
    const requiredDungeonKey = dungeonInformation.requires;
    if (!user.hero.dungeonKeys[requiredDungeonKey]) {
        let response = `You try to enter ${dungeonInformation.name}, but you don't have the required ${getDungeonKeyIcon(requiredDungeonKey)} ${requiredDungeonKey} to proceed. `;
        if (user.hero.rank < 2) {
            response += `Try defeating the dungeon in ${locationIcon} ${currentLocation} to obtain the required dungeon key`;
        }
        return response;
    }

    if (user.hero.currentHealth < user.hero.health * 0.05) {
        let feedback = `Your hero's health is too low (**${user.hero.currentHealth}**)`;
        if (user.hero.rank < 2) {
            feedback += "\n You can `!build` a shop and `!build` potions";
        }
        return feedback;
    }
    return null;
};
const validateHelper = async discordId =>{
    const user = await User.findOne({ "account.userId": discordId }).lean();
    return user.hero.currentHealth > user.hero.health * 0.05;
};

const getWeaponInfo = (weapon, num = null)=>{
    const weaponInformation = {
        "slash":{
            name: "slash",
            type: "attack",
            answer: null,
            chanceforSuccess: 0.95,
            damage: 1,
            description: "95% chance of slashing the enemy",
        },
        "strike":{
            name: "strike",
            type: "attack",
            answer: null,
            chanceforSuccess: 0.80,
            damage: 2,
            description: "80% chance of causing a strong attack",
        },
        "critical":{
            name: "critical",
            type: "attack",
            answer: null,
            chanceforSuccess: 0.40,
            damage: 4,
            description: "40% chance of causing a brutal attack",
        },
        "disarm":{
            name: "disarm",
            type: "disarm",
            answer: null,
            chanceforSuccess: 0.25,
            damage: 0.2,
            description: "25% chance of lowering boss attack",
        },
        "heal":{
            name: "heal",
            type: "heal",
            answer: null,
            chanceforSuccess: 0.90,
            damage: 0.25,
            description: "90% chance of healing a teammate",
        },
        "poke":{
            name: "poke",
            type: "attack",
            answer: null,
            chanceforSuccess: 0.1,
            damage: 0.05,
            description: "10% chance of poking the enemy",
        },
    };
    if (num) {
      const alphabet = ["a", "b", "c", "d", "e"];
        const shuffled = Object
            .entries(weaponInformation)
            .sort(() => 0.5 - Math.random())
            .slice(0, num)
            .reduce((obj, [k, v]) => ({
                ...obj,
                [k]: v,
            }), {});
            // Sorry
            for (const i in Object.keys(shuffled)) {
              shuffled[Object.keys(shuffled)[i]].answer = alphabet[i];
            }
        return shuffled;
      }
    if (weapon) {
      return weaponInformation[weapon];
    }
    return weaponInformation;
};


module.exports = { handleDungeon, createDungeonEvent, dungeonStartAllowed, createDungeonResult, calculateDungeonResult };