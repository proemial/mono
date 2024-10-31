import { useQuery } from "@tanstack/react-query";
import {
	NewsAnnotatorSteps,
	ReferencedPaper,
} from "@proemial/adapters/redis/news";

export function useScraper(url: string, done?: boolean) {
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
		enabled: !!url && !done,
	});
}

export function useQueryBuilder(
	url: string,
	transcript?: boolean,
	done?: boolean,
) {
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
		enabled: !!url && !!transcript && !done,
	});
}

export function usePapers(url: string, query?: boolean, done?: boolean) {
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
		enabled: !!url && !!query && !done,
	});
}

export function useSummarisation(
	url: string,
	papers?: boolean,
	done?: boolean,
) {
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
		enabled: !!url && !!papers && !done,
	});
}
