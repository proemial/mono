import nodeFetch from "node-fetch";

type ProxyPool =
	| "public_residential_pool" // 25 API credits
	| "public_datacenter_pool"; // 1 API credits

type ProxyResponse = {
	result: {
		content: string; // Can be HTML or JSON (serialized)
		status_code: number;
		success: boolean;
		error: {
			code: string;
			http_code: number;
			message: string;
			retryable: boolean;
		} | null;
	};
};

/**
 * Fetch a HTTP resource using Scrapfly's web proxy.
 * Use it inside a try-catch block.
 *
 * @see https://scrapfly.io/docs/scrape-api/proxy
 */
export class ScrapflyWebProxy {
	private readonly apiKey: string;
	private readonly proxyPool: ProxyPool;

	constructor(apiKey: string | undefined, proxyPool?: ProxyPool) {
		if (!apiKey) {
			throw new Error("Scrapfly API key is required");
		}
		this.apiKey = apiKey;
		this.proxyPool = proxyPool ?? "public_residential_pool";
	}

	public async fetch(url: string) {
		const params = new URLSearchParams({
			url,
			key: this.apiKey,
			proxy_pool: this.proxyPool,
			country: "dk",
		});
		const response = await nodeFetch(
			`https://api.scrapfly.io/scrape?${params.toString()}`,
		);
		// E.g. if the API key is no longer valid
		if (!response.ok) {
			throw new Error("Cannot access web proxy ", {
				cause: await response.json(),
			});
		}
		const json = (await response.json()) as ProxyResponse;
		// If the URL is inaccessible
		if (!json.result.success) {
			throw new Error(`Web proxy fetch failed: ${url}`, {
				cause: json.result.error,
			});
		}
		return json.result;
	}
}
