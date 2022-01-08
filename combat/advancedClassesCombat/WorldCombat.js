/* eslint-disable no-inline-comments */
const CombatWrapper = require("./CombatWrapper");
const { worldLocations } = require("../../game/_UNIVERSE");
const { getIcon } = require("../../game/_CONSTS/icons");

const { userIsOnCooldown } = require("../../game/_CONSTS/cooldowns");

class WorldCombat extends CombatWrapper {
  constructor(data) {
    super({...data });
    this.place = data.place = "";
    this.worldIcon = getIcon(this.user.world.currentLocation);
    this.placeInfo = this.getPlaceInfo();
    this.actionIcon = getIcon(this.nameOfClass);
    this.setupWorldCombat();
    this.rewards = this.calculateRewards()
  }

  setupWorldCombat() {
    this.checkWorldCombatAllowed();
  }
  calculateRewards() {
    if (!this.placeInfo) return; 
    return this.placeInfo.rewards
  }
  checkWorldCombatAllowed() {
    // todo, cooldown
    // cooldown
    if (!this.placeInfo) {
      return this.errorHandler("Missing placeinfo");
    }

    if (userIsOnCooldown(this.nameOfClass, this.user)) {
      return this.errorHandler("You are on cooldown");
    }
  }

  getPlaceInfo() {
    const { currentLocation } = this.user.world;
    const placesInCurrentWorld = worldLocations[currentLocation].places;
    const userExploredPlaces =
      this.user.world.locations[currentLocation].explored;

    const userExploredActionPlaces = userExploredPlaces
      .filter((p) => placesInCurrentWorld[p].type === this.nameOfClass)
      .map((p) => p.replace(/\s/g, "").toLowerCase());

    // user has not found any place to explore
    if (!userExploredActionPlaces.length) {
      return this.errorHandler(
        `You have not explored any place to ${this.nameOfClass} in ${this.worldIcon} ${currentLocation}, try \`!explore\` to find a place to ${this.nameOfClass}`
      );
    }

    const notActionPlaces = Object.keys(placesInCurrentWorld)
      .filter((p) => placesInCurrentWorld[p].type !== this.nameOfClass)
      .map((p) => placesInCurrentWorld[p])
      .map((p) => this.#formatName(p.name));

    // if user tries to perform an action on a wrong place
    if (notActionPlaces.includes(this.#formatName(this.place))) {
      return this.errorHandler(`This is not a ${this.nameOfClass}`);
    }

    const listOfActionPlaces = Object.values(placesInCurrentWorld).filter((p) =>
      userExploredActionPlaces.includes(this.#formatName(p.name))
    );
    return this.place
      ? listOfActionPlaces.find((p) => this.#formatName(p.name) === this.place)
      : listOfActionPlaces[
          Math.floor(Math.random() * listOfActionPlaces.length)
        ];
  }

  questHandler() {
    // temp. remove when new quest have arrived.
    if (this.currentLocation !== "Grassy Plains") {
      return;
    }

    // Does the user have a quest here
    const currentQuest = this.user.quests.find((q) => {
      if (q.pve) {
        return (
          q.pve.find(
            (action) => action.name === this.placeInfo.name && !action.completed
          ) && q.started
        );
      }
    });
    console.log({ currentQuest });

    if (currentQuest) {
      // Update the objective in the users' quest
      let objectiveFound = false;
      let unique = false;
      currentQuest.pve = currentQuest.pve.map((pve) => {
        // Does this math.random actually work?
        if (pve.chance > Math.random()) {
          objectiveFound = true;
          pve.completed = true;

          // If you can only do the fight once
          unique = !!pve.unique;
        }
        return pve;
      });

      if (unique) {
        this.user.removeExploredArea(currentLocation, place);
      }

      // Find the quest in the quest object
      let questObj;
      currentQuest.questKeySequence.forEach((questKey) => {
        questObj = questObj ? questObj[questKey] : allQuests[questKey];
      });
      if (objectiveFound) {
        this.user.updateQuestObjective(currentQuest);
        if (questObj.foundNewQuest) questObj.foundNewQuest(this.user);
        return questObj.found;
      }
      return questObj.notFound;
    }

    // GETTING A NEW QUEST
    // Is there a quest for the location, and has it been started/found already?
    const quest = Object.values(allQuests[currentLocation]).find(
      (q) =>
        q.obtaining &&
        q.obtaining.area === place &&
        !this.user.completedQuests.includes(q.name) &&
        !this.user.quests.find((startedQuests) => startedQuests.name === q.name)
    );

    // If no quest or low luck, return
    const obtainNumber = Math.random();
    if (!quest || obtainNumber > quest.obtaining.chance) return;

    // Add the new quest to the user
    const newQuest = {
      name: quest.name,
      started: false,
      questKeySequence: quest.questKeySequence,
      pve: quest.pve,
    };

    this.user.addNewQuest(newQuest);

    this.messageAPI.queueMessage({
      name: `${getIcon("quest")}Quest${getIcon("quest")}`,
      value: quest.intro,
    });
  }

  // removes spaces and returns lowercased string
  #formatName = (name) => name.replace(/\s/g, "").toLowerCase();
}

module.exports = WorldCombat;
