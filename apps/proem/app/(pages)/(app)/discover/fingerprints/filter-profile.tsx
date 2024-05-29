import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import { Fingerprint, Types } from "./fingerprint";
import { Badge } from "@proemial/shadcn-ui/components/ui/badge";
import { X } from "lucide-react";

export function FilterProfile({
	fingerprints,
}: { fingerprints?: Fingerprint[] }) {
	return (
		<div className="my-4 flex flex-wrap">
			{fingerprints?.map((item, i) => (
				<FeatureBadge key={i} variant={item.type}>
					{`${item.count}x${item.label}: ${item.score.toFixed(2)}`}
				</FeatureBadge>
			))}
		</div>
	);
}

const variants = cva(
	"m-[1px]", // base styles
	{
		variants: {
			variant: {
				d: "bg-gray-100 text-gray-800",
				f: "bg-gray-900 text-gray-100",
				s: "bg-gray-600 text-gray-300",
				t: "bg-gray-300 text-gray-600",
				k: "bg-orange-200 text-gray-800",
				c: "bg-purple-200 text-gray-800",
			},
		},
		defaultVariants: {
			variant: "t",
		},
	},
);

function FeatureBadge({
	children,
	variant,
}: { children: ReactNode; variant: Types }) {
	return (
		<Badge
			className={variants({
				variant,
			})}
		>
			{children}
			{/* <BadgeClose /> */}
		</Badge>
	);
}

function BadgeClose() {
	return (
		<button
			type="button"
			className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
			// onKeyDown={(e) => {
			// 	if (e.key === "Enter") {
			// 		handleUnselect(option);
			// 	}
			// }}
			// onMouseDown={(e) => {
			// 	e.preventDefault();
			// 	e.stopPropagation();
			// }}
			// onClick={() => handleUnselect(option)}
		>
			<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
		</button>
	);
}
