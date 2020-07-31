const allQuests = require("./all-quests");

const checkRaidAndHuntQuest = async (user, place, currentLocation) => {
	// temp. remove when new quest have arrived.
	if (currentLocation !== "Grassy Plains") {
		return;
	}
	// Does the user have a quest here
	const currentQuest = user.quests.find(q => q.pve ? q.pve.find(raid => raid.name === place && !raid.completed) && q.started : false);

	if(currentQuest) {
		// Update the objective in the users' quest
		let objectiveFound = false;
		let unique = false;
		currentQuest.pve = currentQuest.pve.map(pve => {
			// Does this math.random actually work?
			if(pve.chance > Math.random()) {
				objectiveFound = true;
				pve.completed = true;

				// If you can only do the fight once
				if(pve.unique) unique = true;
			}
			return pve;
		});

		if(unique) await user.removeExploredArea(currentLocation, place);

		// Find the quest in the quest object
		// const questObj = Object.values(allQuests[currentLocation]).find(q => q.name === currentQuest.name);

		let questObj;
		currentQuest.questKeySequence.forEach(questKey => {
			questObj = questObj ? questObj[questKey] : allQuests[questKey];
		});

		if(objectiveFound) {
			await user.updateQuestObjective(currentQuest);

			if(questObj.foundNewQuest) await questObj.foundNewQuest(user);

			return questObj.found;
		}
		else {
			return questObj.notFound;
		}
	}

	// GETTING A NEW QUEST
	// Is there a quest for the location, and has it been started/found already?
	const quest = Object.values(allQuests[currentLocation]).find(q => q.obtaining && q.obtaining.area === place && !user.completedQuests.includes(q.name) && !user.quests.find(startedQuests => startedQuests.name === q.name));

	if(!quest) return;

	// Are you able to obtain the quest
	const obtainNumber = Math.random();
	if(obtainNumber > quest.obtaining.chance) return;

	// Add the new quest to the user
	const newQuest = {
		name: quest.name,
		started: false,
		questKeySequence: quest.questKeySequence,
		pve: quest.pve,
	};

	user.addNewQuest(newQuest);

	await user.save();

	return quest.intro;
};

const checkBuildQuests = async (user, building) => {
	// GETTING A NEW QUEST
	// Is there a quest for the location, and has it been started/found already?
	const quest = Object.values(allQuests["Building Quests"]).find(q => q.requirement && q.requirement.building === building.name && q.requirement.level === building.level && !user.completedQuests.includes(q.name) && !user.quests.find(startedQuests => startedQuests.name === q.name));

	if(!quest) return false;

	// Add the new quest to the user
	const newQuest = {
		name: quest.name,
		started: false,
		questKeySequence: quest.questKeySequence,
		pve: quest.pve,
	};

	user.addNewQuest(newQuest);

	await user.save();

	return quest.intro;
};

module.exports = { checkQuest: checkRaidAndHuntQuest, checkBuildQuests };