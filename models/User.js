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

    oak: {
      type: Number,
      default: 5,
    },
    yew: {
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
      helmets: {},
      chest: {},
      leggings: {},
      weapon: {},
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
        default: '[NONE]'
      },
      chest: {
        type: String,
        default: '[NONE]'
      },
      leggings: {
        type: String,
        default: '[NONE]'
      },
      weapon: {
        type: String,
        default: '[NONE]'
      },
    },
  },
});

userSchema.methods.gainExp = function (n) {
  this.hero.exp += n;
  if (this.hero.exp >= this.hero.expToNextRank) {
    this.hero.expToNextRank = getNewExpValue(this.hero);
    this.hero.rank += 1;
  }
  this.save();
};

userSchema.methods.buyBuilding = function (building, buildingCost) {
  for (const resource in buildingCost.cost) {
    this.resources[resource] -= buildingCost.cost[resource];
  }

  this.empire = this.empire.filter(structure => !(structure.position[0] === building.position[0] && structure.position[1] === building.position[1]));
  this.empire.push(building);
  return this.save();
};

userSchema.methods.updateHousePop = function (newPop) {
  this.maxPop = newPop;
  return this.save();
};

userSchema.methods.recruitUnits = function (unit, amount) {
  for (const resource in unit.cost) {
    this.resources[resource] -= unit.cost[resource] * amount;
  }

  this.army.units[unit.requirement.building][unit.name] += amount;
  // this.markModified(`army.units.${unit.requirement.building}.${unit.name}`);

  return this.save();
};

userSchema.methods.updateNewProduction = function (productionName, product, now) {
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
userSchema.methods.collectResource = async function (collectBuildings, now, resource) {
  const totalCollected = {};

  collectBuildings.forEach(collect => {
    this.empire.forEach((building, i) => {
      if (building.name === collect) {
        const { producing, lastCollected: lastCol, level, name } = building;
        // checks how many minutes it has been since last collected, and calculates produced value
        const lastCollected = Math.floor((now.getTime() - lastCol.getTime()) / 60000);
        const produced = Math.floor(lastCollected / buildingsObject[name].levels[level].productionRate);

        // Updates the building in this.empire
        this.resources[producing] = this.resources[producing] ? this.resources[producing] + produced : produced;
        totalCollected[producing] = totalCollected[producing] ? totalCollected[producing] + produced : produced;
        building.lastCollected = now;
        this.markModified(`empire.${i}.lastCollected`);

        // Changes the resource produced
        if (resource) {
          building.producing = resource;
          this.markModified(`empire.${i}.producing`);
        }
      }
    });
  });

  await this.save();

  return totalCollected;
};

module.exports = mongoose.model("User", userSchema);
