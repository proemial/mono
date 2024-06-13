import { getOaPaperSearchUrl } from "./oa-identifier";

type WithId = {
	id: string;
};

type SearchResponse = {
	results: WithId[];
};

export async function getPaperId(identifier: string) {
	const url = getOaPaperSearchUrl(identifier);
	const response = await fetch(url);
	const json = (await response.json()) as SearchResponse;

	if (!json.results.length) {
		return undefined;
	}

	return json.results[0]?.id.split("/").at(-1) as string;
}
