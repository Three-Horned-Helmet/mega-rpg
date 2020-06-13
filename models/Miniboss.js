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
    dead: {
        type:Boolean,
        default:false,
    },
    allowArmy: {
        type:Boolean,
        default:true,
    },
    allowHelpers:{
        type:Boolean,
        default:true,
    },
    stats:{
        attack:100,
        health:100,
    },
    helpers:{
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    rewards:{
        dungeonKey: {
            type:String,
            default: "Ogre tooth",
        },
        xp:{
            type: Number,
            default: 100,
        },
    },
}, {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  });
  module.exports = mongoose.model("Miniboss", bossSchema);