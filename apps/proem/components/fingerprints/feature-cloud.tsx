import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";
import { FeatureBadge } from "./feature-badge";

const DEBUG = false;

type Props = {
	features?: {
		id: string;
		label: string;
		type: FeatureType;
		coOccurrenceScore?: number;
		featureMatchScore?: number;
		irrelevant?: boolean;
	}[];
	sum?: number;
};

export function FeatureCloud({ features, sum }: Props) {
	const filtered = features?.filter((f) => !f.irrelevant);
	return (
		<div className="my-4 flex flex-wrap">
			{!!sum && <FeatureBadge>{sum.toFixed(2)}</FeatureBadge>}

			{filtered?.map((item, i) => (
				<FeatureBadge
					key={i}
					score={item.coOccurrenceScore ?? item.featureMatchScore}
					variant={item.irrelevant ? "disabled" : item.type}
				>
					{item.label}
				</FeatureBadge>
			))}
		</div>
	);
}
