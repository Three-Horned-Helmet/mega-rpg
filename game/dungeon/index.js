const User = require("../../models/User");
const { worldLocations } = require("../_CONSTS/explore");
const { startDungeonRooms } = require("./rooms");
const { createDungeonInvitation } = require("./embedGenerator");
const { dungeonStartAllowed, validateHelper } = require("./helper");
const { deepCopyFunction } = require("../_GLOBAL_HELPERS/");

const handleDungeon = async (message, user)=>{
    // cooldown, health, explored dungeon and dungeon key
    const disallowed = dungeonStartAllowed(user);
		if (disallowed) {
            return message.channel.send(disallowed);
        }

    const dungeon = createDungeonBossEvent(user);

    const now = new Date();
    await user.setNewCooldown("dungeon", now);

    const dungeonInvitation = createDungeonInvitation(dungeon, user);
    const invitation = await message.channel.send(dungeonInvitation);
    await invitation.react("🗺");

    const reactionFilter = (reaction) => {
        return reaction.emoji.name === "🗺";
    };

    const collector = await invitation.createReactionCollector(reactionFilter, { time: 1000 * 20, errors: ["time"] });
    collector.on("collect", async (result, rUser) => {
        if (rUser.bot || dungeon.helperIds.length > 4) {
            return;
        }
        if (dungeon.helperIds.includes(rUser.id)) {
            return;
        }
        const allowedHelper = await validateHelper(rUser.id);
        if (!allowedHelper) {
            return;
        }
        dungeon.helperIds.push(rUser.id);
    });

     collector.on("end", async () => {
        await startDungeonEvent(message, dungeon);
    });
};

// Finds dungeon in current world
const createDungeonBossEvent = (user) =>{
    const { currentLocation } = user.world;
    const dungeonName = Object.keys(worldLocations[currentLocation].places).find(p=>{
        return worldLocations[currentLocation].places[p].type === "dungeon";
    });
    const dungeon = deepCopyFunction(worldLocations[currentLocation].places[dungeonName]);
    dungeon.helperIds.unshift(user.account.userId);
    return dungeon;
};


// c
const startDungeonEvent = async (message, dungeon) => {
    const users = await User.find({ "account.userId": dungeon.helperIds });
    const initiativeTaker = users.filter(u=> u.account.userId === dungeon.helperIds[0]);

    const progress = {
        win: false,
        finish:false,
        currentRoom:0,
        bossAttempts: 0,
        initiativeTaker: initiativeTaker[0],
        players: users,
        dungeon: dungeon,
        roundResults:[],
        weaponAnswer:new Map(),
    };

    // recursive starts here
    await startDungeonRooms(message, progress);
};


module.exports = { handleDungeon, createDungeonBossEvent };