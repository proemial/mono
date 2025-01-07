import {
	InvokeEndpointCommand,
	SageMakerRuntimeClient,
} from "@aws-sdk/client-sagemaker-runtime";

const runtimeClient = new SageMakerRuntimeClient({
	region: "eu-central-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
});

export module LLaMA32Client {
	export const generate = async ({
		prompt,
		modelOptions,
	}: {
		prompt: string;
		modelOptions?: {
			temperature?: number;
			topP?: number;
			maxOutputTokens?: number;
			details?: boolean;
		};
	}) => {
		const requestPayload = {
			inputs: prompt,
			parameters: {
				temperature: modelOptions?.temperature ?? 0.0,
				top_p: modelOptions?.topP ?? 0.9,
				max_new_tokens: modelOptions?.maxOutputTokens ?? 1024,
				details: modelOptions?.details ?? false,
			},
		};

		const response = await runtimeClient.send(
			new InvokeEndpointCommand({
				Accept: "application/json",
				ContentType: "application/json",
				EndpointName: process.env.AWS_MODEL_ENDPOINT_NAME_LLAMA32 as string,
				Body: JSON.stringify(requestPayload),
			}),
		);

		const jsonString = Buffer.from(response.Body).toString("utf8");
		const { generated_text, details } = JSON.parse(jsonString) as {
			generated_text: string;
			details?: {
				generated_tokens?: number;
				finish_reason?: string;
			};
		};
		return {
			generated_text,
			details: {
				generated_tokens: details?.generated_tokens,
				finish_reason: details?.finish_reason,
			},
		};
	};
}
