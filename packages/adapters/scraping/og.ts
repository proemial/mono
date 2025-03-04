import { getLinkPreview } from "link-preview-js";

export const fetchOgDetails = async (url: string) => {
	let siteTitle: string | undefined = undefined;
	let imageUrl: string | undefined = undefined;
	try {
		const preview = await getLinkPreview(url, {
			followRedirects: "follow",
			imagesPropertyType: "og",
			headers: {
				"user-agent":
					"Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1",
				"Accept-Language": "en-US",
			},
			timeout: 1000,
		});

		if (preview.contentType === "text/html") {
			const { title, images } = preview as { title: string; images: string[] };
			siteTitle = title;
			imageUrl = images[0];
		}
	} catch (error) {
		console.error(`Error getting title and thumbnail: ${error}`);
	}
	return { title: siteTitle, imageUrl };
};
