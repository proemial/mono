import {
	NewsAnnotatorScrapeInputStep,
	NewsAnnotatorScrapeStep,
} from "@proemial/adapters/redis/news";

import { Redis } from "@proemial/adapters/redis";
import { NewsAnnotatorInitInputStep } from "@proemial/adapters/redis/news";
import { Colors } from "./color";
import dayjs from "dayjs";

export async function updateRedis(
	url: string,
	{ transcript, artworkUrl, title, date }: NewsAnnotatorScrapeStep,
	{ background, foreground }: Colors,
) {
	try {
		const { hostname } = new URL(url);

		await Redis.news.set(url, {
			url,
			name: "init",
			host: hostname.replace(/^[^.]+\./, ""), // remove subdomain
			logo: `https://${hostname}.com/favicon.ico`,
			background,
			foreground,
			createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		} as NewsAnnotatorInitInputStep);

		const result = await Redis.news.update(url, {
			name: "scrape",
			transcript,
			artworkUrl,
			title,
			date,
		} as NewsAnnotatorScrapeInputStep);

		return result;
	} catch (e) {
		console.error("[news][scrape] failed to update redis", e);
		throw new Error("[news][scrape] failed to update redis", {
			cause: {
				url,
				error: e,
			},
		});
	}
}
