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
			{!!sum && <FeatureBadge>{sum.toFixed(3)}</FeatureBadge>}

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
			{score !== undefined && <>: {score ? score?.toFixed(3) : score}</>}
		</Badge>
	);
}

const badgeStyle = cva(
	"m-[1px] cursor-default text-gray-800", // hover:bg-opacity-80 cursor-pointer
	{
		variants: {
			variant: {
				default: "hover:bg-white bg-white rounded-sm mr-2 px-1",
				topic: "hover:bg-lime-600 bg-lime-600",
				keyword: "hover:bg-amber-600 bg-amber-600",
				concept: "hover:bg-rose-500 bg-rose-500",
				disabled: "hover:bg-gray-300 bg-gray-300",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);
