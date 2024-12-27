import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { NextRequest, NextResponse } from "next/server";
import {
	InvokeEndpointCommand,
	SageMakerRuntimeClient,
} from "@aws-sdk/client-sagemaker-runtime";
import { z } from "zod";

export const maxDuration = 60;

const AWS_CONFIG = {
	region: "eu-central-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
	modelEndpointName: process.env.AWS_MODEL_ENDPOINT_NAME as string,
};

const client = new SageMakerRuntimeClient(AWS_CONFIG);

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
			const modelInput = `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${question}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

			const requestPayload = {
				inputs: modelInput,
				parameters: {
					max_new_tokens: 256,
					top_p: 0.9,
					temperature: 0.6,
				},
			};

			const response = await client.send(
				new InvokeEndpointCommand({
					Accept: "application/json",
					ContentType: "application/json",
					EndpointName: AWS_CONFIG.modelEndpointName,
					Body: JSON.stringify(requestPayload),
				}),
			);

			const jsonString = Buffer.from(response.Body).toString("utf8");
			const json = JSON.parse(jsonString);

			return NextResponse.json(json);
		} catch (error) {
			console.error(error);
			return NextResponse.json(error, { status: 400 });
		}
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};
