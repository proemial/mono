import { z } from "zod";
import {
	remoteOllamaChatModel,
	remoteOllamaEmbeddingModel,
} from "../llm/providers/remote-ollama";
import {
	DescribeInstancesCommand,
	EC2Client,
	StartInstancesCommand,
	StopInstancesCommand,
} from "@aws-sdk/client-ec2";
import { EmbeddingModel } from "ai";

const RemoteOllamaClientOptionsSchema = z.object({
	instanceId: z.string().min(1),
	awsCredentials: z.object({
		accessKeyId: z.string().min(1),
		secretAccessKey: z.string().min(1),
	}),
	ngrokConfig: z.object({
		baseUrl: z.string().min(1),
		basicAuth: z.string().min(1),
	}),
});

type RemoteOllamaClientOptions = z.infer<
	typeof RemoteOllamaClientOptionsSchema
>;

const POLL_INTERVAL = 3000;

export class RemoteOllamaClient {
	private readonly instanceId: string;
	private readonly ngrokConfig: RemoteOllamaClientOptions["ngrokConfig"];
	private readonly client: EC2Client;

	constructor(options: RemoteOllamaClientOptions) {
		const { instanceId, awsCredentials, ngrokConfig } =
			RemoteOllamaClientOptionsSchema.parse(options);

		this.instanceId = instanceId;
		this.client = new EC2Client({
			region: "eu-central-1",
			credentials: {
				accessKeyId: awsCredentials.accessKeyId,
				secretAccessKey: awsCredentials.secretAccessKey,
			},
		});
		this.ngrokConfig = ngrokConfig;
	}

	async startInstance() {
		const currentState = await this._getInstanceStatus();
		if (currentState === "stopped") {
			const command = new StartInstancesCommand({
				InstanceIds: [this.instanceId],
			});
			console.log(`Starting instance ${this.instanceId}…`);
			await this.client.send(command);

			console.log("Waiting for instance to be ready…");
			let state = await this._getInstanceStatus();
			while (state !== "running") {
				await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
				state = await this._getInstanceStatus();
			}
			console.log(`Instance ${this.instanceId} is ready`);

			console.log("Waiting for Ollama server to be ready…");
			while (!(await this._isOllamaServerReady())) {
				await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
			}
			console.log("Ollama server is ready");
		} else if (currentState === "running") {
			console.log(`Instance ${this.instanceId} is already running`);
			const isOllamaServerReady = await this._isOllamaServerReady();
			if (!isOllamaServerReady) {
				console.log("Waiting for Ollama server to be ready…");
				while (!(await this._isOllamaServerReady())) {
					await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
				}
				console.log("Ollama server is ready");
			}
		} else {
			throw new Error(`Instance ${this.instanceId} is not ready`);
		}
	}

	async stopInstance(options?: { waitForStop: boolean }) {
		const currentState = await this._getInstanceStatus();
		if (currentState === "running") {
			const command = new StopInstancesCommand({
				InstanceIds: [this.instanceId],
			});
			console.log(`Stopping instance ${this.instanceId}…`);
			await this.client.send(command);

			if (options?.waitForStop) {
				console.log("Waiting for instance to be stopped…");
				let state = await this._getInstanceStatus();
				while (state !== "stopped") {
					await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
					state = await this._getInstanceStatus();
				}
				console.log(`Instance ${this.instanceId} is stopped`);
			}
		} else if (currentState === "stopping") {
			console.log(`Instance ${this.instanceId} is already stopping`);
		} else {
			throw new Error(`Instance ${this.instanceId} is not ready`);
		}
	}

	getChatModel(modelId: Parameters<typeof remoteOllamaChatModel>[0]) {
		return remoteOllamaChatModel(
			modelId,
			this.ngrokConfig.baseUrl,
			this.ngrokConfig.basicAuth,
		);
	}

	getEmbeddingModel(
		modelId: Parameters<typeof remoteOllamaEmbeddingModel>[0],
	): EmbeddingModel<string> {
		return remoteOllamaEmbeddingModel(
			modelId,
			this.ngrokConfig.baseUrl,
			this.ngrokConfig.basicAuth,
		);
	}

	/**
	 * Creates a new `RemoteOllamaClient` instance of the given variant.
	 * @param variant Select `slow` to use a `g4dn.xlarge` EC2 instance, or `fast` for a `g5.xlarge` (more expensive).
	 * @returns A new `RemoteOllamaClient` instance.
	 */
	static create(variant: "slow" | "fast") {
		return new RemoteOllamaClient({
			instanceId: process.env[
				`REMOTE_OLLAMA_INSTANCE_ID_${variant.toLocaleUpperCase()}`
			] as string,
			awsCredentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
			},
			ngrokConfig: {
				baseUrl: process.env[
					`REMOTE_OLLAMA_BASE_URL_${variant.toLocaleUpperCase()}`
				] as string,
				basicAuth: process.env.REMOTE_OLLAMA_BASIC_AUTH as string,
			},
		});
	}

	private async _getInstanceStatus() {
		const command = new DescribeInstancesCommand({
			InstanceIds: [this.instanceId],
		});
		const response = await this.client.send(command);
		return response.Reservations?.[0]?.Instances?.[0]?.State?.Name;
	}

	private async _getInstancePublicIp() {
		const command = new DescribeInstancesCommand({
			InstanceIds: [this.instanceId],
		});
		const response = await this.client.send(command);
		return response.Reservations?.[0]?.Instances?.[0]?.PublicIpAddress;
	}

	private async _isOllamaServerReady() {
		const response = await fetch(`${this.ngrokConfig.baseUrl}`, {
			headers: {
				Authorization: `Basic ${Buffer.from(this.ngrokConfig.basicAuth).toString("base64")}`,
			},
		});
		return response.status === 200;
	}
}
