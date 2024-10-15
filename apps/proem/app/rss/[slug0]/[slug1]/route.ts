import { summariseAbstract } from "@/app/prompts/summarise-abstract";
import { summarise as summariseTitle } from "@/app/prompts/summarise-title";
import { QdrantPapers } from "@proemial/adapters/qdrant/papers";
import { QdrantSearchHit } from "@proemial/adapters/qdrant/search/papers-search";
import { defaultVectorSpace } from "@proemial/adapters/qdrant/vector-spaces";
import { Redis } from "@proemial/adapters/redis";
import dayjs from "dayjs";
import { Feed } from "feed";
import { NextRequest } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug0: string; slug1: string } },
) {
	const { searchParams } = new URL(req.url);
	const format = searchParams.get("format") || "rss";

	const space = await Redis.spaces.get([params.slug0, params.slug1]);
	const response = await QdrantPapers.search(
		defaultVectorSpace.collection,
		[space?.vectors.like, space?.vectors.unlike].filter(
			(v) => !!v,
		) as number[][],
		space?.query.period,
	);
	const results = await Promise.all(
		(response.papers ?? []).map(
			async (p) => await mapToResult(p as QdrantSearchHit),
		),
	);

	const feed = new Feed({
		title: space?.metadata.title ?? "Proem",
		description: space?.metadata.description ?? "Proem",
		id: req.url,
		link: req.url,
		image: "https://proem.ai/proem.png",
		favicon: "https://proem.ai/favicon.ico",
		copyright: "All rights reserved 2024, proem.ai",
		generator: "proem.ai",
		feedLinks: {
			json: req.url,
			atom: `${req.url}?format=atom`,
		},
		author: {
			name: space?.metadata.author?.name,
			email: space?.metadata.author?.email,
		},
	});

	results.forEach((paper) => {
		console.log(paper.title);
		feed.addItem({
			title: paper.title,
			id: paper.url,
			link: paper.url,
			description: paper.description,
			author: paper.author,
			date: paper.date,
		});
	});

	return new Response(format === "rss" ? feed.rss2() : feed.atom1(), {
		headers: { "Content-Type": "text/xml" },
	});
}

async function mapToResult(hit: QdrantSearchHit) {
	const title = await summariseTitle(
		hit.paper.title as string,
		hit.paper.abstract as string,
	);
	const description = await summariseAbstract(
		hit.paper.title as string,
		hit.paper.abstract as string,
	);
	return {
		title,
		description,
		url: `https://proem.ai/paper/oa/${hit.paper.id.split("/").pop()}`,
		date: dayjs(hit.paper.created_date).toDate(),
		author: hit.paper.authorships.map((a) => ({
			name: a.author.display_name,
		})),
	};
}
