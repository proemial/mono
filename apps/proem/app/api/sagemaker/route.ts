import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ModelInferenceClient } from "./model-inference-client";

export const maxDuration = 60;

const RequestBodySchema = z.object({
	question: z.string(),
});

export const POST = async (req: NextRequest) => {
	try {
		const { success } = await ratelimitByIpAddress(req.ip);
		if (!success) {
			return NextResponse.json({ error: "Rate limited" }, { status: 429 });
		}

		try {
			const { question } = RequestBodySchema.parse(await req.json());

			const { generated_text } = await ModelInferenceClient.invokeEndpoint({
				question,
				endpointName: process.env.AWS_MODEL_ENDPOINT_NAME as string,
			});

			return NextResponse.json({ answer: generated_text });
		} catch (error) {
			console.error(error);
			return NextResponse.json(error, { status: 400 });
		}
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};
