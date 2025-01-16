import { NextRequest, NextResponse } from "next/server";
import { LlamaParseClient } from "@proemial/adapters/llamaindex/llama-parse-client";
import { Time } from "@proemial/utils/time";
import { JobResultResponse } from "@proemial/adapters/llamaindex/types";

const llamaParseClient = new LlamaParseClient({
	apiKey: process.env.LLAMA_CLOUD_API_KEY as string,
	verbose: true,
});

/**
 * Example:
 * 	 curl http://localhost:3000/qa/parse -F "file=@/Users/jon/foo.pdf"
 */
export const POST = async (request: NextRequest) => {
	const begin = Time.now();
	let result: JobResultResponse | undefined = undefined;

	try {
		const formData = await request.formData();
		const file = formData.get("file");
		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: "No file received" }, { status: 400 });
		}
		result = await llamaParseClient.parseFile(file);
		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[qa][parse] parsed ${result?.markdown?.length} chars`);
	}
};
