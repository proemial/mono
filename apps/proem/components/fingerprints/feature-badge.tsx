import { cva } from "class-variance-authority";
import { Badge } from "@proemial/shadcn-ui/components/ui/badge";

export function FeatureBadge({
	children,
	score,
	variant,
}: {
	children: string;
	score?: number;
	variant?: "topic" | "keyword" | "concept" | "disabled";
}) {
	return (
		<Badge
			className={badgeStyle({
				variant,
			})}
		>
			{`${children}${score ? `: ${score?.toFixed(2)}` : ""}`}
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
				disabled: "hover:bg-gray-900 bg-gray-900 text-gray-600",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);
