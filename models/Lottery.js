require("dotenv").config();

const mongoose = require("mongoose");

if (process.env.NODE_ENV === "test") {
	mongoose.connect(process.env.TEST_MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
}
else {
	mongoose.connect(process.env.MONGODB_URI, { poolSize: 100, useUnifiedTopology: true, useNewUrlParser: true });
}

const { Schema } = mongoose;

const lotterySchema = new Schema({
	previousWinner: {
		username: String,
		userId: String,
		prize: String
	},
	prizePool: {
		gold: Number,
		Carrot: Number,
	},
	currentContestors: [Object],
	nextDrawing: Date,

}, {
	timestamps: {
		createdAt: "createdAt",
		updatedAt: "updatedAt",
	},
});


lotterySchema.methods.addContestor = function(username, userId, ticketAmount, ticketPrize) {
	const contestor = this.currentContestors.find(c=> c.userId === userId);
	if (!contestor) {
		this.currentContestors.push({
			ticketAmount,
			userId,
			username
		});
	}
	else {
		const contestorIndex = this.currentContestors.indexOf(contestor);
		this.currentContestors[contestorIndex].ticketAmount += ticketAmount;
		this.markModified(`currentContestors.${contestorIndex}.ticketAmount`);
	}

	const prizeGain = ticketAmount * ticketPrize;
	this.prizePool.gold += prizeGain;
};

lotterySchema.methods.determineWinner = function() {
	if (!this.currentContestors || this.currentContestors.length === 0) {
		return;
	}
	const chanceArray = [];
	for (const contestor of this.currentContestors) {
		for (let i = 0; i < contestor.ticketAmount; i += 1) {
			chanceArray.push(contestor);
		}
	}
	const winnerId = chanceArray[Math.floor(Math.random() * chanceArray.length)];
	this.previousWinner = {
		username: winnerId.username,
		userId: winnerId.userId,
	};

	return this.save();

};


module.exports = mongoose.model("Lottery", lotterySchema);