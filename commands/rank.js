const User = require("../models/User");

module.exports = {
	name: "rank",
	description: "Returns best players based upon their rank",
	async execute(message) {
        const top5 = await User
            .find({})
            .select(["account", "hero"])
            .sort({ "hero.currentExp":-1 })
            .limit(5)
            .lean();

        const formatted = top5.map((p, i)=>{
            const first = i === 0 ? "💎" : "";
            return `\`#${i + 1}: ${first}${p.account.username}${first} --- hero lvl: ${p.hero.rank} - ${p.hero.currentExp} XP\``;
        });

		return message.channel.send(formatted);
	},
};