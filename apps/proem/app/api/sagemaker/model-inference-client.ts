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

export module ModelInferenceClient {
	export const invokeEndpoint = async ({
		question,
		endpointName,
		modelOptions = {
			temperature: 0.0,
			maxOutputTokens: 1024,
			details: false,
		},
	}: {
		question: string;
		endpointName: string;
		modelOptions?: {
			temperature?: number;
			maxOutputTokens?: number;
			details?: boolean;
		};
	}) => {
		const modelInput = `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${question}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

		const requestPayload = {
			inputs: modelInput,
			parameters: {
				top_p: 0.9,
				temperature: modelOptions.temperature,
				max_new_tokens: modelOptions.maxOutputTokens,
				details: modelOptions.details,
			},
		};

		const response = await runtimeClient.send(
			new InvokeEndpointCommand({
				Accept: "application/json",
				ContentType: "application/json",
				EndpointName: endpointName,
				Body: JSON.stringify(requestPayload),
			}),
		);

		const jsonString = Buffer.from(response.Body).toString("utf8");
		return JSON.parse(jsonString) as { generated_text: string };
	};
}
