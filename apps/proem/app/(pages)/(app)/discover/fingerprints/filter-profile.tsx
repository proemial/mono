import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import { Fingerprint, Types } from "./fingerprint";
import { Badge } from "@proemial/shadcn-ui/components/ui/badge";

type Props = {
	fingerprints?: Fingerprint[];
};

export function FingerprintCloud({ fingerprints }: Props) {
	return (
		<div className="my-4 flex flex-wrap">
			{fingerprints?.map((item, i) => (
				<Badge key={i} className={badgeStyle({ variant: item.type })}>
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
			},
		},
		defaultVariants: {
			variant: "topic",
		},
	},
);
