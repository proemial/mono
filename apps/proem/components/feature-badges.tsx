import { cva } from "class-variance-authority";
import { Badge } from "@proemial/shadcn-ui/components/ui/badge";
import { FeatureType } from "@proemial/repositories/oa/fingerprinting/features";

type CloudProps = {
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

export function FeatureCloud({ features, sum }: CloudProps) {
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

type BadgeProps = {
	children: string;
	score?: number;
	variant?: FeatureType | "disabled";
};

export function FeatureBadge({ children, score, variant }: BadgeProps) {
	return (
		<Badge
			className={badgeStyle({
				variant,
			})}
		>
			{children}
			{score !== undefined && <>: {score ? score?.toFixed(2) : score}</>}
		</Badge>
	);
}

const badgeStyle = cva(
	"m-[1px] cursor-default", // hover:bg-opacity-80 cursor-pointer
	{
		variants: {
			variant: {
				default: "hover:bg-white bg-white text-gray-800 rounded-sm mr-2 px-1",
				topic: "hover:bg-gray-300 bg-gray-300 text-gray-600",
				keyword: "hover:bg-orange-200 bg-orange-200 text-gray-800",
				concept: "hover:bg-purple-200 bg-purple-200 text-gray-800",
				disabled: "hover:bg-gray-100 bg-gray-100 text-gray-300",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);
