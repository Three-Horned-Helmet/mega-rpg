const worldLocations = {
	"Grassy Plains": {
		description: "Here you can find all the noobs, such as yourself",
		randomEvents: {
			"Highlanders": {
				name: "Highlanders",
				type: "raid",
				stats:{
					attack: 300,
					health: 100,
				},
				rewards:{
					gold: 135,
				},
			},
			Wolves: {
				name: "Wolves",
				type: "raid",
				stats:{
					attack: 150,
					health:50,
				},
				rewards:{
					gold: 20,
				},
			},
			Chest: {
				name: "Chest",
				type: "luck",
				rewards:{
					gold: 100,
				},
			},
		},
		places:{
			"Fishing village": {
				name: "Fishing village",
				type: "raid",
				stats:{
					attack: 80,
					health: 120,
				},
				rewards:{
					gold: 80,
					"oak wood": 15,
					"yew wood": 10,
				},
			},
			"Collapsed Mine": {
				name: "Collapsed Mine",
				type: "raid",
				stats:{
					attack: 200,
					health: 200,
				},
				rewards:{
					gold: 110,
					"copper ore": 20,
					"iron ore": 12,
				},
			},
			"Bandit Camp": {
				name: "Bandit Camp",
				type: "raid",
				stats:{
					attack: 250,
					health: 250,
				},
				rewards:{
					gold: 170,
				},
			},
			"Bandit Vault": {
				name: "Bandit Vault",
				type: "raid",
				stats:{
					attack: 450,
					health: 450,
				},
				rewards:{
					gold: 210,
				},
			},
			Forest: {
				name: "Forest",
				type: "hunt",
				stats:{
					attack: 25,
					health: 25,
				},
				rewards:{
					gold: 5,
					"oak wood": 2,
					"yew wood": 1,
					"copper ore": 1,
				},
			},
			Cave: {
				name: "Cave",
				type: "hunt",
				stats:{
					attack: 45,
					health: 45,
				},
				rewards:{
					gold: 23,
					"copper ore": 2,
				},
			},
			Hills: {
				name: "Hills",
				type: "hunt",
				stats:{
					attack: 75,
					health: 75,
				},
				rewards:{
					gold: 42,
				},
			},
			"C'Thun": {
				name: "C'Thun",
				type: "miniboss",
				stats:{
					attack: 90,
					health: 100,
					difficulty: 10,
				},
				rewards:{
					dungeonKey: "CM Key",
					gold: 120,
					xp: 500,
				},
				rules: {
					canKill:true,
					allowArmy:false,
					allowHelpers:true,
					minRankToGetKey: 2,
				},
				helperIds:[],
			},
			"Bandit's Mansion": {
				name: "Bandit's Mansion",
				type: "dungeon",
				requires: "CM Key",
				helperIds:[],
				rooms:[
					{
						name: "Mansion's Courtyard",
						description:
							"You enter the mansion and a beautiful courtyard stands before your eyes. A couple of trees and a bush surrounds what seems to be a seating area. You must have lost your mind because you hear murmuring from the bushes",
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

			},
			River: {
				name: "River",
				type: "fish",
				fish: ["Cod", "Trout", "Swordfish"],
			},

			// Questmobs
			"Moriths Mine": {
				name: "Moriths Mine",
				type: "raid",
				notExplorable: true,
				stats:{
					attack: 400,
					health: 400,
				},
				rewards:{
					"copper ore": 4,
					"iron ore": 3,
					"obsidian ore": 2,
				},
			},

			"Confront Bandits": {
				name: "Confront Bandits",
				type: "raid",
				notExplorable: true,
				stats:{
					attack: 300,
					health: 300,
				},
				rewards:{
					gold: 130,
					"iron bar": 20,
					"yew wood": 40,
				},
			},
			"Pack of Implings": {
				name: "Pack of Implings",
				type: "hunt",
				notExplorable: true,
				stats:{
					attack: 180,
					health: 180,
				},
				rewards:{
					gold: 125,
					"yew wood": 60,
				},
			},
			"Bugbear": {
				name: "Bugbear",
				type: "raid",
				notExplorable: true,
				stats:{
					attack: 600,
					health: 600,
				},
				rewards:{
					gold: 200,
				},
			},
			"Wood Elves": {
				name: "Wood Elves",
				type: "raid",
				notExplorable: true,
				stats: {
					attack: 550,
					health: 550,
				},
				rewards:{
					"oak wood": 60,
					"yew wood": 60,
				},
			},
			"Pack of Wolves": {
				name: "Pack of Wolves",
				type: "hunt",
				notExplorable: true,
				stats:{
					attack: 100,
					health: 100,
				},
				rewards:{
					gold: 90,
					"yew wood": 20,
				},
			},
			"The Alpha Wolf": {
				name: "The Alpha Wolf",
				type: "hunt",
				notExplorable: true,
				stats:{
					attack: 200,
					health: 200,
				},
				rewards:{
					"yew wood": 35,
					gold: 120,
				},
			},
			"Courtyard Guards": {
				name: "Courtyard Guards",
				type: "raid",
				notExplorable: true,
				stats:{
					attack: 750,
					health: 750,
				},
				rewards:{
					"steel bar": 40,
					gold: 720,
				},
			},
		},
	},
	"Misty Mountains":{
		description: "You've entered a hostile environment where rewards are equally big as the threats",
		randomEvents: {
			"Mountain Bandits": {
				name: "Mountain Bandits",
				type: "raid",
				stats:{
					attack: 300,
					health:100,
				},
				rewards:{
					gold: 100,
				},
			},
			Gnomes: {
				name: "Gnomes",
				type: "hunt",
				stats:{
					attack: 150,
					health:50,
				},
				rewards:{
					gold: 50,
				},
			},
			["Bronze Chest"]: {
				name: "Bronze Chest",
				type: "luck",
				rewards:{
					gold: 1000,
				},
			},
		},
		places:{
			"Sulphur Works": {
				name: "Sulphur Works",
				type: "raid",
				stats:{
					attack: 300,
					health:200,
				},
				rewards:{
					gold: 70,
				},
			},
			"Traders Town": {
				name: "Traders Town",
				type: "raid",
				stats:{
					attack: 100,
					health:300,
				},
				rewards:{
					gold: 100,
					"oak wood": 50,
					"yew wood": 20,
				},
			},
			"Goldstrike mine": {
				name: "Goldstrike mine",
				type: "raid",
				stats:{
					attack: 200,
					health:200,
				},
				rewards:{
					gold: 50,
					"copper ore": 100,
					"iron ore": 60,
				},
			},
			["Dwarf Forest"]: {
				name: "Dwarf Forest",
				type: "hunt",
				stats:{
					attack: 10,
					health:10,
				},
				rewards:{
					gold: 40,
				},
			},
			["Isolated Peaks"]: {
				name: "Isolated Peaks",
				type: "hunt",
				stats:{
					attack: 20,
					health:15,
				},
				rewards:{
					gold: 50,
				},
			},
			"Graveward": {
				name: "Graveward",
				type: "miniboss",
				stats:{
					attack: 600,
					health: 600,
					difficulty: 30,
				},
				rewards:{
					dungeonKey: "Eridian Vase",
					gold: 8888,
					xp: 999,
				},
				rules: {
					canKill:true,
					allowArmy:false,
					allowHelpers:true,
					minRankToGetKey: 4,
				},
				helpers:[],
			},
			"Windlow Volcano": {
				name: "Windlow Volcano",
				type: "dungeon",
				requires: "Eridian Vase",
				rooms:[
					{
						name: "Volcano Foot",
						type: "raid",
						stats:{
							attack: 200,
							health:200,
						},
						rewards:{
							gold: 50,
							"copper ore": 100,
							"iron ore": 60,
						},
					},
					{
						name: "Volcano Vent",
						type: "raid",
						stats:{
							attack: 200,
							health:200,
						},
						rewards:{
							gold: 50,
							"copper ore": 100,
							"iron ore": 60,
						},
					},
					{
						name: "Magma Chamber",
						type: "raid",
						stats:{
							attack: 200,
							health:200,
						},
						rewards:{
							gold: 50,
							"copper ore": 100,
							"iron ore": 60,
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
						xp:1100,
						drop: ["greatsword of the spring", "bauxite daggers", "Large Healing Potion", "Small Healing Potion"],
					},
					stats:{
						attack: 500,
						health:2000,
						currentHealth:2000,
						healing:true,
					},
					bossWeapons:["slash", "strike", "heal"],
					helperIds:[],
					numOfAllowedWeapons: 3,
					allowedWeapons:[],
					unlocks: "Deep Caves",
				},

			},
			River: {
				name: "River",
				type: "fish",
				fish: ["Cod", "Trout", "Swordfish"],
			},
		},
		["Cold Boiling Lake"]: {
			name: "Cold Boiling Lake",
			type: "fish",
			fish: ["Cod", "Trout", "Swordfish", "Salmon", "Macrel"],
		},
	},
	"Deep Caves":{
		description: "You're in one of the darkest and most forgotten places of Mega RPG",
		randomEvents: {
			"Lost skeletons": {
				name: "Lost skeletons",
				type: "raid",
				stats:{
					attack: 300,
					health:100,
				},
				rewards:{
					gold: 100,
				},
			},
			["Giant Spiders"]: {
				name: "Giant Spiders",
				type: "hunt",
				stats:{
					attack: 150,
					health:50,
				},
				rewards:{
					gold: 50,
				},
			},
			["Silver Chest"]: {
				name: "Silver Chest",
				type: "luck",
				rewards:{
					gold: 2000,
				},
			},
		},
		places:{
			"Ancient Graveyard": {
				name: "Ancient Graveyard",
				type: "raid",
				stats:{
					attack: 300,
					health:200,
				},
				rewards:{
					gold: 70,
				},
			},
			"Thiefs Guild": {
				name: "Thiefs Guild",
				type: "raid",
				stats:{
					attack: 100,
					health:300,
				},
				rewards:{
					gold: 100,
					"oak wood": 50,
					"yew wood": 20,
				},
			},
			"Unstable Cavern": {
				name: "Unstable Cavern",
				type: "raid",
				stats:{
					attack: 200,
					health:200,
				},
				rewards:{
					gold: 50,
					"copper ore": 100,
					"iron ore": 60,
				},
			},
			["Quartz Corner"]: {
				name: "Quartz Corner",
				type: "hunt",
				stats:{
					attack: 10,
					health:10,
				},
				rewards:{
					gold: 40,
				},
			},
			["Colorless Subterrane"]: {
				name: "Colorless Subterrane",
				type: "hunt",
				stats:{
					attack: 20,
					health:15,
				},
				rewards:{
					gold: 50,
				},
			},
			"Kraken": {
				name: "Kraken",
				type: "miniboss",
				stats:{
					attack: 1800,
					health: 1800,
					difficulty: 90,
				},
				rewards:{
					dungeonKey: "The One Shell",
					gold: 8888,
					xp: 999,
				},
				rules: {
					canKill:true,
					allowArmy:false,
					allowHelpers:true,
					minRankToGetKey: 4,
				},
				helpers:[],
			},
			"Collapsing Sanctuary": {
				name: "Collapsing Sanctuary",
				requires: "The One Shell",
				type: "dungeon",
				rules:{
					allowArmy: false,
					canKill: true,
					allowHelpers: true,
				},
				rewards:{
					gold:5000,
					xp:1100,
				},
				helperIds:[],
				stats:{
					attack: 500,
					health:500,
				},
			},
			["Subterranean Spring"]: {
				name: "Subterranean Spring",
				type: "fish",
				fish: ["Cod", "Trout", "Swordfish", "Salmon", "Macrel", "Bass", "Eel"],
			},
		},
	},
};

module.exports = { worldLocations };