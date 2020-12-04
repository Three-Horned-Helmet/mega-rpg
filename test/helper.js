const User = require("../models/User");

const rndmId = () => {
	return Math.floor(Math.random() * 1000000) + "";
};

const isRequired = () => { throw new Error("param is required"); };

// to create a customized testuser:
// const testUser = await createTestUser({ resource:{gold:20000} })

const createTestUser = ({
	// default values
	account = {
		username: "Anniken Avisbud",
		userId: rndmId(),
		testUser: true,
	},
	resources = {
		gold:100,
		"oak wood":5,
		"yew wood":0,
		"copper ore":5,
	},
	world = {
		currentLocation:"Grassy Plains",
		locations:{
			"Grassy Plains":{
				available:true,
				explored:[] },
		},
	},
	maxPop = 10,
	army = {
		armory: {
			helmet: {},
			chest: {},
			legging: {},
			weapon: {},
		},
		units:{
			archery:{
				huntsman:0,
				archer:0,
				ranger:0,
			},
			barracks:{
				peasant:5,
				militia:0,
				guardsman:0,
			},
		},
	},
	...otherParams
} = {}) => {

	const user = new User({
		account,
		resources,
		world,
		maxPop,
		army,
		...otherParams,
	});
	return user.save();
};

const generateDiscordMessage = (user = isRequired())=>{
	const message = {
		author:{
			username:user.account.username,
			userId:user.account.userId,
		},
		reply:function(result) {
			return result;
		},
		channel:{
			send:function(result) {
				result.react = function(icon) {
					return icon;
				};
				result.createReactionCollector = function(icon) {
					return icon;
				};
				return result;
			},
		},
	};
	return message;
};

const mockDays = (d = 1) => {
	// one day + 1 minute to ensure to bypass cooldown
	const ms = (1000 * 60 * 60 * 24 * d);
	const now = new Date(Date.now() + ms + 60000);
	return now;
};

module.exports = { createTestUser, generateDiscordMessage, mockDays };
