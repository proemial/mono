"use server";

import Parser from "rss-parser";
import { fetchArxivPaper } from "../paper/arxiv/[id]/fetch-arxiv-paper";
import { OpenAlexPaper } from "@proemial/models/open-alex";

export async function fetchRssItems(url: string) {
	const parser = new Parser();
	const rssResponse = await parser.parseURL(url);

	const papers = [] as OpenAlexPaper[];
	for (const id of rssResponse.items
		.slice(0, 20)
		.map((item) => item.id as string)) {
		const paper = await fetchArxivPaper(id.substring(id.lastIndexOf(":") + 1));
		if (paper) {
			papers.push(paper);
		}
	}

	return papers;
}
