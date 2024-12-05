import { summariseDescription as summariseDescriptionWorker } from "@proemial/adapters/llm/prompts/description";
import { summariseTitle as summariseTitleWorker } from "@proemial/adapters/llm/prompts/microtitle";
import {
	oaBaseArgs,
	oaBaseUrl,
	openAlexFields,
	OpenAlexWorkMetadata,
} from "@proemial/repositories/oa/models/oa-paper";
import { fromInvertedIndex } from "@proemial/utils/string";
import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	if (!id) {
		return new Response("Missing id", { status: 400 });
	}

	const stream = new ReadableStream({
		async start(controller) {
			const data = await fetchPaper(id);
			controller.enqueue(JSON.stringify({ data }));

			if (data) {
				// TODO: Fix and use cached summariseTitle
				const title = await summariseTitleWorker(
					data.title as string,
					data.abstract as string,
					"chat",
				);

				controller.enqueue(
					JSON.stringify({
						data,
						generated: { title },
					}),
				);

				// TODO: Fix and use cached summariseDescription
				const description = await summariseDescriptionWorker(
					data.title as string,
					data.abstract as string,
					"chat",
				);
				controller.enqueue(
					JSON.stringify({ data, generated: { title, description } }),
				);
			}

			controller.close();
		},
	});

	return new Response(stream, {
		headers: { "Content-Type": "application/json" },
		status: 200,
	});
}

async function summariseTitle(id: string, title: string, abstract: string) {
	const summarise = unstable_cache(async () => {
		console.log("[paper][summarise][title]", id);
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
		console.log("[paper][summarise][description]", id);
		const result = await summariseDescriptionWorker(title, abstract, "chat");
		return result;
	}, [`paper-description:${id}`]);
	const cached = await summarise();

	return cached;
}

async function fetchPaper(id: string) {
	const fetchWorker = unstable_cache(async () => {
		console.log("[paper][fetch] ", id);
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
