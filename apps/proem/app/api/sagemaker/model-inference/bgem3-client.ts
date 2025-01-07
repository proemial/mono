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

export module BGEM3Client {
	export const embedDocument = async ({
		document,
		modelOptions,
	}: {
		document: string;
		modelOptions?: {
			topK?: number;
			corpus?: string;
			queries?: string;
			returnText?: boolean;
		};
	}) => {
		const requestPayload = {
			text_inputs: document,
			mode: "embedding",
			top_k: modelOptions?.topK,
			corpus: modelOptions?.corpus,
			queries: modelOptions?.queries,
			return_text: modelOptions?.returnText,
		};

		const response = await runtimeClient.send(
			new InvokeEndpointCommand({
				Accept: "application/json",
				ContentType: "application/json",
				EndpointName: process.env.AWS_MODEL_ENDPOINT_NAME_BGEM3 as string,
				Body: JSON.stringify(requestPayload),
			}),
		);

		const jsonString = Buffer.from(response.Body).toString("utf8");
		return JSON.parse(jsonString) as { embedding: number[] };
	};
}
