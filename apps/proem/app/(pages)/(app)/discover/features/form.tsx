"use client";
import { Button, Input } from "@proemial/shadcn-ui";
import { FeatureSet, getPaperFeatures } from "./get-features";
import { useFormState } from "react-dom";
import { ReactNode, useEffect, useState } from "react";
import { oaTopicsTranslationMap } from "@/app/data/oa-topics-compact";
import { cva } from "class-variance-authority";

type Types = "d" | "f" | "s" | "t" | "k" | "c";

export function FeatureForm() {
	const [featureSet, action] = useFormState(getPaperFeatures, null, "n/a");
	const [featureSets, setfeatureSets] = useState<FeatureSet[]>([]);

	useEffect(() => {
		if (featureSet) {
			for (const set of featureSet) {
				if (!featureSets.find((f) => f.id === set.id)) {
					setfeatureSets([...featureSets, set]);
				}
			}
		}
	}, [featureSet, featureSets]);

	const table = {} as {
		[key: string]: {
			id: string;
			label: string;
			type: Types;
			count: number;
			score: number;
		};
	};
	const ids = {
		topics: [] as string[],
		concepts: [] as string[],
		keywords: [] as string[],
	};

	for (const set of featureSets) {
		for (const item of set.topics) {
			// .slice(0, 1)) {
			const key = item.id;
			if (!ids.topics.includes(key)) {
				ids.topics.push(key);
			}

			const count = table[key]?.count ?? 0;
			const score = table[key]?.score ?? 0;
			const label = oaTopicsTranslationMap[item.id]?.["short-name"] as string;
			table[key] = {
				id: key,
				label,
				type: "t",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}

		for (const item of set.concepts) {
			const key = item.id;
			if (!ids.concepts.includes(key)) {
				ids.concepts.push(key);
			}

			const count = table[key]?.count ?? 0;
			const score = table[key]?.score ?? 0;
			table[key] = {
				id: key,
				label: item.display_name,
				type: "c",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}

		for (const item of set.keywords) {
			const key = item.id;
			if (!ids.keywords.includes(key)) {
				ids.keywords.push(key);
			}

			const count = table[key]?.count ?? 0;
			const score = table[key]?.score ?? 0;
			table[key] = {
				id: key,
				label: item.display_name,
				type: "k",
				count: count + 1,
				score: (score + item.score) / 2,
			};
		}
	}

	const filtered = Object.values(table)
		.filter(
			(item) =>
				// (featureSets.length === 1 || item.count > 1) &&
				item.score > 0.1,
		)
		.sort((a, b) => (a.score > b.score ? -1 : 1))
		.sort((a, b) => (a.count > b.count ? -1 : 1));

	const topics = filtered
		.filter((item) => item.type === "t")
		.map((item) => item.id.split("/").at(-1))
		.join("|");
	const concepts = filtered
		.filter((item) => item.type === "c")
		.map((item) => item.id.split("/").at(-1))
		.join("|");

	console.log(
		`https://api.openalex.org/works?sort=from_publication_date:desc&select=title,publication_date,primary_topic,keywords&filter=type:types/preprint|types/article,publication_date:%3C2024-05-28,publication_date:%3E2024-05-21,primary_topic.id:${topics},concepts.id:${concepts}`,
	);

	const handleDelete = (id: string) => {
		setfeatureSets(featureSets.filter((f) => f.id !== id));
	};

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
					<Badge
						key={i}
						variant={item.type}
						onClick={() => handleDelete(item.id)}
					>
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

function Badge({
	children,
	variant,
	onClick,
}: { children: ReactNode; variant: Types; onClick?: () => void }) {
	return (
		<span
			className={variants({
				variant,
			})}
			onClick={() => onClick?.()}
		>
			{children}
		</span>
	);
}
