import { ErrorResponse, JobResponse, JobResultResponse } from "./types";

const BASE_URL = "https://api.cloud.llamaindex.ai/api/parsing/";
const POLL_INTERVAL = 3000;

type ClientOptions = {
	apiKey: string;
	verbose?: boolean;
};

export class LlamaParseClient {
	constructor(private readonly options: ClientOptions) {}

	public async parseFile(file: File) {
		this.printIfVerbose(
			`Parsing document ${file.name} (${file.type}, ${file.size} bytes)`,
		);

		let job = await this.uploadDocument(file);
		this.printIfVerbose(`Document uploaded and assigned job id ${job.id}`);

		while (job.status === "PENDING") {
			job = await this.getParseStatus(job.id);
			this.printIfVerbose(`Job ${job.id} status: ${job.status}`);
			if (job.status === "PENDING") {
				await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
			}
		}

		if (job.status === "ERROR") {
			console.error(job);
			throw new Error(job.error_message);
		}

		this.printIfVerbose(
			`Document ${file.name} parsed successfully (job id ${job.id})`,
		);

		return await this.getParseResult(job.id);
	}

	private uploadDocument = async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);

		return await this.fetchFromApi<JobResponse>("upload", "POST", formData);
	};

	private getParseStatus = async (id: string) => {
		return await this.fetchFromApi<JobResponse>(`job/${id}`);
	};

	private getParseResult = async (id: string) => {
		return await this.fetchFromApi<JobResultResponse>(
			`job/${id}/result/markdown`,
		);
	};

	private fetchFromApi = async <
		RESPONSE extends JobResponse | JobResultResponse,
	>(
		uri: string,
		method: "GET" | "POST" = "GET",
		body?: FormData,
	) => {
		const response = await fetch(`${BASE_URL}${uri}`, {
			method,
			body,
			headers: {
				Authorization: `Bearer ${this.options.apiKey}`,
				accept: "application/json",
			},
		});

		if (!response.ok) {
			const { detail } = (await response.json()) as ErrorResponse;
			throw new Error(detail);
		}

		return (await response.json()) as RESPONSE;
	};

	private printIfVerbose = (message: string) => {
		if (this.options.verbose) console.log(message);
	};
}
