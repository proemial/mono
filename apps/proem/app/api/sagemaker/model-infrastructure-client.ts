import {
	CreateEndpointCommand,
	CreateEndpointConfigCommand,
	DeleteEndpointCommand,
	SageMakerClient,
} from "@aws-sdk/client-sagemaker";

const client = new SageMakerClient({
	region: "eu-central-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
});

/**
 * WIP WARNING:
 * This is not yet finished and will cause errors if used.
 */
export module ModelInfrastructureClient {
	export const start = async ({
		endpointName,
		endpointConfigName,
	}: {
		endpointName: string;
		// TODO: Consider auto-generating this name
		endpointConfigName: string;
	}) => {
		const config = await client.send(
			new CreateEndpointConfigCommand({
				EndpointConfigName: endpointConfigName,
				ProductionVariants: [
					{
						// TODO: Consider passing as options
						InstanceType: "ml.c5.xlarge",
						InitialInstanceCount: 1,
						ManagedInstanceScaling: {
							MinInstanceCount: 1,
							MaxInstanceCount: 1,
						},
						VariantName: "variant-1",
						// TODO: Finish this config (get inspired by AWS console options in SageMaker studio)
					},
				],
			}),
		);

		const response = await client.send(
			new CreateEndpointCommand({
				EndpointName: endpointName,
				EndpointConfigName: endpointConfigName,
			}),
		);

		return response;
	};

	export const stop = async ({ endpointName }: { endpointName: string }) => {
		const response = await client.send(
			new DeleteEndpointCommand({
				EndpointName: endpointName,
			}),
		);

		return response;
	};
}
