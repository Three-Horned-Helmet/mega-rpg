const worldLocations = {
	"Grassy Plains": {
		description: "1st world. Here you can find all the noobs, such as yourself",
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
					dungeonKey: "Ogre tooth",
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
			"Bandit's Castle": {
				name: "Bandit's Castle",
				type: "dungeon",
				requires: "Ogre tooth",
				unlocks: "Misty Mountains",
				stats:{
					attack: 500,
					health:500,
				},
			},
			River: {
				name: "River",
				type: "fish",
				fish: ["Cod", "Trout", "Swordfish"],
			},
			// Questmobs
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
		},
	},
	"Misty Mountains":{
		description: "2nd world. You've entered a hostile environment where rewards are equally big as the threats",
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
				stats:{
					attack: 500,
					health:500,
				},
				unlocks:"Deep Caves",
			},
		["Cold Boiling Lake"]: {
				name: "Cold Boiling Lake",
				type: "fish",
				fish: ["Cod", "Trout", "Swordfish", "Salmon", "Macrel"],
			},
		},
	},
	"Deep Caves":{
		description: "3rd world. You're in one of the darkest and most forgotten places of Mega RPG",
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