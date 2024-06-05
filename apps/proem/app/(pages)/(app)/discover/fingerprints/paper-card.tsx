import { OpenAlexPaper } from "@proemial/models/open-alex";
import { FeatureBadge } from "../../../../../components/fingerprints/feature-badge";
import { RankedFeature } from "../../../../../components/fingerprints/features";
import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { trimForQuotes } from "@/utils/string-utils";

export function PaperCard({
	paper,
	filter,
}: { paper: OpenAlexPaper; filter: RankedFeature[] }) {
	const inFilter = (id: string) => {
		const found = filter.find((f) => f.id === id);
		return found ? found.type : "disabled";
	};

	return (
		<div>
			<div>
				{paper.generated?.title
					? trimForQuotes(paper.generated?.title)
					: paper.data.title}
			</div>
			<div>
				{paper.data.topics?.map((topic, i) => (
					<FeatureBadge
						key={i}
						score={topic.score}
						variant={inFilter(topic.id)}
					>
						{oaTopicsTranslationMap[topic.id]?.["short-name"] as string}
					</FeatureBadge>
				))}
				{paper.data.keywords?.map((keyword, i) => (
					<FeatureBadge
						key={i}
						score={keyword.score}
						variant={inFilter(keyword.id)}
					>
						{keyword.display_name}
					</FeatureBadge>
				))}
				{paper.data.concepts?.map((concept, i) => (
					<FeatureBadge
						key={i}
						score={concept.score}
						variant={inFilter(concept.id)}
					>
						{concept.display_name}
					</FeatureBadge>
				))}
			</div>
		</div>
	);
}
