require("dotenv").config();

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
const users = [];

for (let i = 0; i < 20; i++) {
	users.push({
		account: {
			username: Math.random().toString(36).substring(7),
			userId: rndmId(),
			testUser: true,
			servers: [Math.random() > 0.3 ? "717462802272485516" : "8275918275289"]
		},
		resources : {
			gold:Math.floor(Math.random() * 1000),
			"oak wood":Math.floor(Math.random() * 1000),
			"yew wood":Math.floor(Math.random() * 1000),
			"copper ore":Math.floor(Math.random() * 1000),
		},
		world : {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:[] },
			},
		},
		hero: {
			elo:Math.floor(Math.random() * 2000) + 500,
			currentExp: Math.floor(Math.random() * 1000),
			rank:Math.floor(Math.random() * 10),
		},
		maxPop : Math.floor(Math.random() * 1000),
		army : {
			units:{
				archery:{
					huntsman:Math.floor(Math.random() * 1000),
					archer:Math.floor(Math.random() * 1000),
					ranger:Math.floor(Math.random() * 1000),
				},
				barracks:{
					peasant:Math.floor(Math.random() * 1000),
					militia:Math.floor(Math.random() * 1000),
					guardsman:Math.floor(Math.random() * 1000),
				},
			},
		},
		completedQuests: Array.from({ length:Math.floor(Math.random() * 12) }, (n, j)=> `myFakeQuest${j}`)
	});
}

User.deleteMany()
	.then(() => {
		return User.create(users);
	})
	.then(usersCreated => {
		console.log(`${usersCreated.length} users created with the following id:`);
		console.log(usersCreated.map(u => u._id));
	})
	.then(() => {
		mongoose.disconnect();
	})
	.catch(err => {
		mongoose.disconnect();
		throw err;
	});