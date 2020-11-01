require("dotenv").config();
const { randomIntBetweenMinMax } = require("../game/_GLOBAL_HELPERS");

const mongoose = require("mongoose");
const User = require("../models/User");

const uri = process.env.MONGODB_URI;
mongoose
	.connect(uri, { poolSize: 100, useNewUrlParser: true })
	.then(db => {
		console.log(`Seeding process started. Database name: "${db.connections[0].name}"`);
	})
	.catch(err => {
		console.error("Error connecting to mongo", err);
	});

const rndmId = () => {
	return Math.floor(Math.random() * 1000000) + "";
};


const createTestUser = ({
	account = {
		username: Math.random().toString(36).substring(7),
		userId: rndmId(),
		testUser: true,
		servers: [Math.random() > 0.3 ? "717462802272485516" : "8275918275289"]
	},
	resources = {
		"gold": randomIntBetweenMinMax(0, 1000),
		"oak wood":randomIntBetweenMinMax(0, 1000),
		"yew wood":randomIntBetweenMinMax(0, 1000),
		"copper ore":randomIntBetweenMinMax(0, 1000),
	},
	world = {
		currentLocation:"Grassy Plains",
		locations:{
			"Grassy Plains":{
				available:true,
				explored:[] },
		},
	},
	hero = {
		elo:randomIntBetweenMinMax(500, 2000),
		currentExp: randomIntBetweenMinMax(0, 1000),
		rank:randomIntBetweenMinMax(1, 10),
	},
	maxPop = randomIntBetweenMinMax(0, 1000),
	completedQuests = Array.from({ length:randomIntBetweenMinMax(0, 12) }, (n, j)=> `myFakeQuest${j}`),
	army = {
		units:{
			archery:{
				huntsman:randomIntBetweenMinMax(0, 1000),
				archer:randomIntBetweenMinMax(0, 1000),
				ranger:randomIntBetweenMinMax(0, 1000),
			},
			barracks:{
				peasant:randomIntBetweenMinMax(0, 1000),
				militia:randomIntBetweenMinMax(0, 1000),
				guardsman:randomIntBetweenMinMax(0, 1000),
			},
		},
	},
	...otherParams
} = {}) => {

	const user = new User({
		account,
		resources,
		world,
		hero,
		maxPop,
		completedQuests,
		army,
		...otherParams,
	});
	return user.save();
};

User.deleteMany({ "account.testUser":true })
	// eslint-disable-next-line no-unused-vars
	.then(() => Promise.all(Array.from({ length: 20 }, async _ => createTestUser())))
	.then(usersCreated => {
		console.log(`${usersCreated.length} users created with the following id:`);
		console.log(usersCreated.map(u => u._id));
	})
	.then(() => {
		mongoose.disconnect();
		process.exit(0);
	})
	.catch(err => {
		mongoose.disconnect();
		throw err;
	});