import { cva } from "class-variance-authority";
import { Badge } from "@proemial/shadcn-ui/components/ui/badge";
import { RankedFeature } from "@/components/fingerprints/features";
import { FeatureBadge } from "./feature-badge";

const DEBUG = false;

type Props = {
	features?: RankedFeature[];
};

export function FeatureCloud({ features }: Props) {
	return (
		<div className="my-4 flex flex-wrap">
			{features?.map((item, i) => (
				<FeatureBadge
					key={i}
					score={item.coOccurrenceScore}
					variant={item.irrelevant ? "disabled" : item.type}
				>
					{item.label}
				</FeatureBadge>
			))}
		</div>
	);
}
