import puppeteer, { HTTPResponse } from "puppeteer";

export const puppeteerScraper = async (url: string) => {
	const output = {} as Record<string, unknown>;

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// Listen for responses and log MIME types
	page.on("response", async (response: HTTPResponse) => {
		if (response.url() === url) {
			const headers = response.headers();
			// console.log("All headers:", headers); // Debug log
			const contentType =
				headers["content-type"] ||
				headers["Content-Type"] ||
				headers["Content-type"] ||
				"";
			output.contentType = contentType;
		}
	});

	await page.goto(url, { waitUntil: "networkidle2" });

	const ogData = await page.evaluate(() => {
		const getMetaContent = (property: string) => {
			const meta = document.querySelector(`meta[property="${property}"]`);
			return meta?.getAttribute("content") || "";
		};

		return {
			title: getMetaContent("og:title"),
			description: getMetaContent("og:description"),
			image: getMetaContent("og:image"),
		};
	});
	output.openGraph = ogData;

	await browser.close();

	return output;
};
