import { NextResponse } from "next/server";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { ScrapedUrl } from "@proemial/adapters/mongodb/slack/scraped.types";
import { diffbot } from "./scrapers/diffbot";
import { puppeteerScraper } from "./scrapers/puppeteer";

export const revalidate = 0;

export async function POST(request: Request) {
	const { url } = (await request.json()) as { url: string };

	const existing = await SlackDb.scraped.get(url);

	if (existing) {
		return NextResponse.json(existing);
	}

	const content = await diffbot(url);
	const { openGraph, contentType } = await puppeteerScraper(url);
	const scrapedUrl = {
		url,
		content,
		openGraph,
		contentType,
		createdAt: new Date(),
	} as ScrapedUrl;

	await SlackDb.scraped.upsert(scrapedUrl);

	return NextResponse.json(scrapedUrl);
}
