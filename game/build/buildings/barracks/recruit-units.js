const barracksUnits = require("./barracks-units");

const recruitUnits = (user, unit, amount) => {
	unit = barracksUnits[unit];

	const canBeRecuited = checkIfPossibleToRecruit(user, unit, amount);
	if(!canBeRecuited.response) return canBeRecuited.message;

	return canBeRecuited.message;
};

const checkIfPossibleToRecruit = (user, unit, amount) =>{
	// Is there any unit at all, or was it an invalid arg?
	if(!unit) return { response: false, message: "invalid unit name" };

	// Is barracks on sufficient level?
	console.log(unit);
	const { building:reqBuilding, level:reqLevel } = unit.requirement;
	if(!user.empire.find(building => building.name === reqBuilding && building.level >= reqLevel)) return { response: false, message: `Your barracks needs to be level ${reqLevel}` };

	// Check if you are population capped
	const currentPop = Object.values(Object.values(user.army.units)).reduce((accUnit, curUnit) => accUnit + curUnit);
	if(user.maxPop < currentPop + amount) return { response: false, message: `You need ${currentPop - user.maxPop} more population` };

	// Sufficient resources?
	for(const resource in unit.cost) {
		if(user.resources[resource] < unit.cost[resource] * amount) return { response: false, message: `You are missing ${user.resources[resource] - unit.cost[resource]} of ${resource}` };
	}

	return { response: true, message: "success" };
};

module.exports = recruitUnits;