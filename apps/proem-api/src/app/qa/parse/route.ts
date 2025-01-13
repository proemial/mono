import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@proemial/adapters/llama-index/parse-file";

/**
 * Example:
 * 	 curl http://localhost:3000/qa/parse -F "file=@/Users/jon/foo.pdf"
 */
export const POST = async (request: NextRequest) => {
	const formData = await request.formData();
	const file = formData.get("file");
	if (!file || !(file instanceof File)) {
		return NextResponse.json({ error: "No file received" }, { status: 400 });
	}

	console.log(file);
	const buffer = Buffer.from(await file.arrayBuffer());
	const documents = await parseFile(buffer, file.name);

	return NextResponse.json({
		documents,
	});
};
