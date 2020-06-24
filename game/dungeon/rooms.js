const { worldLocations } = require("../_CONSTS/explore");
const { dungeonStartAllowed } = require("./helper");

const { calculatePveFullArmyResult } = require("../../combat/combat");
const { generateEmbedPveFullArmy } = require("../../combat/pveEmedGenerator");

const { handleDungeonBoss } = require("./index");

const handleDungeonRooms = async (message, user)=>{
    const { currentLocation } = user.world;
    const dungeonInformation = Object.values(worldLocations[currentLocation].places).find(p=>{
        return p.type === "dungeon";
    });
    const { rooms } = dungeonInformation;
    const progress = {
        user,
        currentRoom:0,
        rooms,
    };
    await startDungeonRooms(message, progress);
};

const startDungeonRooms = async (message, progress)=>{
    const { user } = progress;

    const disallowed = dungeonStartAllowed(user);
		if (disallowed) {
            return message.channel.send(disallowed);
        }

// perform raid
const placeInfo = progress.rooms[progress.currentRoom];
const raidResult = calculatePveFullArmyResult(user, placeInfo);

 // saves to database
await user.unitLoss(raidResult.lossPercentage);
await user.alternativeGainXp(raidResult.expReward);
if (raidResult.win) {
    await user.gainManyResources(raidResult.resourceReward);
}
// generates a Discord embed
const raidEmbed = generateEmbedPveFullArmy(user, placeInfo, raidResult, null, true);
const msg = await message.channel.send(raidEmbed);
try {
    await msg.react("✅");
    await msg.react("🚫");
}
catch (err) {
    console.error("error: ", err);
}


const filter = (reaction, rUser) => {
	return rUser.id === progress.user.account.userId;
};

msg.awaitReactions(filter, { max: 1, time: 1000 * 20, errors: ["time"] })
	.then(collected => {
		const reaction = collected.first();
		if (reaction.emoji.name === "✅") {
            progress.currentRoom += 1;

            if (progress.currentRoom > 2) {
                return handleDungeonBoss(message, user);
            }
 else {
                startDungeonRooms(message, progress);
            }
		}
        else {
        return msg.reply("you chose to flee");
		}
	})
	.catch(() => {
    return msg.reply("You did not choose anything and therefor fled the dungeon");
    });
};

module.exports = { handleDungeonRooms };