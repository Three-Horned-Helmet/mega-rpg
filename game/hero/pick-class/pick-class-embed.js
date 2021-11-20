const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");
const startingClasses = require("../accessible-classes.json").startingClasses

const createGridCanvas = async () => {
	const EXTRA_CANVAS_Y_SIZE = 130// 60

	const canvas = Canvas.createCanvas(700, 700 + EXTRA_CANVAS_Y_SIZE);
	const ctx = canvas.getContext("2d");

	const gridSize = Math.ceil(Math.sqrt(startingClasses.length));

	ctx.font = "bold 40px sans-serif";
	ctx.fillStyle = "#FFFFFF";

	ctx.fillText(
		`Pick a class`, 230, 40
	);

	ctx.font = "28px sans-serif";
	ctx.fillStyle = "#FFFFFF";

	ctx.fillText(
		`To pick a class type: !pick <className>`, 120, 70
	);
	ctx.fillText(
		`For more info type: !hero describe <className>`, 60, 100
	);

	// Wait for Canvas to load the image
	const classImages = startingClasses.map(startingClass => {
		return new Promise((resolve) => {
			// Add reject error handling pl0x
			try{
				// check if file exists
				const imgUrl = `./assets/classes/full-image/${startingClass.toLowerCase()}.png`;
				if (fs.existsSync(imgUrl)) {
					return resolve(
						Canvas.loadImage(imgUrl),
					);
				}
				else {
					return resolve(
						Canvas.loadImage("./assets/no-image.png"),
					);
				}
			}
			catch (err) {
				console.error(`Image does not exist, ${startingClass}`, err);
			}
		});
	});

	const images = await Promise.all(classImages);

	ctx.font = "36px sans-serif";
	ctx.fillStyle = "#FFFFFF";

	// Draw images onto the main canvas
	for(let i = 0; i < images.length; i++) {
		const { width } = canvas;
		const xPos = Math.floor(i % gridSize)
		const yPos = Math.floor(i / gridSize)
		ctx.drawImage(
			images[i],
			(width * 0.02 + ((width / gridSize) * xPos)),
			(width * 0.05 + ((width / gridSize) * yPos)) + EXTRA_CANVAS_Y_SIZE,
			(width / gridSize) - 20,
			(width / (gridSize + gridSize / 6)) - 20,
		);

		const className = startingClasses[i]
		ctx.fillText(
			`${className[0].toUpperCase() + className.slice(1)}`,
			(((width / 6) - (className.length + 3) * 2 * gridSize) + ((width / gridSize) * xPos) + 30),
			(width * 0.04 + ((width / gridSize) * yPos) + EXTRA_CANVAS_Y_SIZE),
		);
	}

	// Use helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer());

	return attachment;
};

const successfullyPickedClassEmbed = (className) => {
	return `Congratulations! You have successfully picked the class **${className}**!`
}

const somethingWentWrongEmbed = () => {
	return `Something went wrong while picking a class. Please try again.`
}

module.exports = { createGridCanvas, successfullyPickedClassEmbed, somethingWentWrongEmbed };