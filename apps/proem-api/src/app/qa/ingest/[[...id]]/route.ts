import { NextResponse } from "next/server";
import { LlamaParseClient } from "@proemial/adapters/llamaindex/llama-parse-client";
import { Time } from "@proemial/utils/time";
import { JobResultResponse } from "@proemial/adapters/llamaindex/types";
import { uuid } from "@proemial/utils/uid";
import qdrantHelper from "@proemial/adapters/qdrant/adapter";
import LlmModels from "@proemial/adapters/llm/models";
import {
	chunkMarkdown,
	chunkSentences,
} from "@proemial/adapters/llamaindex/llama-chunker";

const qdrant = qdrantHelper({
	url: process.env.QDRANT_QA_URL as string,
	apiKey: process.env.QDRANT_QA_API_KEY as string,
});

const llamaParseClient = new LlamaParseClient({
	apiKey: process.env.LLAMA_CLOUD_API_KEY as string,
	verbose: true,
});

/**
 * Example:
 * 	 curl http://localhost:3000/qa/ingest/(id?) -F "file=@/Users/jon/foo.pdf"
 */
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const begin = Time.now();
	let parsed: JobResultResponse | undefined = undefined;

	try {
		const formData = await request.formData();
		const file = formData.get("file");
		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: "No file received" }, { status: 400 });
		}

		const id = (await params).id ?? uuid();
		console.log(`[qa][ingest] id: ${id}`);

		parsed = await llamaParseClient.parseFile(file);
		console.log(`[qa][ingest] parsed: ${parsed.markdown.length}`);

		const markdownChunks = chunkMarkdown(parsed.markdown);
		const fullText = markdownChunks.map((c) => c.text).join("\n\n");
		const chunks = chunkSentences(fullText);
		console.log(`[qa][ingest] chunks: ${chunks.length}`);

		const embeddings = await generateEmbeddings(chunks);
		console.log(`[qa][ingest] embeddings: ${embeddings.length}`);

		const points = embeddings.map((vector, i) => ({
			vector,
			payload: {
				file: file.name,
				text: chunks[i],
			},
		}));

		// TODO: Insert into Qdrant
		await createVectorSpace(id);
		await qdrant.points.insert(id, points);

		return NextResponse.json({
			id,
			chars: parsed?.markdown.length,
			// embeddings: embeddings.length,
		});
	} finally {
		Time.log(begin, `[qa][ingest][parse] ${parsed?.markdown?.length} chars`);
	}
}

function chunkText(markdown: string) {
	const chunks = chunkMarkdown(markdown);
	// console.log(chunks.map((chunk) => chunk.metadata));

	return chunks.map((chunk) => ({
		text: chunk.text,
		position: [chunk.startCharIdx, chunk.endCharIdx],
	}));
}

async function createVectorSpace(id: string) {
	const exists = await qdrant.spaces.exists(id);
	console.log(`[qa][ingest] collection exists: ${exists.exists}`);

	if (!exists.exists) {
		const created = await qdrant.spaces.create(id);
		console.log(`[qa][ingest] collection created: ${created}`);
	}

	const collection = await qdrant.spaces.get(id);
	console.log(`[qa][ingest] collection: ${collection}`);
}

async function generateEmbeddings(strings: string[]) {
	const begin = Time.now();
	try {
		const embeddings: number[][] = [];

		for (let i = 0; i < strings.length; i++) {
			const text = strings[i];
			const response = await LlmModels.api.embeddings()(
				text,
				"nomic-embed-text-v1.5",
			);
			embeddings.push(response);
		}

		if (strings.length !== embeddings.length) {
			throw new Error(
				`Embeddings length does not match strings length: ${strings.length} !== ${embeddings.length}`,
			);
		}

		return embeddings;
	} finally {
		Time.log(begin, `[qa][ingest][embed] ${strings.length} strings`);
	}
}
