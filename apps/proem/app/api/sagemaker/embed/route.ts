import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BGEM3Client } from "../model-inference/bgem3-client";

export const maxDuration = 60;

const RequestBodySchema = z.object({
	document: z.string(),
});

export const POST = async (req: NextRequest) => {
	try {
		const { success } = await ratelimitByIpAddress(req.ip);
		if (!success) {
			return NextResponse.json({ error: "Rate limited" }, { status: 429 });
		}
		try {
			const { document } = RequestBodySchema.parse(await req.json());
			const { embedding } = await BGEM3Client.embedDocument({
				document,
			});
			console.log(`Embedding dimensions: ${embedding.length}`);
			return NextResponse.json({ embedding });
		} catch (error) {
			console.error(error);
			return NextResponse.json(error, { status: 400 });
		}
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};
