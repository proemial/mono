import { useQuery } from "@tanstack/react-query";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";

type Config = {
	preReqs?: boolean;
	done?: boolean;
};

export function useScraper(url: string, config: Config) {
	return useQuery<NewsAnnotatorSteps>({
		queryKey: ["annotator:scrape", url],
		queryFn: async () => {
			const response = await fetch("/api/news/annotate/scrape", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			});

			return response.json();
		},
		enabled: !!url && !config.done,
	});
}

export function useQueryBuilder(url: string, config: Config) {
	return useQuery<NewsAnnotatorSteps>({
		queryKey: ["annotator:query", url],
		queryFn: async () => {
			const response = await fetch("/api/news/annotate/query", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			});

			return response.json();
		},
		enabled: !!url && !!config.preReqs && !config.done,
	});
}

export function usePapers(url: string, config: Config) {
	return useQuery<NewsAnnotatorSteps>({
		queryKey: ["annotator:papers", url],
		queryFn: async () => {
			const response = await fetch("/api/news/annotate/fetch", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			});

			return response.json();
		},
		enabled: !!url && !!config.preReqs && !config.done,
	});
}

export function useSummarisation(url: string, config: Config) {
	return useQuery<NewsAnnotatorSteps>({
		queryKey: ["annotator:summarise", url],
		queryFn: async () => {
			const response = await fetch("/api/news/annotate/summarise", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			});

			return response.json();
		},
		enabled: !!url && !!config.preReqs && !config.done,
	});
}
