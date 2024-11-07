export async function getColors(artworkUrl?: string): Promise<Colors> {
	if (artworkUrl) {
		try {
			const colorResult = await fetch(
				"https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCAUoYE05Mz6i52ooojtoD5oZk7P3YCK8w",
				{
					method: "POST",
					body: JSON.stringify({
						requests: [
							{
								features: [
									{
										maxResults: 10,
										type: "IMAGE_PROPERTIES",
									},
								],
								image: {
									source: {
										imageUri: artworkUrl,
									},
								},
							},
						],
					}),
				},
			);
			const json = (await colorResult.json()) as ColorResponse;
			const color = getNonBlackish(
				json.responses.at(0)?.imagePropertiesAnnotation?.dominantColors?.colors,
			);
			if (color) {
				const background = `#${color.red.toString(16).padStart(2, "0")}${color.green.toString(16).padStart(2, "0")}${color.blue.toString(16).padStart(2, "0")}`;
				const foreground =
					color.red * 0.299 + color.green * 0.587 + color.blue * 0.114 > 186
						? "#000000"
						: "#FFFFFF";
				return { background, foreground };
			}
		} catch (e) {
			console.error("[news][scrape] failed to get background color", e);
		}
	}
	return { background: undefined, foreground: undefined };
}

function getNonBlackish(colors?: { color: RGB }[]) {
	if (!colors) {
		console.log("NO COLORS FOUND");
		return randomColor();
	}

	for (const color of colors) {
		// Check if color is not too dark/black (using brightness threshold)
		if (color.color.red + color.color.green + color.color.blue > 100) {
			return color.color;
		}
	}

	console.log("NO NON-BLACKISH COLORS FOUND");
	return randomColor();
}

function randomColor() {
	// Generate random RGB values ensuring total brightness is above blackish threshold
	let red: number;
	let green: number;
	let blue: number;
	do {
		red = Math.floor(Math.random() * 256);
		green = Math.floor(Math.random() * 256);
		blue = Math.floor(Math.random() * 256);
	} while (red + green + blue <= 100);

	return { red, green, blue };
}

export type Colors = {
	background?: string;
	foreground?: string;
};

type ColorResponse = {
	responses: {
		imagePropertiesAnnotation: {
			dominantColors: {
				colors: { color: RGB }[];
			};
		};
	}[];
};

type RGB = {
	red: number;
	green: number;
	blue: number;
};
