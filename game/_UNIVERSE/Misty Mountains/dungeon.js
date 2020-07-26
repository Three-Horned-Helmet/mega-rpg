module.exports = { "Windlow Volcano": {
	name: "Windlow Volcano",
	type: "dungeon",
	requires: "Eridian Vase",
	helperIds:[],
	rooms:[
		{
			name: "Volcano Foot",
			description: "this is text 1",
			type: "raid",
			stats:{
				attack: 10000,
				health:10000,
			},
			rewards:{
				gold: 450,
				"copper ore": 300,
				"iron ore": 230,
			},
		},
		{
			name: "Volcano Vent",
			description: "this is text 2",
			type: "raid",
			stats:{
				attack: 14000,
				health:14000,
			},
			rewards:{
				gold: 450,
				"copper ore": 300,
				"iron ore": 230,
			},
		},
		{
			name: "Magma Chamber",
			type: "raid",
			description: "this is text 3",
			stats:{
				attack: 18000,
				health:18000,
			},
			rewards:{
				gold: 500,
				"copper ore": 450,
				"iron ore": 600,
			},
		},
	],
	boss:{
		name: "Volcano King",
		rules:{
			attacksEachRound:2,
			allowArmy: false,
			canKill: true,
			allowHelpers: true,
		},
		roundDescriptions:[
			"You enter the very last room of the castle, seing the very foe you came to seek. Your personal army shivers in fear in the face of the Castle's Monarch, they can't help you fight this boss. Choose your weapon wisely to defeat the **Volcano King**!",
			"Choose your weapon wisely!",
			"Choose your weapon wisely!",
			"Choose your weapon wisely!",
		],
		rewards:{
			gold:5000,
			xp:11000,
			drop: ["greatsword of the spring", "bauxite daggers", "Large Healing Potion", "Small Healing Potion"],
		},
		stats:{
			attack: 5000,
			health:20000,
			currentHealth:20000,
			healing:true,
		},
		bossWeapons:["slash", "strike", "heal"],
		numOfAllowedWeapons: 3,
		allowedWeapons:[],
		unlocks: "Deep Caves",
	},

}, };