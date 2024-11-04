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
			const color = json.responses
				.at(0)
				?.imagePropertiesAnnotation.dominantColors.colors.at(0)?.color;
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

export type Colors = {
	background?: string;
	foreground?: string;
};

type ColorResponse = {
	responses: {
		imagePropertiesAnnotation: {
			dominantColors: {
				colors: { color: { red: number; green: number; blue: number } }[];
			};
		};
	}[];
};
