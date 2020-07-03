/* eslint-disable no-undef */

const { expect } = require("chai");
const User = require("../../models/User");
const minibossCommand = require("../../commands/miniboss");
const { createTestUser } = require("../helper");

const { minibossStartAllowed, createMinibossEvent, calculateMinibossResult } = require("../../game/miniboss");


describe("miniboss command", () => {
	beforeEach("beforeEach, cleaning db", async ()=>{
		await User.deleteMany();
	});
	it("should exist", () => {
		expect(minibossCommand).to.not.equal(undefined);
	});
	it("should run into cooldown if triggered too fast", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};
		const now = new Date();
		const testUser = await createTestUser({ world });
		await testUser.setNewCooldown("miniboss", now);
		const result = await minibossStartAllowed(testUser);
		expect(result.fields[0].name.startsWith("You can't use this command. Cooldown is")).to.be.equal(true);
	});


	it("should not be able to trigger if not explored", async ()=>{
		const testUser = await createTestUser();
		const result = await minibossStartAllowed(testUser);
		expect(result.startsWith("You haven't found any miniboss in")).to.be.equal(true);
	});
	it("should not be triggered if hp too low", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};
		const hero = {
			currentHealth : 1,
			health:100,
		};
		const testUser = await createTestUser({ world, hero });
		const result = await minibossStartAllowed(testUser);
		expect(result.startsWith("Your hero's health is too low")).to.be.equal(true);

	});
	it("should succeed when initativetaker has higher rank than helper", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};
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
		miniboss.helpers.push(helper0.account.userId);
		const result = await calculateMinibossResult(miniboss);
		// cleanup todo: why doesn't the function clean itself?

		expect(result.win).to.be.equal(true);

	});

	it("should be rewarded with gold, dungeonkey, xp (and level up) win", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};
		const hero = {
			rank:3,
			currentExp: 99.99,
			expToNextRank: 100,
			stats:{
				attack:1,
				defense:1,
			},
			dungeonKeys:{
				["Ogre tooth"]: 0,
			},
		};

		const testUser = await createTestUser({ world, hero });
		const miniboss = createMinibossEvent(testUser);


		const helper0 = await createTestUser({ hero });
		const helper1 = await createTestUser({ hero });
		const helper2 = await createTestUser({ hero });

		miniboss.helpers.push(helper0.account.userId);
		miniboss.helpers.push(helper1.account.userId);
		miniboss.helpers.push(helper2.account.userId);

		const result = await calculateMinibossResult(miniboss);


		expect(result.initiativeTaker.resources.gold > 100).to.be.equal(true);
		expect(result.initiativeTaker.hero.health > 100).to.be.equal(true);
		expect(result.initiativeTaker.hero.attack > 1).to.be.equal(true);
		expect(result.initiativeTaker.hero.currentExp > 100).to.be.equal(true);
		expect(result.initiativeTaker.hero.rank).to.be.equal(4);
		expect(result.initiativeTaker.hero.dungeonKeys["Ogre tooth"]).to.be.equal(1);


		result.helpers.forEach(h=>{
		expect(h.resources.gold > 100).to.be.equal(true);
		expect(h.hero.health > 100).to.be.equal(true);
		expect(h.hero.attack > 1).to.be.equal(true);
		expect(h.hero.currentExp > 100).to.be.equal(true);
		expect(h.hero.rank).to.be.equal(4);
		expect(h.hero.dungeonKeys["Ogre tooth"]).to.be.equal(0);
		});
	});

	it("should succeed together with low rank and  helpers with high rank", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};

		const testUser = await createTestUser({ world, hero:{ rank:1 } });
		const miniboss = createMinibossEvent(testUser);

		const helper0 = await createTestUser({ world, hero:{ rank:5 } });
		const helper1 = await createTestUser({ world, hero:{ rank:5 } });

		miniboss.helpers.push(helper0.account.userId);
		miniboss.helpers.push(helper1.account.userId);

		const result = await calculateMinibossResult(miniboss);
		expect(result.win).to.be.equal(true);

	});

	it("should lose with solo and low rank", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};

		const testUser = await createTestUser({ world });
		const miniboss = createMinibossEvent(testUser);

		const result = await calculateMinibossResult(miniboss);
		expect(result.win).to.be.equal(false);

	});
	it("should lose with together and low rank and many helpers with low rank", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};

		const testUser = await createTestUser({ world });
		const helper0 = await createTestUser({ world });
		const helper1 = await createTestUser({ world });

		const miniboss = createMinibossEvent(testUser);
		miniboss.helpers.push(helper0.account.userId);
		miniboss.helpers.push(helper1.account.userId);

		const result = await calculateMinibossResult(miniboss);
		expect(result.win).to.be.equal(false);

	});
	it("should lose with helpers who have low rank", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};

		const testUser = await createTestUser({ world });
		const helper0 = await createTestUser({ world });
		const helper1 = await createTestUser({ world });

		const miniboss = createMinibossEvent(testUser);
		miniboss.helpers.push(helper0.account.userId);
		miniboss.helpers.push(helper1.account.userId);

		const result = await calculateMinibossResult(miniboss);
		expect(result.win).to.be.equal(false);
	});

	it("should cause damage when losing", async ()=>{
		const world = {
			currentLocation:"Grassy Plains",
			locations:{
				"Grassy Plains":{
					available:true,
					explored:["C'Thun"] },
			},
		};
		const hero = {

			currentHealth: 100,
			health:100,
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

		miniboss.helpers.push(helper0.account.userId);
		miniboss.helpers.push(helper1.account.userId);
		miniboss.helpers.push(helper2.account.userId);

		const result = await calculateMinibossResult(miniboss);

		expect(result.initiativeTaker.hero.currentHealth < hero.currentHealth).to.be.equal(true);
		result.helpers.forEach(h=>{
			expect(h.hero.currentHealth < hero.currentHealth).to.be.equal(true);
		});
	});
});

