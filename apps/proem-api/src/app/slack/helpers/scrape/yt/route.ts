import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchTranscript } from "@proemial/adapters/youtube/transcript";

const RequestBodySchema = z.object({
	videoId: z.string(),
});

export async function POST(request: Request) {
	try {
		const { videoId } = RequestBodySchema.parse(await request.json());
		const transcript = await fetchTranscript(videoId);
		return NextResponse.json(transcript);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to fetch transcript" },
			{ status: 500 },
		);
	}
}
