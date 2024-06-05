import { FeatureBadge } from "../../../../../components/fingerprints/feature-badge";
import { trimForQuotes } from "@/utils/string-utils";
import { RankedPaper } from "@/components/fingerprints/fetch-by-features";

export function PaperCard({ rankedPaper }: { rankedPaper: RankedPaper }) {
	return (
		<div>
			<div>
				[{rankedPaper.paper.id}]{" "}
				{rankedPaper.paper.generated?.title
					? trimForQuotes(rankedPaper.paper.generated?.title)
					: rankedPaper.paper.data.title}{" "}
				({rankedPaper.filterMatchScore.toFixed(2)})
			</div>
			<div>
				{rankedPaper.features.map((feature, i) => (
					<FeatureBadge
						key={i}
						score={feature.featureMatchScore}
						variant={feature.irrelevant ? "disabled" : feature.type}
					>
						{feature.label}
					</FeatureBadge>
				))}
			</div>
		</div>
	);
}
