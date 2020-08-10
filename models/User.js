require("dotenv").config();

const mongoose = require("mongoose");

if (process.env.NODE_ENV === "test") {
	mongoose.connect(process.env.TEST_MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
}
else {
	mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
}

const { Schema } = mongoose;

const buildingsObject = require("../game/build/buildings-object");
const { heroExpToNextLevel, heroStatIncreaseOnLevel } = require("../game/_CONSTS/hero-exp");
const { statistics, cooldowns } = require("./userValues/default");

const userSchema = new Schema({
	account: {
		username: String,
		userId: String,
		banned: {
			type: Boolean,
			default: false,
		},
		testUser:{
			type: Boolean,
			default: false,
		},
		servers:Array,
		patreon: {
			type: String,
			enum: ["", "Bronze", "Silver", "Gold", "Platinum"],
			default: "",
		},
	},
	maxPop: {
		type: Number,
		default: 10,
	},
	maxBuildings: {
		type: Number,
		default: 9
	},
	// object too big, moved to ./uservalues/default
	cooldowns,
	resources: {
		gold: {
			type: Number,
			default: 100,
		},

		["oak wood"]: {
			type: Number,
			default: 5,
		},
		["yew wood"]: {
			type: Number,
			default: 0,
		},
		["barlind wood"]: {
			type: Number,
			default: 0,
		},

		["copper ore"]: {
			type: Number,
			default: 10,
		},
		["iron ore"]: {
			type: Number,
			default: 0,
		},
		["bronze bar"]: {
			type: Number,
			default: 0,
		},
		["iron bar"]: {
			type: Number,
			default: 0,
		},
		["steel bar"]: {
			type: Number,
			default: 0,
		},
		["obsidian ore"]: {
			type: Number,
			default: 0,
		},
	},

	army: {
		armory: {
			helmet: {
				type: Object,
				default: {},
			},
			chest: {
				type: Object,
				default: {},
			},
			legging: {
				type: Object,
				default: {},
			},
			weapon: {
				type: Object,
				default: {},
			},
		},
		units: {
			archery: {
				huntsman: {
					type: Number,
					default: 0,
				},
				archer: {
					type: Number,
					default: 0,
				},
				ranger: {
					type: Number,
					default: 0,
				},
			},
			barracks: {
				peasant: {
					type: Number,
					default: 5,
				},
				militia: {
					type: Number,
					default: 0,
				},
				guardsman: {
					type: Number,
					default: 0,
				},
			},
		},
	},

	world:{
		currentLocation: {
			type: String,
			default: "Grassy Plains",
		},

		locations: {
			"Grassy Plains": {
				available: {
					type: Boolean,
					default: true,
				},
				explored: [String],
			},
			"Misty Mountains": {
				available: {
					type: Boolean,
					default: false,
				},
				explored: [String],
			},
			"Deep Caves": {
				available: {
					type: Boolean,
					default: false,
				},
				explored: [String],
			},
		},
	},

	empire: {
		type: Array,
		default: [],
	},
	hero: {
		elo:{
			type: Number,
			default: 1200,
		},
		health: {
			type: Number,
			default: 100,
		},
		currentHealth: {
			type: Number,
			default: 100,
		},
		attack: {
			type: Number,
			default: 5,
		},
		defense: {
			type: Number,
			default: 3,
		},
		inventory: {
			["Small Healing Potion"]: {
				type: Number,
				default: 5,
			},
			["Large Healing Potion"]: {
				type: Number,
				default: 0,
			},
			Carrots: {
				type: Number,
				default: 0,
			}
		},
		dungeonKeys:{
			"CM Key":{
				type: Number,
				default: 0,
			},
			"Eridian Vase":{
				type: Number,
				default: 0
			},
			"The One Shell":{
				type: Number,
				default: 0
			}
		},
		currentExp: {
			type: Number,
			default: 1,
		},
		expToNextRank: {
			type: Number,
			default: 100,
		},
		rank: {
			type: Number,
			default: 0,
		},
		armor: {
			helmet: {
				type: String,
				default: "[NONE]",
			},
			chest: {
				type: String,
				default: "[NONE]",
			},
			legging: {
				type: String,
				default: "[NONE]",
			},
			weapon: {
				type: String,
				default: "[NONE]",
			},
		},
	},
	consecutivePrizes:{
		dailyPrize: {
			type: Number,
			default: 0,
		},
		weeklyPrize:{
			type: Number,
			default: 0,
		},
	},
	// Array of Objects.
	// quests: [{started: Bolean, questKeySequence: Array, name: String}]
	quests: {
		type: [
			{
				type: Object,
			},
		],
		default: [{
			started: false,
			questKeySequence: ["gettingStarted", "buildMine"],
			name: "Build a Mine",
			// pve: [{ // Raid is optional
			// 	name: String, // e.g: "Collapsed Mine"
			//	completed: Bolean,
			// chance: Number, // e.g. 0.5 chance to get it (50%)
			// },]
		}],
	},
	completedQuests: [String],
	// Saving the rooms etc, of the towers
	tower: {
		"solo full-army": {
			level: {
				type: Number,
				default: 1,
			}
		},
		"trio full-army": {
			level: {
				type: Number,
				default: 1,
			},
			users: {
				type: Array,
				default: [],
			}
		},
		"solo hero": {
			level: {
				type: Number,
				default: 1,
			},
		},
		"trio hero": {
			level: {
				type: Number,
				default: 1,
			},
			users: {
				type: Array,
				default: [],
			}
		}
	},

	// object too big, moved to ./uservalues/default
	statistics,
}, {
	timestamps: {
		createdAt: "createdAt",
		updatedAt: "updatedAt",
	},
});

userSchema.methods.startQuest = async function(questName) {
	const foundIndex = this.quests.indexOf(this.quests.find(q => {
		return q.name === questName;
	}));
	this.quests[foundIndex].started = true;
	this.markModified(`quests.${foundIndex}.started`);
};

userSchema.methods.addNewQuest = async function(quest) {
	this.quests.push(quest);
};

userSchema.methods.removeQuest = async function(questName) {
	const questIndex = this.quests.indexOf(this.quests.find(q => q.name === questName));
	this.quests.splice(questIndex, 1);
	this.completedQuests.push(questName);

	return;
};

userSchema.methods.updateQuestObjective = async function(quest) {
	const questIndex = this.quests.indexOf(this.quests.find(q => q.name === quest.name));
	this.quests[questIndex].pve = quest.pve;

	this.markModified(`quests.${questIndex}.pve`);
	return this.save();
};

userSchema.methods.refreshQuestPve = async function(questName, pveIndex = 0) {
	const questIndex = this.quests.indexOf(this.quests.find(q => q.name === questName));
	this.quests[questIndex].pve[pveIndex].completed = false;

	this.markModified(`quests.${questIndex}.pve.${pveIndex}.completed`);
};

userSchema.methods.gainResource = function(resource, quantity) {
	this.resources[resource] += quantity;
	return this.save();
};

userSchema.methods.gainManyResources = function(obj) {
	Object.keys(obj).forEach(r=>{
		this.resources[r] += obj[r];
	});
};

userSchema.methods.removeManyResources = function(obj) {
	Object.keys(obj).forEach(r=>{
		this.resources[r] -= obj[r];
		if(this.resources[r] < 0) this.resources[r] = 0;
	});
};


userSchema.methods.setNewCooldown = function(type, now) {
	this.cooldowns[type] = now;
};

userSchema.methods.handleExplore = function(currentLocation, place) {
	if (!this.world.locations[currentLocation].explored.includes(place)) {
		this.world.locations[currentLocation].explored.push(place);
		this.markModified(this.world.locations[currentLocation].explored);
	}
};

userSchema.methods.removeExploredArea = function(currentLocation, place) {
	const locationIndex = this.world.locations[currentLocation].explored.indexOf(place);
	this.world.locations[currentLocation].explored.splice(locationIndex, 1);

	this.markModified(`world.locations.${currentLocation}.explored`);

	return this.save();
};

userSchema.methods.buyBuilding = function(building, buildingCost) {
	for (const resource in buildingCost.cost) {
		this.resources[resource] -= buildingCost.cost[resource];
	}

	this.empire = this.empire.filter(structure => !(structure.position[0] === building.position[0] && structure.position[1] === building.position[1]));
	this.empire.push(building);
	return this.save();
};

userSchema.methods.destroyBuilding = function(building) {
	this.empire = this.empire.filter(structure => !(structure.position[0] === building.position[0] && structure.position[1] === building.position[1]));
};

userSchema.methods.changeBuildingLevel = function(buildingName, buildingLevel, level) {
	let buildingIndex = -1;
	const userBuilding = this.empire.find((structure, i) =>{
		if(structure.name === buildingName && structure.level === buildingLevel) {
			buildingIndex = i;
			return true;
		}
		return false;
	});
	if(userBuilding) {
		userBuilding.level += level;

		this.markModified(`empire.${buildingIndex}.level`);
	}

	return;
};

userSchema.methods.updateHousePop = function(newPop) {
	this.maxPop = newPop;
	return this.save();
};

userSchema.methods.updateMaxBuildings = function() {
	const senate = this.empire.find(building => building.name === "senate");

	this.maxBuildings = 9 + senate.level + 1;
};

// Recruit, Add or Remove Units
userSchema.methods.addOrRemoveUnits = function(unit, amount, free) {
	if(!free) {
		for (const resource in unit.cost) {
			this.resources[resource] -= unit.cost[resource] * amount;
		}
	}

	this.army.units[unit.requirement.building][unit.name] += amount;
	// this.markModified(`army.units.${unit.requirement.building}.${unit.name}`);
};

userSchema.methods.updateNewProduction = function(productionName, now, producing) {
	const foundIndex = this.empire.findIndex(building => building.name === productionName && !building.lastCollected);
	if (foundIndex === -1) {
		return;
	}
	this.empire[foundIndex].lastCollected = now;

	if(!this.empire[foundIndex].producing) this.empire[foundIndex].producing = producing;

	this.markModified(`empire.${foundIndex}.lastCollected`);
	this.markModified(`empire.${foundIndex}.producing`);

	return this.save();
};

// Takes an array of strings of the buildings you want to collect (mine, lumbermill, etc) and the
// new Date() and collects the resources from these buildings
// Optional: agrument "resource", if it is true, it will also set the resource to be produced
// by the building to resource
userSchema.methods.collectResource = async function(collectBuildings, now, resource) {
	const totalCollected = {};

	collectBuildings.forEach(collect => {
		this.empire.forEach((building, i) => {
			if(building.name === collect) {
				const { producing, lastCollected:lastCol, level, name } = building;
				// checks how many minutes it has been since last collected, and calculates produced value
				const lastCollected = (now - lastCol) / 60000;
				let produced = Math.floor(lastCollected * buildingsObject[name]
					.levels.find(b => b.level === level).productionRate);

				// If collect was called before you have any at all (prevent the reset of collect)
				if(!produced && !resource) {
					return totalCollected[producing] = totalCollected[producing] ?
						totalCollected[producing] + produced : produced;
				}

				// Max 100 resources is collectable at a time
				if(produced > 100) produced = 100;

				// Updates the building in this.empire
				this.resources[producing] = this.resources[producing] ?
					this.resources[producing] + produced : produced;
				totalCollected[producing] = totalCollected[producing] ?
					totalCollected[producing] + produced : produced;
				building.lastCollected = now;
				this.markModified(`empire.${i}.lastCollected`);

				// Changes the resource produced
				if(resource) {
					building.producing = resource;
					this.markModified(`empire.${i}.producing`);
				}
			}
		});
	});

	await this.save();

	return totalCollected;
};

userSchema.methods.addItem = function(item, amount = 1, craft) {
	if(craft) {
		// Resource cost
		for(const resource in item.cost) {
			this.resources[resource] -= item.cost[resource] * amount;
		}
	}

	// Add item to user
	let itemType;
	let markModifiedString = "";
	item.typeSequence.forEach(type => {
		itemType = itemType ? itemType[type] : this[type];
		markModifiedString += type + ".";
	});

	itemType[item.name] = typeof itemType[item.name] === "number" ?
		itemType[item.name] + amount : amount;

	this.markModified(`${markModifiedString}${item.name}`);
};

// Removes the item (if hero => remove it from hero, else from armory)
userSchema.methods.removeItem = function(item, hero, amount = 1) {
	// Removes the item from the hero
	const itemType = item.typeSequence[item.typeSequence.length - 1];

	if(hero) {
		this.hero.armor[itemType] = "[NONE]";

		this.markModified("hero.armor");
	}
	else {
		this.army.armory[itemType][item.name] -= amount;
		this.markModified(`army.armory.${itemType}.${item.name}`);
	}
};

userSchema.methods.handleFishResult = function(goldresult, now) {
	this.cooldowns.fish = now;
	if(goldresult > 0) {
		this.resources.gold += goldresult;
	}
};

userSchema.methods.equipItem = function(item, currentItem) {
	// Added hero equipment bonus (equipment is better worn by heroes)
	const heroEquipmentBonus = 2;
	const itemType = item.typeSequence[item.typeSequence.length - 1];

	// Remove and Add item to hero armor and armory
	this.army.armory[itemType][item.name] -= 1;
	this.hero.armor[itemType] = item.name;

	// Remove old stats and add new item stats to hero
	if(currentItem) {
		// Add old item to armory
		if(!this.army.armory[itemType][currentItem.name]) this.army.armory[itemType][currentItem.name] = 0;
		this.army.armory[itemType][currentItem.name] += 1;

		for(const stat in currentItem.stats) {
			this.hero[stat] -= currentItem.stats[stat] * heroEquipmentBonus;
		}
	}

	for(const stat in item.stats) {
		this.hero[stat] += item.stats[stat] * heroEquipmentBonus;
	}

	this.markModified(`army.armory.${itemType}`);
	this.markModified(`hero.armor.${itemType}`);

	return this.save();
};

// lossPercentage: 0.9 => 10% units loss
userSchema.methods.unitLoss = function(lossPercentage, towerFight) {
	// Kill off unit depending on the lossPercentage
	Object.values(this.army.units).forEach(unitBuilding => {
		Object.keys(unitBuilding).forEach(unit => {
			if(typeof unitBuilding[unit] === "number") {
				unitBuilding[unit] = Math.floor(unitBuilding[unit] * lossPercentage);
				this.markModified(`army.units.${unitBuilding}.${unit}`);
			}
		});
	});

	// Remove hp from your hero depending on the loss percentage
	this.hero.currentHealth = Math.floor(this.hero.currentHealth * lossPercentage);

	// if the hero dies
	if (this.hero.currentHealth <= 0 && this.hero.rank > 0 && !towerFight) {
		Object.keys(heroStatIncreaseOnLevel[this.hero.rank]).forEach(s=>{
			this.hero[s] -= heroStatIncreaseOnLevel[this.hero.rank][s];
		});
		this.hero.rank -= 1;
		this.hero.expToNextRank = heroExpToNextLevel[this.hero.rank];
		this.hero.currentExp = heroExpToNextLevel[this.hero.rank - 1] || 50;
	}
};

userSchema.methods.heroHpLoss = function(lossPercentage) {

	this.hero.currentHealth = Math.floor(this.hero.currentHealth * lossPercentage);
	// if the hero dies
	if (this.hero.currentHealth <= 0 && this.hero.rank > 0) {
		Object.keys(heroStatIncreaseOnLevel[this.hero.rank]).forEach(s=>{
			this.hero[s] -= heroStatIncreaseOnLevel[this.hero.rank][s];
		});
		this.hero.rank -= 1;
		this.hero.expToNextRank = heroExpToNextLevel[this.hero.rank];
		this.hero.currentExp = heroExpToNextLevel[this.hero.rank - 1] || 50;
	}
};

userSchema.methods.heroHpLossFixedAmount = function(damage) {
	this.hero.currentHealth -= damage;
	// if the hero dies
	if (this.hero.currentHealth <= 0 && this.hero.rank > 0) {
		Object.keys(heroStatIncreaseOnLevel[this.hero.rank]).forEach(s=>{
			this.hero[s] -= heroStatIncreaseOnLevel[this.hero.rank][s];
		});
		this.hero.rank -= 1;
		this.hero.expToNextRank = heroExpToNextLevel[this.hero.rank];
		this.hero.currentExp = heroExpToNextLevel[this.hero.rank - 1] || 50;
	}
	if (this.hero.currentHealth < 0) {
		this.hero.currentHealth = 0;
	}
};

// Takes a number, and heals the hero for that much hp
userSchema.methods.healHero = function(heal, item) {
	this.hero.currentHealth += heal;
	if(this.hero.currentHealth > this.hero.health) this.hero.currentHealth = this.hero.health;

	if(item) {
		this.hero.inventory[item] -= 1;
		this.markModified("hero.inventory");
	}

	return;
};

// NB: I think I can remove the markModified (or atleast only have it for hero?)
userSchema.methods.gainExp = async function(exp, newExpToNextRank, statGains) {
	this.hero.currentExp += exp;
	if(newExpToNextRank) {
		this.hero.expToNextRank = newExpToNextRank;
		this.hero.rank += 1;

		// Stat gains for new level
		for(const stat in statGains) {
			this.hero[stat] += statGains[stat];
			this.markModified(`hero.${stat}`);
		}
		this.markModified("hero.expToNextRank");
	}

	this.markModified("hero.currentExp");

	return this.save();
};

userSchema.methods.removeExp = async function(exp, newExpToNextRank, statRemoval) {
	this.hero.currentExp -= exp;
	if(this.hero.currentExp < 0) this.hero.currentExp = 0;

	if(newExpToNextRank) {
		this.hero.expToNextRank = newExpToNextRank;
		this.hero.rank -= 1;

		// Stat gains for new level
		for(const stat in statRemoval) {
			this.hero[stat] -= statRemoval[stat];
		}

	}

	return this.save();
};

userSchema.methods.buyItem = async function(item, amount = 1) {
	if(item.price) {
		this.resources.gold -= item.price * amount;
	}

	if(!this.hero.inventory[item.name]) this.hero.inventory[item.name] = amount;
	else this.hero.inventory[item.name] += amount;

	this.markModified("hero.inventory");
};

userSchema.methods.handleConsecutive = function(resources, consecutive, cyclus) {
	this.consecutivePrizes[cyclus] = consecutive;

	Object.keys(resources).forEach(r=>{
		this.resources[r] += resources[r];
	});
};


// csType: String, now: new Date,
// Loot: Array of objects with a key sequence to what it being gained and the amount
userSchema.methods.pvpHandler = async function(cdType, now, loot) {
	this.cooldowns[cdType] = now;

	loot.forEach(l => {
		let lootType;
		let markModifiedString = "";
		l.keySequence.forEach((key, i) => {
			if(i >= l.length - 1) {
				return lootType += l.quantity;
			}
			lootType = lootType ? lootType[key] : this[key];
			markModifiedString += key + ".";
		});

		this.markModified(`${markModifiedString}`);
	});

	return this.save();
};

//
userSchema.methods.alternativeGainXp = async function(xp = 0) {
	if (xp) {
		this.hero.currentExp += xp;
	}
	if (this.hero.currentExp >= this.hero.expToNextRank) {
		if (heroExpToNextLevel.length > this.hero.rank + 1) {
			this.hero.rank += 1;
			this.hero.expToNextRank = heroExpToNextLevel[this.hero.rank];
			Object.keys(heroStatIncreaseOnLevel[this.hero.rank]).forEach(s=>{
				this.hero[s] += heroStatIncreaseOnLevel[this.hero.rank][s];
			});
		}
	}
};

userSchema.methods.unlockNewLocation = async function(location) {
	this.world.locations[location].available = true;

	return this.save();
};

userSchema.methods.locationTravel = async function(location) {
	this.world.currentLocation = location;
	return this.save();
};


userSchema.methods.giveDungeonKey = async function(key = "CM Key") {
	if (this.hero.dungeonKeys[key]) {
		return;
	}
	this.hero.dungeonKeys[key] += 1;
};
userSchema.methods.changeElo = async function(newElo) {
	if (typeof newElo !== "number") {
		console.error("elo must be Number", newElo);
		return;
	}
	this.hero.elo = newElo;
};

userSchema.methods.changeTowerLevel = function(towerCategory, newLevel) {
	if(typeof newLevel !== "number") {
		console.error("newLevel is not a number but " + typeof newLevel);
		return;
	}
	this.tower[towerCategory].level = newLevel;
};

module.exports = mongoose.model("User", userSchema);
