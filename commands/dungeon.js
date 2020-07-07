const { handleDungeon } = require("../game/dungeon");
// Possible issues with !dungeon commnd
/*
- Other people interfering with the dungeon run
- Players healing between rounds or otherwise do actions not connected to dungeon
- If another player triggers the dungeon while someone is in dungeon, the values might copy from current dungeon instead of a new one
- Possible issue with paralell saving to mongodb when attacking dungeon boss
*/
module.exports = {
	name: "dungeon",
	description: "Let's the player trigger a dungeon with n rooms and a final boss in the end",
	async execute(message, args, user) {
		await handleDungeon(message, user);
	},
};