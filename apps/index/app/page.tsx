"use client";
import { searchAction, SearchResult } from "./search-action";
import { useFormState } from "react-dom";
import { SearchForm } from "./search-form";
import { SearchResult as PaperCard } from "./search-result";

export default function Home() {
	const [formState, action] = useFormState(searchAction, [] as SearchResult[]);

	return (
		<div>
			<form action={action} className="flex flex-col gap-1">
				<SearchForm />
				<SearchResults results={formState} />
			</form>
		</div>
	);
}

function SearchResults({ results }: { results: SearchResult[] }) {
	return (
		<div className="grid grid-cols-[auto_auto_1fr] gap-4">
			{!!results.length && (
				<>
					<div className="font-bold">Score</div>
					<div className="font-bold">Created Date</div>
					<div className="font-bold">Title</div>
					{results.map((result, i) => (
						<PaperCard key={i} item={result} />
					))}
				</>
			)}
		</div>
	);
}
