const destroyHandler = async (user, arg) => {
	const { response, message, building } = checkIfDestroyIsPossible(user, arg);
	if (!response) return message;

	const { name, level, position } = building;

	// Remove the building from the database
	try {
		user.destroyBuilding(building);
	}
	catch {
		console.error(
			`${user.account.username} was not able to destroy building ${name} (level: ${level}), at the position ${position[0]}.${position[1]}. The arg: "${arg}" was used`
		);

		return "Something went wrong and you were not able to destroy the building successfully. Please report the bug and it will be fixed at the speed of light!";
	}

	await user.save();

	return `You successfully destroyed ${name} (level: ${level}) at the coordinates ${position[0]}.${position[1]}`;
};

const checkIfDestroyIsPossible = (user, arg) => {
	// Check if the user has the building with the specified coordinates or name
	const building = arg.match(/\d+\.\d+/)
		? user.empire.find(
			(b) =>
				b.position[0] === parseInt(arg.split(".")[0]) &&
          b.position[1] === parseInt(arg.split(".")[1])
		)
		: user.empire
			.filter((b) => {
				return b.name.toLowerCase() === arg;
			})
			.sort((a, b) => a.level - b.level)[0];

	if (!building) {
		return {
			response: false,
			message: `There are no buildings with the coordinates or name '${arg.toString()}' in your empire.`,
		};
	}

	return {
		response: true,
		building,
	};
};

module.exports = { destroyHandler, checkIfDestroyIsPossible };
