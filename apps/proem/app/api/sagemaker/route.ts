import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PromptFormatter } from "./prompt-formatter";
import { LLaMA32Client } from "./model-inference/llama32-client";

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
			const { generated_text, details } = await LLaMA32Client.generate({
				prompt: PromptFormatter.llama32(question),
				modelOptions: {
					details: true,
				},
			});
			return NextResponse.json({
				answer: generated_text,
				details,
			});
		} catch (error) {
			console.error(error);
			return NextResponse.json(error, { status: 400 });
		}
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};
