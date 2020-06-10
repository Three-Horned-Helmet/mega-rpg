const Discord = require("discord.js");
const { getPlaceIcon } = require("../game/_CONSTS/icons");

function generateEmbedPveFullArmy(user, placeInfo, raidResult) {
    if (raidResult.win) {
        return generateEmbedPveFullArmyWin(user, placeInfo, raidResult);
    }
    return generateEmbedPveFullArmyLoss(user, placeInfo, raidResult);
}

function generateEmbedPveFullArmyWin(user, placeInfo, raidResult) {
    const sideColor = "#45b6fe";
    const placeName = placeInfo.name;
    const placeIcon = getPlaceIcon(placeName);
    const { username } = user.account;
    const title = `${username} raided ${placeIcon} ${placeName}`;

    const rewards = "abc";

    const embedWin = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(sideColor)
    .addFields(
        {
            name: "Rewards",
            value: rewards,
            inline: true,
        },
    );

    /* .setFooter(`PVP: #${pvpRank} ~~~ Total: #${totalRank}`); */

return embedWin;
}


function generateEmbedPveFullArmyLoss(user, placeInfo, raidResult) {
    return "loss";
}

module.exports = { generateEmbedPveFullArmy };