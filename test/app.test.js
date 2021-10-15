/* eslint-disable no-undef */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const { createTestUser, generateDiscordMessage } = require("./helper");

const chai = require("chai");
const { expect } = chai;

const mongodbUri = process.env.TEST_MONGODB_URI;

describe("test suite", () => {
	before("connect", async ()=> {
		mongoose.connect(mongodbUri, { useUnifiedTopology: true, useNewUrlParser: true });
		mongoose.connection
			.once("open", () => {
				return User.deleteMany().then((result)=>{
					console.log(result.deletedCount, " users deleted");
					console.log("Database connected and cleaned!");
				});
			})
			.on("error", (error) => {
				console.warn("Error : ", error);
			});
	});
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});
	describe("database helper functions", ()=>{

		it("Should be able to create a user", async ()=> {
			const account = {
				username: "Beate Bueskytter",
				userId: "285744285944333194",
			};
			const testUser = await createTestUser({ account });

			expect(testUser.account.username).to.equal("Beate Bueskytter");
			expect(testUser.account.userId).to.equal("285744285944333194");
		});
		it("Should be able to create several users and find them in database", async ()=> {
			const users = [];
			for (let i = 0; i < 5; i++) {
				users.push(createTestUser());
			}
			const allUsers = await Promise.all(users);
			const dbResult = await User.find({});

			expect(allUsers.length).to.equal(5);
			expect(dbResult.length).to.equal(5);
		});
		it("Should mock a discord message object", async ()=>{

			const account = {
				username: "Cathrine Capsemaker",
				userId: Math.floor(Math.random() * 100) + 1 + "",
			};
			const testUser = await createTestUser({ account });
			const successMessage = await generateDiscordMessage(testUser);
			expect(successMessage.author.username).to.equal(account.username);
			expect(successMessage.author.userId).to.equal(account.userId);
			expect(successMessage.reply("Hey!")).to.equal("Hey!");
			expect(successMessage.channel.send("Bye!")).to.equal("Bye!");
		});
		it("Should throw when mocking a discord message without params", ()=>{
			expect(()=>generateDiscordMessage()).to.throw();
		});
	});
});