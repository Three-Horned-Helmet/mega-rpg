const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const { getNewExpValue } = require("./helper");

const { Schema } = mongoose;

const buildingsObject = require("../game/build/buildings-object");

const userSchema = new Schema({
	account: {
		username: String,
		userId: String,
		banned: {
			type: Boolean,
			default: false,
		},
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
	cooldowns: {
		explore: {
			// this will lead to two hour diff from node and mongo cluster (not wanted behaviour)
			type:Date,
			default:new Date(),
		},
	},
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

		["copper ore"]: {
			type: Number,
			default: 5,
		},
		["iron ore"]: Number,
		["bronze bar"]: Number,
		["iron bar"]: Number,
		["steel bar"]: Number,
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
			enum:["Grassy Plains", "Misty Mountains"],
		},

		locations: {
			"Grassy Plains": {
				available: {
					type: Boolean,
					default: true,
				},
				explored: [String],
			},
			/* "Mist Mountains": {
				available: {
					type: Boolean,
					default: false,
				},
				explored: [String],
			}, */
		},
	},

	empire: {
		type: Array,
		default: [

		],
	},
	hero: {
		level: {
			type: Number,
			default: 0,
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
			["Small Heal Potion"]: {
				type: Number,
				default: 1,
			},
			["Large Heal Potion"]: {
				type: Number,
				default: 0,
			},
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
			leggings: {
				type: String,
				default: "[NONE]",
			},
			weapon: {
				type: String,
				default: "[NONE]",
			},
		},
	},
});

userSchema.methods.gainExp = function(n) {
	this.hero.exp += n;
	if (this.hero.exp >= this.hero.expToNextRank) {
		this.hero.expToNextRank = getNewExpValue(this.hero);
		this.hero.rank += 1;
	}
	this.save();
};

userSchema.methods.setNewCooldown = function(type, now) {
	this.cooldowns[type] = now;
	this.save();
};

userSchema.methods.handleExplore = function(now, currentLocation, place) {
	this.cooldowns.explore = now;
	if (!this.world.locations[currentLocation].explored.includes(place)) {
		this.world.locations[currentLocation].explored.push(place);
	}
	this.save();
};

userSchema.methods.buyBuilding = function(building, buildingCost) {
	for (const resource in buildingCost.cost) {
		this.resources[resource] -= buildingCost.cost[resource];
	}

	this.empire = this.empire.filter(structure => !(structure.position[0] === building.position[0] && structure.position[1] === building.position[1]));
	this.empire.push(building);
	return this.save();
};

userSchema.methods.updateHousePop = function(newPop) {
	this.maxPop = newPop;
	return this.save();
};

userSchema.methods.recruitUnits = function(unit, amount) {
	for (const resource in unit.cost) {
		this.resources[resource] -= unit.cost[resource] * amount;
	}

	this.army.units[unit.requirement.building][unit.name] += amount;
	// this.markModified(`army.units.${unit.requirement.building}.${unit.name}`);

	return this.save();
};

userSchema.methods.updateNewProduction = function(productionName, product, now) {
	const foundIndex = this.empire.findIndex(building => building.name === productionName && !building.lastCollected);
	if (foundIndex === -1) {
		return;
	}
	this.empire[foundIndex].lastCollected = now;
	this.empire[foundIndex].producing = product;

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
					.levels[level].productionRate);

				// If collect was called before you have any at all (prevent the reset of collect)
				if(!produced) {
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

userSchema.methods.craftItem = function(item, amount) {
	// Resource cost
	for(const resource in item.cost) {
		this.resources[resource] -= item.cost[resource] * amount;
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

	return this.save();
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
		this.army.armory[itemType][currentItem.name] += 1;

		for(const stat in currentItem.stats) {
			this.hero[stat] -= currentItem.stats[stat] * heroEquipmentBonus;
		}
	}

	for(const stat in item.stats) {
		this.hero[stat] += item.stats[stat] * heroEquipmentBonus;
	}

	this.markModified(`army.armory.${itemType}.${item.name}`);
	this.markModified(`hero.armor.${itemType}`);

	return this.save();
};

userSchema.methods.unitLoss = function(lossPercentage) {
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

	return this.save();
};

// Takes a number, and heals the hero for that much hp
userSchema.methods.healHero = function(heal, item) {
	this.hero.currentHealth += heal;
	if(this.hero.currentHealth > this.hero.health) this.hero.currentHealth = this.hero.health;

	if(item) {
		this.hero.inventory[item.name] -= 1;
		this.markModified(`hero.inventory.${item.name}`);
	}

	return this.save();
};
// NB: I think I can remove the markModified (or atleast only have it for hero?)
userSchema.methods.gainExp = async function(exp, newExpToNextLevel, statGains) {
	this.hero.currentExp += exp;
	if(newExpToNextLevel) {
		this.hero.expToNextRank = newExpToNextLevel;
		this.hero.level += 1;

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


module.exports = mongoose.model("User", userSchema);
