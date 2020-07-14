/* eslint-disable no-inline-comments */
const icons = {
	// Resources
	"gold": ":moneybag:", // 💰

	"oak wood": ":evergreen_tree:", // 🌳
	"yew wood": ":deciduous_tree:",
	"barlind wood": ":tanabata_tree:", // 🎋

	"copper ore": ":orange_circle:",
	"iron ore": ":white_circle:",
	"obsidian ore": ":black_circle:",

	"bronze bar": ":orange_square:",
	"iron bar": ":white_large_square:",
	"steel bar": ":brown_square:",

	// Universe
	"Grassy Plains" : ":deciduous_tree:", // 🌳
	"Misty Mountains" : ":mountain_snow:", // 🏔
	"Deep Caves" : ":volcano:", // 🌋

	// actions
	"raid": ":man_supervillain", // 🦹‍♂️
	"hunt": ":frog:", // 🐸
	"miniboss": ":zombie:", // 🧟
	"fish": ":blowfish:", // 🐡
	"dungeon": ":map:", // 🗺

	// dungeon keys
	"CM Key":":key2:", // 🗝
	"The One Shell":":shell:", // 🐚
	"Eridian Vase": ":amphora:", // 🏺

	// Military units
	"archery":":archery:",
	"barracks": ":crossed_swords:",

	// Equipment Types
	"weapon": ":probing_cane:",
	"helmet": ":helmet_with_cross:",
	"chest": ":womans_clothes:",
	"legging": ":jeans:",

	// Stats
	"xp": ":mortar_board:", // 🎓
	"health": ":heart:", // ❤️
	"attack": ":crossed_swords:", // ⚔️
	"defense": ":shield:", // 🛡

	// Hero
	"armor": ":martial_arts_uniform:",
	"inventory": ":school_satchel:",

	// dungeon weapons
	"strike": ":knife:", // 🔪
	"critical": ":bangbang:", // ‼️
	"slash": ":dagger:", // 🗡
	"disarm": ":dove:", // 🕊
	"heal": ":test_tube:", // 🧪
	"poke": ":point_right:", // 👉

	// Misc
	"false": ":x:", // ❌
	"true": ":white_check_mark:" // ✅
};
/**
 * Returns an emoji if configured in icons-object or a danger symbol if missing
 * @param {string} type - eg: "gold", "copper ore" or "true"
 **/
const getIcon = (type)=> Object.keys(icons).includes(type.toString()) ? icons[type.toString()] : "⚠️";


module.exports = { getIcon };