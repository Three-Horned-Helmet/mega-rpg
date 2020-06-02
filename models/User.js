const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const { getNewExpValue } = require("./helper");

const { Schema } = mongoose;

const userSchema = new Schema({
	account: {
		username: String,
		userId: String,
		banned: Boolean,
	},
	maxPop: {
		type: Number,
		default: 10,
	},
	coolDowns: {
		hunt: {
			type: Date,
			default: 0,
		},
	},
	resources: {
		gold: {
			type: Number,
			default: 100,
		},

		yew: Number,
		oak: {
			type: Number,
			default: 5,
		},

		["copper Ore"]: {
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
			helmets: {},
			chest: {},
			leggings: {},
			weapon: {},
		},
		units: {
			archery: {},
			barracks: {
				peasant: {
					type: Number,
					default: 5,
				},
			},
		},
	},

	empire: {
		type: Array,
		default: [
			/* {
        name: "barracks",
        position: [1, 2],
        level: 0,
      },
      {
        name: "mine",
        position: [0, 3],
        level: 0,
        lastCollected: 0,
        producing: "Ore",
      }, */
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
		},
		currentExp: {
			type: Number,
			default: 1,
		},
		exoToNextRank: {
			type: Number,
			default: 100,
		},
		rank: {
			type: Number,
			default: 0,
		},
		armor: {
			helmets: {},
			chest: {},
			leggings: {},
			weapon: {},
		},
	},
});

userSchema.methods.gainExp = function(n) {
	this.hero.exp += n;
	if (this.hero.exp >= this.hero.exoToNextRank) {
		this.hero.exoToNextRank = getNewExpValue(this.hero);
		this.hero.rank += 1;
	}
	this.save();
};

userSchema.methods.buyBuilding = function(building, buildingCost) {
	for(const resource in buildingCost) {
		this.resources[resource] -= buildingCost[resource];
	}

	this.empire.push(building);
	return this.save();
};

userSchema.methods.recruitUnits = function(unit, amount) {
	for(const resource in unit.cost) {
		this.resources[resource] -= unit.cost[resource] * amount;
	}

	console.log(typeof this.army.units[unit.requirement.building][unit.name], typeof amount);
	this.army.units[unit.requirement.building][unit.name] += amount;

	return this.save();
};

module.exports = mongoose.model("User", userSchema);
