import { cva } from "class-variance-authority";
import { RankedFeature } from "./helpers/fingerprint";
import { Badge } from "@proemial/shadcn-ui/components/ui/badge";

type Props = {
	features?: RankedFeature[];
};

export function RankedFeatureCloud({ features }: Props) {
	return (
		<div className="my-4 flex flex-wrap">
			{features?.map((item, i) => (
				<Badge
					key={i}
					className={badgeStyle({
						variant: item.disabled ? "disabled" : item.type,
					})}
				>
					{`${item.count}x${item.label}: ${item.score.toFixed(2)}`}
				</Badge>
			))}
		</div>
	);
}

const badgeStyle = cva(
	"m-[1px] cursor-default", // hover:bg-opacity-80 cursor-pointer
	{
		variants: {
			variant: {
				topic: "hover:bg-gray-300 bg-gray-300 text-gray-600",
				keyword: "hover:bg-orange-200 bg-orange-200 text-gray-800",
				concept: "hover:bg-purple-200 bg-purple-200 text-gray-800",
				disabled: "hover:bg-gray-900 bg-gray-900 text-gray-600",
			},
		},
		defaultVariants: {
			variant: "topic",
		},
	},
);
