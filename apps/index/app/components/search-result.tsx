"use client";
import { useQuery } from "@tanstack/react-query";
import { Feature, SearchResult as Item } from "../actions/search-action";
import { summariseAction } from "../actions/summarise-action";

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
					<div className="text-xl">
						<a
							target="_blank"
							rel="noreferrer"
							href={`http://proem.ai/paper/oa/${item.id.split("/").at(-1)}`}
						>
							{summary}
						</a>
					</div>
				) : null}
				<div className="text-sm text-gray-500">
					<a
						target="_blank"
						rel="noreferrer"
						href={`http://proem.ai/paper/oa/${item.id.split("/").at(-1)}`}
					>
						{item.title}
					</a>
				</div>
				<div>
					{item.features
						.filter((f) => f.score > 0.5)
						.map((f, i) => (
							<FeatureBagde key={i} feature={f} />
						))}
				</div>
			</div>
		</>
	);
}

export function FeatureBagde({ feature }: { feature: Feature }) {
	return (
		<span className="my-1 mr-1 px-2 py-0.5 text-xs cursor-default text-gray-500 border bg-gray-100 rounded-full">
			{feature.score.toFixed(2)} {feature.label}
		</span>
	);
}
