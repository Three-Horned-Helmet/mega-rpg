require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const { Schema } = mongoose;

const bossSchema = new Schema({
    name: String,
    canKill:{
        type:Boolean,
        default:false,
    },
    active: {
        type:Boolean,
        default:true,
    },
    allowArmy: {
        type:Boolean,
        default:false,
    },
    allowHelpers:{
        type:Boolean,
        default:true,
    },
    stats:{
        attack:{
            type:Number,
            default:1000,
        },
        health:{
            type:Number,
            default:1000,
         },
    },
    helpers:{
        type: Array,
        default: [],
    },
    rewards:{
        dungeonKey: {
            type:String,
            default: "Ogre tooth",
        },
        xp:{
            type: Number,
            default: 500,
        },
        gold:{
            type: Number,
            default: 2222,
        },
    },
}, {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  });

  bossSchema.methods.addUser = function(discordId) {
	if (this.helpers.includes(discordId)) {
        return;
    }
    if (this.helpers.length > 10) {
        return;
    }
    this.helpers.push(discordId);
	return this.save();
};

bossSchema.methods.deactivateMiniboss = function() {
	this.active = false;
	return this.save();
};
  module.exports = mongoose.model("Miniboss", bossSchema);