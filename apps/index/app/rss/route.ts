import { NextRequest } from "next/server";
import { generateEmbedding } from "../../data/db/embeddings";
import { VectorSpace, vectorSpaces } from "../../data/db/vector-spaces";
import {
	summariseAbstract,
	summariseTitle,
} from "../../inngest/helpers/summarise";
import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { QdrantClient } from "@qdrant/js-client-rest";
import dayjs from "dayjs";
import { Feed } from "feed";

// GPT-4o prompt: Summarise the following into a title and a description: A feed of papers about $like, excluding topics like $unlike.
const feed = new Feed({
	title:
		"Advanced Prompt Engineering for Optimizing RAG Language Models in Multi-Modal Data Processing",
	description:
		"Stay updated with the latest research papers on advanced techniques in prompt engineering for enhancing the performance of Retrieval-Augmented Generation (RAG) language models (LLMs). This feed focuses on applications in multi-modal data processing and analysis, excluding topics such as security flaws, agriculture, healthcare, and radiology.",
	id: "https://beta.proem.ai/rss?like=Advanced%20prompt%20engineering%20techniques%20for%20optimizing%20Retrieval-Augmented%20Generation%20%28RAG%29%20Language%20Models%20%28LLMs%29%20in%20multi-modal%20data%20processing%20and%20analysis&unlke=security%20flaws%20agriculture%20healthcare%20radiology%20survey",
	link: "https://beta.proem.ai/rss?like=Advanced%20prompt%20engineering%20techniques%20for%20optimizing%20Retrieval-Augmented%20Generation%20%28RAG%29%20Language%20Models%20%28LLMs%29%20in%20multi-modal%20data%20processing%20and%20analysis&unlke=security%20flaws%20agriculture%20healthcare%20radiology%20survey",
	image: "https://beta.proem.ai/proem.png",
	favicon: "https://beta.proem.ai/favicon.ico",
	copyright: "All rights reserved 2013, John Doe",
	generator: "proem",
	feedLinks: {
		json: "https://beta.proem.ai/rss?like=Advanced%20prompt%20engineering%20techniques%20for%20optimizing%20Retrieval-Augmented%20Generation%20%28RAG%29%20Language%20Models%20%28LLMs%29%20in%20multi-modal%20data%20processing%20and%20analysis&unlke=security%20flaws%20agriculture%20healthcare%20radiology%20survey",
		atom: "https://beta.proem.ai/rss?format=atom&like=Advanced%20prompt%20engineering%20techniques%20for%20optimizing%20Retrieval-Augmented%20Generation%20%28RAG%29%20Language%20Models%20%28LLMs%29%20in%20multi-modal%20data%20processing%20and%20analysis&unlke=security%20flaws%20agriculture%20healthcare%20radiology%20survey",
	},
	author: {
		name: "proem",
		email: "hi@proem.ai",
		link: "https://beta.proem.ai/rss",
	},
});

// export const revalidate = 0;

// like=Advanced%20prompt%20engineering%20techniques%20for%20optimizing%20Retrieval-Augmented%20Generation%20%28RAG%29%20Language%20Models%20%28LLMs%29%20in%20multi-modal%20data%20processing%20and%20analysis
// unlke=security%20flaws%20agriculture%20healthcare%20radiology%20survey
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const format = searchParams.get("format") || "rss";
	const like = searchParams.get("like");
	const unlike = searchParams.get("unlike");
	console.log("like", like);
	console.log("unlike", unlike);

	if (!like) {
		return undefined;
	}

	const client = new QdrantClient({
		url: process.env.QDRANT_URL,
		apiKey: process.env.QDRANT_API_KEY,
	});

	const { dimensions, collection } = vectorSpaces["1.5k"] as VectorSpace;
	const embeddings = await generateEmbedding(
		[like, unlike as string],
		dimensions,
	);
	const filter = createFilter(
		10,
		dayjs().subtract(1, "week").format("YYYY-MM-DD"),
	);

	if (unlike) {
		console.log(
			"recommend",
			collection,
			filter,
			embeddings.at(0)?.length,
			embeddings.at(1)?.length,
		);
		const response = await client.recommend(collection, {
			...filter,
			positive: [embeddings.at(0) as number[]],
			negative: [embeddings.at(1) as number[]],
		});
		console.log("response", response.length);

		const results = await Promise.all(
			response.map(
				async (p) => await mapToResult(p.payload as OpenAlexPaperWithAbstract),
			),
		);

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

	console.log("search", collection, filter, embeddings.at(0)?.length);
	const response = await client.search(collection, {
		...filter,
		vector: embeddings.at(0) as number[],
	});
	console.log("response", response.length);

	const results = await Promise.all(
		response.map(
			async (p) => await mapToResult(p.payload as OpenAlexPaperWithAbstract),
		),
	);

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

	// feed.addCategory("Technologie");

	return new Response(format === "rss" ? feed.rss2() : feed.atom1(), {
		headers: { "Content-Type": "text/xml" },
	});
}

async function mapToResult(payload: OpenAlexPaperWithAbstract) {
	const title = await summariseTitle(
		payload.title as string,
		payload.abstract as string,
	);
	const description = await summariseAbstract(
		payload.title as string,
		payload.abstract as string,
	);
	return {
		title,
		description,
		url: `https://proem.ai/paper/oa/${payload.id.split("/").pop()}`,
		date: dayjs(payload.created_date).toDate(),
		author: payload.authorships.map((a) => ({
			name: a.author.display_name,
		})),
	};
}

function createFilter(limit: number, from: string) {
	return {
		limit,
		filter: {
			must: {
				key: "created_date",
				range: {
					gte: from,
				},
			},
		},
	};
}
