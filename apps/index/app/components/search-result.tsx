"use client";
import { useQuery } from "@tanstack/react-query";
import { Feature, QdrantPaper } from "../actions/search-action";
import { summariseAction } from "../actions/summarise-action";

export function SearchResult({
	item,
	onSelect,
}: {
	item: QdrantPaper;
	onSelect?: (item: QdrantPaper, summary: string) => void;
}) {
	const { data: summary, isLoading } = useQuery({
		queryKey: ["summary", item.title, item.abstract],
		queryFn: async () => {
			return await summariseAction(item.title, item.abstract);
		},
		enabled: !!item,
	});

	return (
		<div className="p-5 mb-6 rounded-xl border border-[#232a36] shadow-lg bg-gradient-to-br from-[#181c1f] via-[#232a36] to-[#1a2220]">
			<div className="mb-4">
				{isLoading ? (
					<div className="text-green-200 italic flex items-center">
						<svg
							className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-300"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						summarising...
					</div>
				) : summary ? (
					<div
						className="text-xl font-semibold mb-3 text-white leading-tight hover:text-green-300 transition-colors duration-200 cursor-pointer"
						onClick={() => onSelect?.(item, summary)}
					>
						{summary}
					</div>
				) : null}

				<div className="text-sm mb-3">
					<a
						target="_blank"
						rel="noreferrer"
						href={item.primary_location?.landing_page_url}
						className="text-green-200 hover:text-green-300 font-medium transition-colors duration-200"
					>
						{item.title}
					</a>
					<div className="text-xs text-white font-medium mt-2">
						{item.published}
						<span className="ml-2 font-bold">
							<a
								target="_blank"
								rel="noreferrer"
								href={item.primary_location?.landing_page_url}
							>
								{item.primary_location?.source?.display_name ??
									item.primary_location?.source?.host_organization_name ??
									item.authorships?.at(0)?.author.institution ??
									item.authorships?.at(0)?.author.display_name}
							</a>
						</span>
					</div>
				</div>
			</div>

			{item.features.filter((f) => f.score > 0.5).length > 0 && (
				<div className="flex flex-wrap gap-2">
					{item.features
						.filter((f) => f.score > 0.5)
						.map((f, i) => (
							<FeatureBadge key={i} feature={f} />
						))}
				</div>
			)}
		</div>
	);
}

export function FeatureBadge({ feature }: { feature: Feature }) {
	// Generate a color based on the feature score
	const getScoreColor = (score: number) => {
		// if (score > 0.8) return "bg-green-300 text-black border-green-200";
		// if (score > 0.65) return "bg-green-200 text-black border-green-100";
		return "bg-[#232a36] text-green-300 border-[#2e3a3f]";
	};

	return (
		<span
			className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm border ${getScoreColor(feature.score)}`}
		>
			#{feature.label.toLowerCase().replace(" ", "-")}
		</span>
	);
}
