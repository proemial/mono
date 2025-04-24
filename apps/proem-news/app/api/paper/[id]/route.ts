import { summariseDescription as summariseDescriptionWorker } from "@proemial/adapters/llm/prompts/description";
import { summariseTitle as summariseTitleWorker } from "@proemial/adapters/llm/prompts/microtitle";
import {
	oaBaseArgs,
	oaBaseUrl,
	openAlexFields,
	OpenAlexPaperWithAbstract,
	OpenAlexWorkMetadata,
} from "./oa-paper";
import { fromInvertedIndex } from "@proemial/utils/string";
import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";
import { RedisPaperState } from "./redis";

export type AnnotatedPaper = {
	paper: OpenAlexPaperWithAbstract;
	generated?: {
		title?: string;
		description?: string;
	};
};

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	if (!id) {
		return new Response("Missing id", { status: 400 });
	}

	let state = await RedisPaperState.get(id);
	const done = () => RedisPaperState.isDone(state);

	if (!state.completed.includes("fetch")) {
		const result = {
			paper: await fetchPaper(id),
		} as AnnotatedPaper;
		state = await RedisPaperState.update(id, {
			completed: [...state.completed, "fetch"],
		});

		return new Response(JSON.stringify(result), {
			headers: { "Content-Type": "application/json" },
			status: done() ? 200 : 202,
		});
	}

	// Get from cache (with fallback)
	const paper = await fetchPaper(id);

	if (paper && !state.completed.includes("title")) {
		const result = {
			paper,
			generated: {
				title: await summariseTitle(
					id,
					paper.title as string,
					paper.abstract as string,
				),
			},
		} as AnnotatedPaper;
		state = await RedisPaperState.update(id, {
			completed: [...state.completed, "title"],
		});

		return new Response(JSON.stringify(result), {
			headers: { "Content-Type": "application/json" },
			status: done() ? 200 : 202,
		});
	}

	// Get from cache (with fallback)
	const title = await summariseTitle(
		id,
		paper?.title as string,
		paper?.abstract as string,
	);

	if (paper && !state.completed.includes("description")) {
		const result = {
			paper,
			generated: {
				title,
				description: await summariseDescription(
					id,
					paper.title as string,
					paper.abstract as string,
				),
			},
		} as AnnotatedPaper;
		state = await RedisPaperState.update(id, {
			completed: [...state.completed, "description"],
		});

		return new Response(JSON.stringify(result), {
			headers: { "Content-Type": "application/json" },
			status: done() ? 200 : 202,
		});
	}

	const result = {
		paper,
		generated: {
			title,
			// Get from cache
			description: await summariseDescription(
				id,
				paper?.title as string,
				paper?.abstract as string,
			),
		},
	} as AnnotatedPaper;

	return new Response(JSON.stringify(result), {
		headers: { "Content-Type": "application/json" },
		status: done() ? 200 : 202,
	});
}

async function fetchPaper(id: string) {
	const fetchWorker = unstable_cache(async () => {
		console.log("[api][paper] Fetching ", id);
		const oaPaper = await fetch(
			`${oaBaseUrl}/${id}?${oaBaseArgs}&select=${openAlexFields.all}`,
		);
		if (!oaPaper.ok) {
			console.error(
				`Failed to fetch paper ${id} from OpenAlex (${oaPaper.status}: ${oaPaper.statusText})`,
			);
			return undefined;
		}
		const oaPaperJson = (await oaPaper.json()) as OpenAlexWorkMetadata;

		return {
			...oaPaperJson,
			abstract: fromInvertedIndex(oaPaperJson.abstract_inverted_index, 350),
		};
	}, [`paper-data:${id}`]);
	return await fetchWorker();
}

async function summariseTitle(id: string, title: string, abstract: string) {
	const summarise = unstable_cache(async () => {
		console.log("[api][paper] Summarising title ", id);
		const result = await summariseTitleWorker(title, abstract, "chat");
		return result;
	}, [`paper-title:${id}`]);
	const cached = await summarise();

	return cached;
}

async function summariseDescription(
	id: string,
	title: string,
	abstract: string,
) {
	const summarise = unstable_cache(async () => {
		console.log("[api][paper] Summarising description ", id);
		const result = await summariseDescriptionWorker(title, abstract, "chat");
		return result;
	}, [`paper-description:${id}`]);
	const cached = await summarise();

	return cached;
}
