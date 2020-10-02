const icons = {
	// Resources
	"gold": { name:":moneybag:", icon:"💰" },

	"oak wood":{ name: ":evergreen_tree:", icon: "🌲" },
	"yew wood":{ name: ":deciduous_tree:", icon: "🌳" },
	"barlind wood":{ name: ":tanabata_tree:", icon: "🎋" },
	"aspen wood":{ name: ":mountain_snow:", icon: "" },

	"copper ore":{ name: ":orange_circle:", icon: "🟠" },
	"iron ore":{ name: ":white_circle:", icon: "⚪️" },
	"mithril ore":{ name: ":blue_circle:", icon: "🔵" },
	"burite ore":{ name: ":purple_circle:", icon: "🟣" },
	"obsidian ore":{ name: ":black_circle:", icon: "⚫️" },

	"bronze bar":{ name: ":orange_square:", icon: "🟧" },
	"iron bar":{ name: ":white_large_square:", icon: "⬜️" },
	"steel bar":{ name: ":brown_square:", icon: "🟫" },
	"mithril bar":{ name: ":blue_square:", icon: "" },
	"pyrite bar":{ name: ":purple_square:", icon: "" },

	// Universe
	"Grassy Plains" :{ name: ":deciduous_tree:", icon: "🌳" },
	"Misty Mountains" :{ name: ":mountain_snow:", icon: "🏔" },
	"Deep Caves" :{ name: ":volcano:", icon: "🌋" },

	// actions
	"raid":{ name: ":man_supervillain:", icon: "🦹‍♂️" },
	"hunt":{ name: ":frog:", icon: "🐸" },
	"miniboss":{ name: ":zombie:", icon: "🧟" },
	"fish":{ name: ":blowfish:", icon: "🐡" },
	"dungeon":{ name: ":map:", icon: "🗺" },

	// dungeon keys
	"CM Key":{ name: ":key2:", icon: "🗝" },
	"The One Shell":{ name: ":shell:", icon: "🐚" },
	"Eridian Vase":{ name: ":amphora:", icon: "🏺" },

	// Military units
	"archery":{ name: ":archery:", icon: "🏹" },
	"barracks":{ name: ":crossed_swords:", icon: "⚔️" },

	// Equipment Types
	"weapon":{ name: ":probing_cane:", icon: "🦯" },
	"helmet":{ name: ":helmet_with_cross:", icon: "⛑" },
	"chest":{ name: ":womans_clothes:", icon: "👚" },
	"legging":{ name: ":jeans:", icon: "👖" },

	// Shop
	"Small Healing Potion": { name: ":thermometer:", icon:"🌡" },
	"Large Healing Potion": { name: ":syringe:", icon:"💉" },
	"Enourmous Healing Potion": { name: ":scarf:", icon:"🧣" },
	"Quality Healing Potion": { name: ":pill:", icon:"💊" },
	"Mega Healing Potion": { name: ":school_satchel:", icon:"🎒" },
	"Ultra Healing Potion": { name: ":drop_of_blood:", icon:"🩸" },
	"Small Healing Salve": { name: ":rose:", icon:"🌹" },
	"Large Healing Salve": { name: ":maple_leaf:", icon:"🍁" },
	"Quality Healing Salve": { name: ":bowl_with_spoon:", icon:"🥣" },


	// Stats
	"xp":{ name: ":mortar_board:", icon: "🎓" },
	"health":{ name: ":heart:", icon: "❤️" },
	"attack":{ name: ":crossed_swords:", icon: "⚔️" },
	"defense":{ name: ":shield:", icon: "🛡" },

	// Hero
	"armor":{ name: ":martial_arts_uniform:", icon: "🥋" },
	"inventory":{ name: ":school_satchel:", icon: "🎒" },

	// weapons
	"strike":{ name: ":knife:", icon: "🔪" },
	"critical":{ name: ":bangbang:", icon: "‼️" },
	"slash":{ name: ":dagger:", icon: "🗡" },
	"disarm":{ name: ":dove:", icon: "🕊" },
	"heal":{ name: ":test_tube:", icon: "🧪" },
	"poke":{ name: ":point_right:", icon: "👉" },

	// Tower
	"tower header": { name: ":japanese_ogre:", icon: "👹" },
	"tower drop": { name: "", icon:"" },
	"tower won": { name: ":medal:", icon:"🏅" },
	"tower lost": { name: ":anger:", icon: "😠" },
	"tower fight": { name: ":crossed_swords:", icon: "⚔️" },

	// Supporter
	"bronzeSupporter":{ name:":reminder_ribbon:", icon:"🎗" },
	"silverSupporter":{ name:":military_medal:", icon:"🎖" },
	"goldSupporter":{ name:":crown:", icon:"👑" },
	"platinumSupporter":{ name:":gem:", icon:"💎" },

	// Misc
	"false":{ name: ":x:", icon: "❌" },
	"true":{ name: ":white_check_mark:", icon: "✅" },
	"quest": { name: ":boom:", icon:"💥" },
	"weeklyPrizeStar":{ name:":star2:", icon:"🌟" },
	"dailyPrizeStar": { name:":star:", icon: "⭐️" },
	"Carrot": { name:":carrot:", icon:"🥕" },
	"cooldown": { name: ":clock9:", icon:"🕘" },
	"lottery": { name: ":money_with_wings:", icon:"💸" }
};
/**
 * Returns an emoji if configured in icons-object or a danger symbol if missing
 * @param {string} type - eg: "gold", "copper ore" or "true"
 * @param {string} style - enum: "name" (":knife:") or "icon" ("🔪")
 * NOTE: message.react and icons in footer of embeds needs to be icon and not name.
 **/

const getIcon = (type, style = "name")=> icons[type] ? icons[type][style] : "⚠️";


module.exports = { getIcon };
