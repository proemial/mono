"use client";
import { Button, Input } from "@proemial/shadcn-ui";
import { getFingerprintForPaper, getFingerprints } from "./get-features";
import { useFormState } from "react-dom";
import { ReactNode, useEffect, useState } from "react";
import { cva } from "class-variance-authority";
import { useRouter, useSearchParams } from "next/navigation";
import { Fingerprint, getFingerprintFilter } from "./fingerprint";

export function FeatureForm() {
	const [fingerprint, action] = useFormState(getFingerprints, null, "n/a");
	const [fingerprints, setFingerprints] = useState<Fingerprint[]>([]);

	const router = useRouter();
	const searchParams = useSearchParams();
	const filter = searchParams.get("filter") ?? "";

	useEffect(() => {
		if (filter) {
			// declare the data fetching function
			const fetchData = async () => {
				const identifiers = filter.split(",");
				const features = await Promise.all(
					identifiers.map(getFingerprintForPaper),
				);
				console.log("features", features);

				setFingerprints(features.filter((f) => !!f) as Fingerprint[]);
			};

			fetchData().catch(console.error);
		}
	}, [filter]);

	useEffect(() => {
		if (fingerprint) {
			for (const set of fingerprint) {
				if (!fingerprints.find((f) => f.id === set.id)) {
					setFingerprints([...fingerprints, set]);
				}
			}
		}
	}, [fingerprint, fingerprints]);

	const filtered = getFingerprintFilter(fingerprints);

	// https://api.openalex.org/works?sort=from_publication_date:desc&select=title,publication_date,primary_topic,keywords&filter=type:types/preprint|types/article,publication_date:%3C2024-05-28,publication_date:%3E2024-05-21,primary_topic.id:$$,concepts.id:$$
	// w4385245566,w4226278401,w4384918448,w4386437475,
	// w4385245566,w4226278401,w4384918448,w4386437475,w4378771755,w4225591000,w3001279689,w4360836968

	// w4385245566,w4226278401,w4384918448,w4386437475,w4378771755,w4225591000,w3001279689,w4360836968,
	// w4221143046,w4377130677,w4388926587,w3027879771,w4313304293,w3094502228,w3166396011,w4386076097,
	// w4386655647,w4366330503,w4378510493,w4229042118,w4388844352,w4320165837,w4378718568,w4385474529,
	// w4383473937,w4385374425,w4393157467,w4388886073,w4367701241,w4321472284
	return (
		<form action={action}>
			<div className="flex flex-col gap-2">
				<Input
					name="identifier"
					placeholder="Identifier"
					className="grow bg-white dark:bg-neutral-600"
					defaultValue={filter}
				/>

				<div className="flex mb-2 w-full justify-between">
					<div>
						<Badge variant="t">
							<i className="text-gray-500">topic</i>
						</Badge>
						<Badge variant="k">
							<i className="text-gray-500">keyword</i>
						</Badge>
						<Badge variant="c">
							<i className="text-gray-500">concept</i>
						</Badge>
					</div>
					<Button type="submit" className="text-xs tracking-wider">
						Find paper
					</Button>
				</div>
			</div>
			<div className="mb-4 flex flex-wrap">
				{filtered.map((item, i) => (
					<Badge key={i} variant={item.type}>
						{`${item.count}x${item.label}: ${item.score.toFixed(2)}`}
					</Badge>
				))}
			</div>
		</form>
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
