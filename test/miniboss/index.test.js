/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const { createTestUser } = require("../helper");

const minibossCommand = require("../../commands/miniboss");
const { giveRewards, minibossStartAllowed, validateHelper, createMinibossEvent, generateRewards, setupProgress } = require("../../game/miniboss/helper");

const world = {
	currentLocation:"Grassy Plains",
	locations:{
		"Grassy Plains":{
			available:true,
			explored:["C'Thun"] },
	},
};


describe("miniboss ", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});
	it("should exist", () => {
		expect(minibossCommand).to.not.equal(undefined);
	});
	describe("user validation ", () => {
		it(" should fail if user is in cooldown", async ()=>{
			const now = new Date();
			const testUser = await createTestUser({ world });
			await testUser.setNewCooldown("miniboss", now);
			const result = await minibossStartAllowed(testUser);
			expect(result.fields[0].name).to.have.string("You can't use this command. Cooldown is");
		});

		it(" should fail if hp too low", async ()=>{
			const hero = {
				currentHealth : 1,
				health:100,
			};
			const testUser = await createTestUser({ world, hero });
			const result = await minibossStartAllowed(testUser);
			expect(result).to.have.string("Your hero's health is too low");
			const hero2 = {
				currentHealth : 49,
				health:100,
			};
			const testUser2 = await createTestUser({ world, hero:hero2 });
			const result2 = await minibossStartAllowed(testUser2);
			expect(result2).to.have.string("Your hero's health is too low");
		});

		it("should fail if miniboss is not explored", async ()=>{
			const testUser = await createTestUser();
			const result = await minibossStartAllowed(testUser);
			expect(result).to.have.string("You haven't found any miniboss in");
			const testUser2 = await createTestUser({ world });
			testUser2.world.currentLocation = "Misty Mountains";
			const result2 = await minibossStartAllowed(testUser2);
			expect(result2).to.have.string("You haven't found any miniboss in");
		});

		it("validation should pass if user is 'ready' ", async ()=>{
			const testUser = await createTestUser({ world });
			const result = await minibossStartAllowed(testUser);
			expect(result).to.be.null;

		});
	});

	describe("helper validation ", () => {
		it("should fail if helper is not defined", async ()=>{
			const result = validateHelper(null, undefined, null);
			expect(result).to.be.equal("Something went wrong trying to join this raid!");
		});
		it("Shoudl fail if player is too low on hp", async ()=>{
			const testUser = {
				hero:{
					currentHealth: 10,
					health:100
				}
			};
			const result = validateHelper(null, testUser, null);
			expect(result).to.be.equal("Your HP is too low!");
		});
		it("should fail if helper is already in the raid", async ()=>{
			const testUser = {
				hero:{
					currentHealth: 100,
					health:100
				},
			};
			const testProgress = {
				teamGreen: [{
					account:{ userId:42 }
				}]
			};
			const result = validateHelper(testProgress, testUser, 42);
			expect(result).to.be.equal("You're already in the raid!");
		});
		it("should pass if all checkpoints passes", async ()=>{
			const testUser = {
				hero:{
					currentHealth: 100,
					health:100
				},
			};
			const testProgress = {
				teamGreen: [{
					account:{ userId:42 }
				}]
			};
			const result = validateHelper(testProgress, testUser, 5);
			expect(result).to.be.equal("");
		});
	});

	describe("generate and give rewards", () => {
		const initiativeTaker = {
			account: {
				userId: "42",
				username: "Zezima"
			},
			hero: {
				rank: 2,
				currentExp: 0,
				expToNextRank: 10000,
				dungeonKeys: { "CM Key": 0 }
			}
		};
		const helper = {
			account: {
				userId: "43",
				username: "Zarfot"
			},
			hero: {
				rank: 0,
				currentExp: 99,
				expToNextRank: 100,
				dungeonKeys: { "CM Key": 0 }
			}
		};
		const mockCombatResult = {
			originalGreenTeam: [initiativeTaker, helper],
			minRankToGetKey:2,
			rewards: {
				dungeonKey: "CM Key",
				gold: 500,
				xp: 250,
			}
		};

		it("Should generate a rewards for everyone included", async ()=>{
			const rewards = generateRewards(mockCombatResult);
			expect(rewards.initiativeTaker.gold).to.equal(250);
			expect(rewards.initiativeTaker.xp).to.equal(125);
			expect(rewards.initiativeTaker.dungeonKey).to.equal("CM Key");
			expect(rewards.initiativeTaker.leveledUp).to.equal(false);
			expect(rewards.helpers[0].randomHelperXp).to.be.above(1);
			expect(rewards.helpers[0].randomHelperGold).to.be.above(1);
			expect(rewards.helpers[0].leveledUp).to.be.equal(true);
		});

		it("not give a key if initiative taker is not high enough xp or already possess one", async ()=>{
			initiativeTaker.hero.dungeonKeys["CM Key"] = 1;
			const rewards = generateRewards(mockCombatResult);
			expect(rewards.initiativeTaker.dungeonKey).to.be.null;
			initiativeTaker.hero.dungeonKeys["CM Key"] = 0;
			initiativeTaker.hero.rank = 1;
			const rewards2 = generateRewards(mockCombatResult);
			expect(rewards2.initiativeTaker.dungeonKey).to.be.null;
		});
		it("should successfuly save rewards to database", async ()=>{
			const testUser = await createTestUser();
			const testUser2 = await createTestUser();
			const startGold = testUser.resources.gold;
			const startXp = testUser.hero.currentExp;
			const startGold2 = testUser2.resources.gold;
			const startXp2 = testUser2.hero.currentExp;
			const mockRewards = {
				initiativeTaker: { dungeonKey: "CM Key", gold: 250, xp: 125, leveledUp: false },
				helpers: [{
					randomHelperXp: 125,
					randomHelperGold: 250,
				}]
			};
			const fakeCombatResult = {
				teamGreen: [testUser, testUser2],
			};

			await giveRewards(mockRewards, fakeCombatResult);
			expect(testUser.resources.gold).to.be.equal(startGold + 250);
			expect(testUser.hero.currentExp).to.be.equal(startXp + 125);
			expect(testUser2.resources.gold).to.be.equal(startGold2 + 250);
			expect(testUser2.hero.currentExp).to.be.equal(startXp2 + 125);

		});
	});
	describe("Create miniboss event", () => {
		it("Should find miniboss in Grassy Plains", async ()=>{
			const result = createMinibossEvent({ world:{ currentLocation:"Grassy Plains" } });
			expect(result).to.not.be.equal(undefined);
			expect(result.name).to.be.equal("C'Thun");
		});
		it("Should find miniboss in Misty Mountains", async ()=>{
			const result = createMinibossEvent({ world:{ currentLocation:"Misty Mountains" } });
			expect(result).to.not.be.equal(undefined);
			expect(result.name).to.be.equal("Graveward");
		});
		it("Should find miniboss in Deep Caves", async ()=>{
			const result = createMinibossEvent({ world:{ currentLocation:"Deep Caves" } });
			expect(result).to.not.be.equal(undefined);
			expect(result.name).to.be.equal("Kraken");
		});
	});

	describe("Setup progress", () => {
		it("Should return setup object", async ()=>{
			const miniboss = createMinibossEvent({ world:{ currentLocation:"Deep Caves" } });
			const testUser = await createTestUser();
			const result = setupProgress(miniboss, testUser);
			expect(result).to.not.be.equal(undefined);
		});
	});
});

