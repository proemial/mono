import { getSummaries } from "@proemial/adapters/llm/cache/summaries";
import { QdrantPapers } from "@proemial/adapters/qdrant/papers";
import { QdrantSearchHit } from "@proemial/adapters/qdrant/search/papers-search";
import { defaultVectorSpace } from "@proemial/adapters/qdrant/vector-spaces";
import { Redis } from "@proemial/adapters/redis";
import { findCollectionBySlugs } from "@proemial/data/repository/collection";
import dayjs from "dayjs";
import { Feed } from "feed";

export async function rssFeed(url: string, slug0: string, slug1: string) {
	const space = await Redis.spaces.get([slug0, slug1]);
	const baseUrl = await getBaseUrl(url, slug0, slug1);

	const response = await QdrantPapers.search(
		defaultVectorSpace.collection,
		[space?.vectors.like, space?.vectors.unlike].filter(
			(v) => !!v,
		) as number[][],
		space?.query.period,
		space?.runtime.quantization,
	);
	const results = await Promise.all(
		(response.papers ?? []).map(
			async (p) => await mapToResult(p as QdrantSearchHit, baseUrl),
		),
	);

	const feed = new Feed({
		title: space?.metadata.title ?? "",
		description: space?.metadata.description ?? "",
		id: url,
		link: url,
		image: "https://proem.ai/proem.png",
		favicon: "https://proem.ai/favicon.ico",
		copyright: "All rights reserved 2024, proem.ai",
		generator: "proem.ai",
		feedLinks: {
			rss: `https://proem.ai/feed/rss/${slug0}/${slug1}`,
			atom: `https://proem.ai/feed/atom/${slug0}/${slug1}`,
		},
		author: {
			name: space?.metadata.author?.name,
			email: space?.metadata.author?.email,
		},
	});

	results.forEach((paper) => {
		feed.addItem({
			title: paper.title,
			id: paper.url,
			link: paper.url,
			description: paper.description,
			author: paper.author,
			date: paper.date,
		});
	});

	return feed;
}

async function mapToResult(hit: QdrantSearchHit, baseUrl: string) {
	const summaries = await getSummaries(
		hit.paper.id,
		hit.paper.title,
		hit.paper.abstract ?? "",
	);

	return {
		title: summaries.title?.summary as string,
		description: summaries.description?.summary as string,
		url: `${baseUrl}/paper/oa/${hit.paper.id.split("/").pop()}`,
		date: dayjs(hit.paper.created_date).toDate(),
		author: hit.paper.authorships.map((a) => ({
			name: a.author.display_name,
		})),
	};
}

async function getBaseUrl(url: string, slug0: string, slug1: string) {
	const collection = (await findCollectionBySlugs(slug0, slug1))?.id;
	const baseUrl = url.split("/").slice(0, 3).join("/");

	if (!collection) {
		return baseUrl;
	}
	return `${baseUrl}/space/${collection}`;
}
