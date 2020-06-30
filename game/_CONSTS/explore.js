const worldLocations = {
	"Grassy Plains": {
		description: "Here you can find all the noobs, such as yourself",
		randomEvents: {
			"Highlanders": {
				name: "Highlanders",
				type: "raid",
				stats:{
					attack: 300,
					health:100,
				},
				rewards:{
					gold: 100,
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
					gold: 50,
				},
			},
			Chest: {
				name: "Chest",
				type: "luck",
				rewards:{
					gold: 500,
				},
			},
		},
		places:{
			"Bandit Camp": {
				name: "Bandit Camp",
				type: "raid",
				stats:{
					attack: 300,
					health:200,
				},
				rewards:{
					gold: 70,
				},
			},
			"Fishing village": {
				name: "Fishing village",
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
			"Collapsed Mine": {
				name: "Collapsed Mine",
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
			Forest: {
				name: "Forest",
				type: "hunt",
				stats:{
					attack: 10,
					health:10,
				},
				rewards:{
					gold: 40,
				},
			},
			Cave: {
				name: "Cave",
				type: "hunt",
				stats:{
					attack: 20,
					health:15,
				},
				rewards:{
					gold: 50,
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
					dungeonKey: "CM key",
					gold: 2222,
					xp: 500,
				},
				rules: {
					canKill:true,
					allowArmy:false,
					allowHelpers:true,
					minRankToGetKey: 2,
				},
				helpers:[],
			},
			"Bandit's Mansion": {
				name: "Bandit's Mansion",
				type: "dungeon",
				requires: "CM key",
				rooms:[
					{
						name: "Mansion's Courtyard",
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
						name: "Mansion Hallway",
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
						name: "Mansion Trophey Room",
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
					name: "Bandit King",
					rules:{
						attacksEachRound:2,
						allowArmy: false,
						canKill: true,
						allowHelpers: true,
					},
					roundDescriptions:[
						"You enter the very last room of the castle, seing the very foe you came to seek. Your personal army shivers in fear in the face of the Castle's Monarch, they can't help you fight this boss. Choose your weapon wisely to defeat the **Bandit King**!",
						"Choose your weapon wisely!",
						"Choose your weapon wisely!",
						"Choose your weapon wisely!",
					],
					rewards:{
						gold:5000,
						xp:1100,
						drop: ["greatsword of the spring", "bauxite daggers", "Large Heal Potion", "Small Heal Potion"],
					},
					stats:{
						attack: 500,
						health:2000,
						currentHealth:2000,
						healing:true,
					},
					bossWeapons:["slash", "strike", "heal"],
					helpers:[],
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
					attack: 600,
					health: 600,
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
					attack: 2000,
					health: 2000,
				},
				rewards:{
					gold: 1000,
					"iron bar": 30,
					"yew wood": 60,
				},
			},
			"Pack of Implings": {
				name: "Pack of Implings",
				type: "hunt",
				notExplorable: true,
				stats:{
					attack: 700,
					health: 700,
				},
				rewards:{
					gold: 500,
					"yew wood": 100,
				},
			},
			"Bugbear": {
				name: "Bugbear",
				type: "raid",
				notExplorable: true,
				stats:{
					attack: 1350,
					health: 1350,
				},
				rewards:{
					gold: 350,
				},
			},
			"Wood Elves": {
				name: "Wood Elves",
				type: "raid",
				notExplorable: true,
				stats:{
					attack: 800,
					health: 800,
				},
				rewards:{
					"oak wood": 100,
					"yew wood": 100,
				},
			},
			"Pack of Wolves": {
				name: "Pack of Wolves",
				type: "hunt",
				notExplorable: true,
				stats:{
					attack: 600,
					health: 600,
				},
				rewards:{
					"yew wood": 20,
					gold: 200,
				},
			},
			"The Alpha Wolf": {
				name: "The Alpha Wolf",
				type: "hunt",
				notExplorable: true,
				stats:{
					attack: 800,
					health: 800,
				},
				rewards:{
					"yew wood": 40,
					gold: 400,
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
						drop: ["greatsword of the spring", "bauxite daggers", "Large Heal Potion", "Small Heal Potion"],
					},
					stats:{
						attack: 500,
						health:2000,
						currentHealth:2000,
						healing:true,
					},
					bossWeapons:["slash", "strike", "heal"],
					helpers:[],
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
				helpers:[],
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