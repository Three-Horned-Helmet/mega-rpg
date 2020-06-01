const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const { Schema } = mongoose;

const userSchema = new Schema({
	username: String,
	userId: String,
	banned: Boolean,
	coolDowns: {
		hunt: {
			type: Number,
			default:0,
		},
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
		smallHealPotion: {
			type: Number,
			default: 1,
		},
	},
	currentExp: {
		type: Number,
		default: 1,
	},
	expToNextLevel: {
		type: Number,
		default: 100,
	},
});
module.exports = mongoose.model('User', userSchema);