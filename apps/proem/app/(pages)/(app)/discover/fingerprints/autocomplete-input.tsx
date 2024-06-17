"use client";
import MultipleSelector, {
	Option,
} from "@proemial/shadcn-ui/components/ui/multiple-selector";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPapersTitles } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";

export const AUTOCOMPLETE_QUERY_STRING = "ids";

type PapersSearchResult = {
	results: { id: string; display_name: string; cited_by_count: number }[];
};

async function handleSearch(input: string): Promise<Option[]> {
	const suggestions = await fetch(
		`https://api.openalex.org/autocomplete/works?q=${input}`,
	);
	const json = (await suggestions.json()) as PapersSearchResult;

	return json.results.map((item) => ({
		value: item.id,
		label: `${
			item.display_name
		} (${item.cited_by_count.toLocaleString()} citations)`,
	}));
}

export function AutocompleteInput() {
	const router = useRouter();

	const searchParams = useSearchParams();
	const ids = searchParams.get(AUTOCOMPLETE_QUERY_STRING);
	const [options, setOptions] = useState<Option[]>([]);

	useEffect(() => {
		if (ids) {
			const fetchData = async () => {
				const papers = (await fetchPapersTitles(ids?.split(",") ?? [])).flatMap(
					(f) => f,
				);
				if (papers) {
					setOptions(papers.map((p) => ({ value: p.id, label: p.title })));
				}
			};
			fetchData().catch(console.error);
		}
	}, [ids]);

	const handleChange = (value: Option[]) => {
		const filter = value.map((v) => v.value.split("/").at(-1)).join(",");
		router.replace(
			`/discover/fingerprints?${AUTOCOMPLETE_QUERY_STRING}=${filter}`,
		);
	};

	return (
		<div className="flex w-full flex-col gap-5">
			<MultipleSelector
				onSearch={async (value) => await handleSearch(value)}
				placeholder="Type to search papers..."
				hidePlaceholderWhenSelected
				loadingIndicator={
					<p className="py-2 text-center text-lg leading-10 text-muted-foreground">
						loading...
					</p>
				}
				emptyIndicator={
					<p className="w-full text-center text-lg leading-10 text-muted-foreground">
						no results found.
					</p>
				}
				value={options}
				onChange={handleChange}
			/>
		</div>
	);
}
