"use client";
import { useQuery } from "@tanstack/react-query";
import { SearchResult as Item } from "./search-action";
import { summariseAction } from "./summarise-action";

export function SearchResult({ item }: { item: Item }) {
	const { data: summary, isLoading } = useQuery({
		queryKey: ["summary", item.title, item.abstract],
		queryFn: async () => {
			return await summariseAction(item.title, item.abstract);
		},
		enabled: !!item,
	});

	return (
		<>
			<div>{item.score.toFixed(2)}</div>
			<div>{item.created}</div>
			<div>
				{isLoading ? (
					<div>summarising...</div>
				) : summary ? (
					<div className="text-xl">{summary}</div>
				) : null}
				<div className="text-sm text-gray-500">
					<a
						className="underline"
						target="_blank"
						rel="noreferrer"
						href={`http://proem.ai/paper/oa/${item.id.split("/").at(-1)}`}
					>
						{item.title}
					</a>
				</div>
			</div>
		</>
	);
}
