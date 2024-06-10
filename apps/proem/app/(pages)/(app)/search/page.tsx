"use client";
import Markdown from "react-markdown";
import { FeedItemCard } from "../discover/feed-item-card";
import { SearchForm } from "./search-form";
import { useQuery } from "react-query";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { useState } from "react";
import { findPapers } from "./find-papers";
import FeedItem from "../discover/feed-item";

export default function SearchPage() {
	const [query, setQuery] = useState("");

	const handleSearch = (query: string) => {
		console.log("Searching for", query);
		setQuery(query);
	};

	return (
		<div className="space-y-6">
			<SearchForm
				placeholder="Search for a paper"
				trackingPrefix="search"
				onSearch={handleSearch}
			/>
			<SearchResult query={query} />
		</div>
	);
}

function SearchResult({ query }: { query: string }) {
	const { data } = usePapers(query);

	console.log("data", data);

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{data.map((paper, i) => (
				<div key={i} className="py-5">
					{paper?.data && <FeedItem paper={paper as OpenAlexPaper} />}
				</div>
			))}
		</div>
	);
}

function usePapers(query: string) {
	return useQuery(["search", query], () => findPapers(query));
}
