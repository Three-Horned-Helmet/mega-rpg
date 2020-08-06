const Discord = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");

const createGridCanvas = async (user) => {
	const canvas = Canvas.createCanvas(700, 700);
	const ctx = canvas.getContext("2d");

	// Load grid
	const gridSize = Math.ceil(Math.sqrt(user.maxBuildings));
	let background;
	try{
		// check if file exists
		const backgroundUrl = `./assets/building-images/grid-${gridSize}x${gridSize}.jpg`;
		if (fs.existsSync(backgroundUrl)) {
			background = await Canvas.loadImage(backgroundUrl);
		}
		else {
			background = await Canvas.loadImage("./assets/building-images/grid-3x3.jpg");
		}
	}
	catch (err) {
		console.error(`Background Image does not exist. gridsize is: ${gridSize}`, err);
	}

	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Wait for Canvas to load the image
	const buildingImages = user.empire.map(building => {
		const { name, level } = building;
		return new Promise((resolve) => {
			// Add reject error handling pl0x
			try{
				// check if file exists
				const imgUrl = `./assets/building-images/${name.replace(" ", "-")}-level-${level}.png`;
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
				console.error(`Image does not exist, ${building}`, err);
			}
		});
	});

	const images = await Promise.all(buildingImages);

	// Draw images onto the main canvas
	for(let i = 0; i < images.length; i++) {
		const { width } = canvas;
		const { name, level, position } = user.empire[i];
		ctx.drawImage(
			images[i],
			(width * 0.02 + ((width / gridSize) * position[0])),
			(width * 0.05 + ((width / gridSize) * position[1])),
			(width / gridSize) - 20,
			(width / (gridSize + gridSize / 6)) - 20,
		);

		// Add building name
		ctx.font = "24px sans-serif";
		ctx.fillStyle = "#000000";

		ctx.fillText(
			`${name[0].toUpperCase() + name.slice(1)}(${level})`,
			(((width / 6) - (name.length + 3) * 2 * gridSize) + ((width / gridSize) * position[0])),
			(width * 0.04 + ((width / gridSize) * position[1])),
		);
	}

	// Use helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer());

	return attachment;
};

module.exports = createGridCanvas;