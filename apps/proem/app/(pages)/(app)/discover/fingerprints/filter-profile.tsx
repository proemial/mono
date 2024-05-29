import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import { Fingerprint, Types } from "./fingerprint";

export function FilterProfile({
	fingerprints,
}: { fingerprints?: Fingerprint[] }) {
	return (
		<div className="mb-4 flex flex-wrap">
			{fingerprints?.map((item, i) => (
				<Badge key={i} variant={item.type}>
					{`${item.count}x${item.label}: ${item.score.toFixed(2)}`}
				</Badge>
			))}
		</div>
	);
}

const variants = cva(
	"px-2 py-1 text-xs rounded-full whitespace-nowrap m-[1px]", // base styles
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

function Badge({ children, variant }: { children: ReactNode; variant: Types }) {
	return (
		<span
			className={variants({
				variant,
			})}
		>
			{children}
		</span>
	);
}
