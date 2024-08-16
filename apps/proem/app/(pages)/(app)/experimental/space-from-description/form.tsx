"use client";
import { fetchPapersTitles } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Button, Input, Textarea } from "@proemial/shadcn-ui";
import MultipleSelector, {
	Option,
} from "@proemial/shadcn-ui/components/ui/multiple-selector";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    const {ids, question, title, description} = searchParams ?? {};

	return (
		<form onSubmit={async (value) => await handleSearch(value)}>
			<div className="flex flex-col gap-1">
				<Input
					name="title"
					placeholder="Title"
					className="grow bg-white"
					defaultValue={title}
				/>
				<Textarea
					name="description"
					placeholder="Description"
					className="grow bg-white"
					defaultValue={description}
				/>
				<Button type="submit" className="text-xs tracking-wider">
					Validate space input
				</Button>
			</div>
		</form >
	)

	// return (
	// 	<div className="flex w-full flex-col gap-5">
	// 		<MultipleSelector
	// 			onSearch={async (value) => await handleSearch(value)}
	// 			placeholder="Type to search papers..."
	// 			hidePlaceholderWhenSelected
	// 			loadingIndicator={
	// 				<p className="py-2 text-center text-lg leading-10 text-muted-foreground">
	// 					loading...
	// 				</p>
	// 			}
	// 			emptyIndicator={
	// 				<p className="w-full text-center text-lg leading-10 text-muted-foreground">
	// 					no results found.
	// 				</p>
	// 			}
	// 			value={options}
	// 			onChange={handleChange}
	// 		/>
	// 	</div>
	// );
}
