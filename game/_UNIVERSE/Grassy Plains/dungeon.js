module.exports = { "Bandit's Mansion": {
	name: "Bandit's Mansion",
	type: "dungeon",
	requires: "CM Key",
	helperIds:[],
	rooms:[
		{
			name: "Mansion's Courtyard",
			description:
							"You enter the mansion and a beautiful courtyard stands before your eyes. A couple of trees and a bush surrounds what seems to be a sitting area. You must have lost your mind because you hear murmuring from the bushes",
			type: "raid",
			stats:{
				attack: 1000,
				health: 1000,
			},
			rewards:{
				gold: 45,
				"copper ore": 30,
				"iron ore": 23,
			},
		},
		{
			name: "Mansion Hallway",
			description:
							"You bravely fought through the courtyard and enter the hallway. It's long and narrow and you notice 3 scorched corpses by one of the walls, they seem oddly familiar. At the very end you see someone who's not happy to see you",
			type: "raid",
			stats:{
				attack: 1400,
				health: 1400,
			},
			rewards:{
				gold: 45,
				"copper ore": 30,
				"iron ore": 23,
			},
		},
		{
			name: "Mansion Trophy Room",
			description:
							"You make it through the hallway and enter what seems to be a trophy room. Heads from all creatures are plated to the wall as a decoration. You see the head of a bear, deer, impling and .",
			type: "raid",
			stats:{
				attack: 1800,
				health: 1800,
			},
			rewards:{
				gold: 50,
				"yew wood": 45,
			},
		},
	],
	boss:{
		name: "Bandit King",
		requiredQuest:"The Key to the Mansion",
		rules:{
			attacksEachRound:2,
			allowArmy: false,
			canKill: true,
			allowHelpers: true,
		},
		roundDescriptions:[
			"You enter the very last room of the castle, seing the very foe you came to seek, The Bandit King with a green tailed impling sitting on his shoulder. Your personal army shivers in fear in the face of the Castle's Monarch, they can't help you fight this boss. Choose your weapon wisely to defeat the **Bandit King**!",
			"Choose your weapon wisely!",
			"Choose your weapon wisely!",
			"Choose your weapon wisely!",
		],
		rewards:{
			gold:600,
			xp:1100,
			drop: ["greatsword of the spring", "bauxite daggers", "Large Healing Potion", "Small Healing Potion"],
		},
		stats:{
			attack: 500,
			health: 2000,
			currentHealth:2000,
			healing:true,
		},
		bossWeapons:["slash", "strike", "heal"],
		numOfAllowedWeapons: 3,
		allowedWeapons:[],
		unlocks: "Misty Mountains",
	},

}, };