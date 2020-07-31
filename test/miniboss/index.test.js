/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const minibossCommand = require("../../commands/miniboss");
const { createTestUser } = require("../helper");
const sleep = require("util").promisify(setTimeout);


const { minibossStartAllowed, createMinibossEvent, calculateMinibossResult } = require("../../game/miniboss");

const world = {
	currentLocation:"Grassy Plains",
	locations:{
		"Grassy Plains":{
			available:true,
			explored:["C'Thun"] },
	},
};


describe("miniboss command", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});
	it("should exist", () => {
		expect(minibossCommand).to.not.equal(undefined);
	});
	it("should run into cooldown if triggered too fast", async ()=>{

		const now = new Date();
		const testUser = await createTestUser({ world });
		await testUser.setNewCooldown("miniboss", now);
		const result = await minibossStartAllowed(testUser);
		expect(result.fields[0].name).to.have.string("You can't use this command. Cooldown is");
	});


	it("should not be able to trigger if not explored", async ()=>{
		const testUser = await createTestUser();
		const result = await minibossStartAllowed(testUser);
		expect(result).to.have.string("You haven't found any miniboss in");
	});
	it("should not be triggered if hp too low", async ()=>{

		const hero = {
			currentHealth : 1,
			health:100,
		};
		const testUser = await createTestUser({ world, hero });
		const result = await minibossStartAllowed(testUser);
		expect(result).to.have.string("Your hero's health is too low");

	});
	it("should succeed when initativetaker has higher rank than helper", async ()=>{

		const hero = {
			rank:9,
			stats:{
				attack:1,
				defense:1,
			},
		};
		const testUser = await createTestUser({ world, hero });
		const helper0 = await createTestUser({ hero:{ rank:3 } });
		const miniboss = createMinibossEvent(testUser);
		miniboss.helperIds.push(helper0.account.userId);
		let looping = true;
		let result;
		for (let i = 0; i < 20 && looping; i++) {
			result = await calculateMinibossResult(miniboss);
			if (result.win) looping = false;
		}
		await sleep(200);

		expect(result.win).to.be.equal(true);

	});

	it("should be rewarded with gold, dungeonkey, xp (and level up) win", async ()=>{

		const hero = {
			rank:5,
			currentExp: 99.99,
			expToNextRank: 100,
			stats:{
				attack:1,
				defense:1,
			},
			dungeonKeys:{
				["CM Key"]: 0,
			},
			resources:{
				gold:100
			}
		};

		const testUser = await createTestUser({ world, hero });
		const miniboss = createMinibossEvent(testUser);

		const helper0 = await createTestUser({ hero });
		const helper1 = await createTestUser({ hero });
		const helper2 = await createTestUser({ hero });

		miniboss.helperIds.push(helper0.account.userId);
		miniboss.helperIds.push(helper1.account.userId);
		miniboss.helperIds.push(helper2.account.userId);

		let looping = true;
		let result;
		for (let i = 0; i < 20 && looping; i++) {
			result = await calculateMinibossResult(miniboss);
			if (result.win) looping = false;
		}
		await sleep(200);


		expect(result.initiativeTaker.resources.gold > 100).to.not.equal(hero.resources.gold, result.initiativeTaker);
		expect(result.initiativeTaker.hero.health > 100).to.not.equal(hero.stats.health, result.initiativeTaker);
		expect(result.initiativeTaker.hero.attack > 1).to.not.equal(hero.stats.attack, result.initiativeTaker);
		expect(result.initiativeTaker.hero.currentExp > 100).to.not.equal(hero.stats.currentExp, result.initiativeTaker);
		expect(result.initiativeTaker.hero.rank).to.not.equal(hero.rank, result.initiativeTaker);
		expect(result.initiativeTaker.hero.dungeonKeys["CM Key"]).to.be.equal(1, result.initiativeTaker);


		result.helpers.forEach(helper=>{
			const { health, attack, currentExp, rank, dungeonKeys } = helper.hero;
			const { gold } = helper.resources;
			expect(gold).to.not.equal(hero.resources.gold, helper);
			expect(health).to.not.equal(hero.stats.health, helper);
			expect(attack).to.not.equal(hero.stats.attack, helper);
			expect(currentExp).to.not.equal(hero.stats.currentExp, helper);
			expect(rank).to.not.equal(hero.rank, helper);
			expect(dungeonKeys["CM Key"]).to.be.equal(0, helper);
		});
	});

	it("should succeed together with low rank and  helperIds with high rank", async ()=>{


		const testUser = await createTestUser({ world, hero:{ rank:1 } });
		const miniboss = createMinibossEvent(testUser);

		const helper0 = await createTestUser({ world, hero:{ rank:5 } });
		const helper1 = await createTestUser({ world, hero:{ rank:5 } });
		const helper2 = await createTestUser({ world, hero:{ rank:5 } });
		const helper3 = await createTestUser({ world, hero:{ rank:5 } });
		const helper4 = await createTestUser({ world, hero:{ rank:5 } });
		const helper5 = await createTestUser({ world, hero:{ rank:5 } });

		miniboss.helperIds.push(helper0.account.userId);
		miniboss.helperIds.push(helper1.account.userId);
		miniboss.helperIds.push(helper2.account.userId);
		miniboss.helperIds.push(helper3.account.userId);
		miniboss.helperIds.push(helper4.account.userId);
		miniboss.helperIds.push(helper5.account.userId);

		let looping = true;
		let result;
		for (let i = 0; i < 20 && looping; i++) {
			result = await calculateMinibossResult(miniboss);
			if (result.win) looping = false;
		}
		await sleep(200);
		expect(result.win).to.be.equal(true);

	});

	it("should lose with solo and low rank", async ()=>{


		const testUser = await createTestUser({ world });
		const miniboss = createMinibossEvent(testUser);

		let looping = true;
		let result;
		for (let i = 0; i < 20 && looping; i++) {
			result = await calculateMinibossResult(miniboss);
			if (!result.win) looping = false;
		}
		await sleep(200);
		expect(result.win).to.be.equal(false);

	});
	it("should lose with together and low rank and many helperIds with low rank", async ()=>{


		const testUser = await createTestUser({ world });
		const helper0 = await createTestUser({ world });
		const helper1 = await createTestUser({ world });

		const miniboss = createMinibossEvent(testUser);
		miniboss.helperIds.push(helper0.account.userId);
		miniboss.helperIds.push(helper1.account.userId);

		let looping = true;
		let result;
		for (let i = 0; i < 20 && looping; i++) {
			result = await calculateMinibossResult(miniboss);
			if (!result.win) looping = false;
		}
		await sleep(200);
		expect(result.win).to.be.equal(false);

	});
	it("should lose with helperIds who have low rank", async ()=>{


		const testUser = await createTestUser({ world });
		const helper0 = await createTestUser({ world });
		const helper1 = await createTestUser({ world });

		const miniboss = createMinibossEvent(testUser);
		miniboss.helperIds.push(helper0.account.userId);
		miniboss.helperIds.push(helper1.account.userId);

		let looping = true;
		let result;
		for (let i = 0; i < 20 && looping; i++) {
			result = await calculateMinibossResult(miniboss);
			if (!result.win) looping = false;
		}

		expect(result.win).to.be.equal(false);
	});

	it("should cause damage when losing", async ()=>{

		const hero = {

			currentHealth: 100,
			health:100,
			rank:-1,
			stats:{
				attack:1,
				defense:1,
			},
		};

		const testUser = await createTestUser({ world, hero });
		const miniboss = createMinibossEvent(testUser);


		const helper0 = await createTestUser({ hero });
		const helper1 = await createTestUser({ hero });
		const helper2 = await createTestUser({ hero });

		miniboss.helperIds.push(helper0.account.userId);
		miniboss.helperIds.push(helper1.account.userId);
		miniboss.helperIds.push(helper2.account.userId);

		const result = await calculateMinibossResult(miniboss);
		await sleep(200);
		expect(result.initiativeTaker.hero.currentHealth).to.not.equal(hero.currentHealth, result.initiativeTaker);
		result.helpers.forEach(helper=>{
			expect(helper.hero.currentHealth).to.not.equal(hero.currentHealth, helper);
		});
	});
});

