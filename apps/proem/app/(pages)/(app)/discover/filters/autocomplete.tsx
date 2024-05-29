"use client";
import MultipleSelector, {
	Option,
} from "@proemial/shadcn-ui/components/ui/multiple-selector";
import React from "react";
// import { InlineCode } from '@/components/ui/inline-code';

const OPTIONS: Option[] = [
	{ label: "nextjs", value: "Nextjs" },
	{ label: "React", value: "react" },
	{ label: "Remix", value: "remix" },
	{ label: "Vite", value: "vite" },
	{ label: "Nuxt", value: "nuxt" },
	{ label: "Vue", value: "vue" },
	{ label: "Svelte", value: "svelte" },
	{ label: "Angular", value: "angular" },
	{ label: "Ember", value: "ember" },
	{ label: "Gatsby", value: "gatsby" },
	{ label: "Astro", value: "astro" },
];

const mockSearch = async (value: string): Promise<Option[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const res = OPTIONS.filter((option) => option.value.includes(value));
			resolve(res);
		}, 1000);
	});
};

const MultipleSelectorDemo = () => {
	return (
		<div className="flex w-full flex-col gap-5">
			<MultipleSelector
				onSearch={async (value) => await mockSearch(value)}
				placeholder="trying to search 'a' to get more options..."
				loadingIndicator={
					<p className="py-2 text-center text-lg leading-10 text-muted-foreground">
						loading...
					</p>
				}
				emptyIndicator={
					<p className="w-full text-center text-lg leading-10 text-muted-foreground">
						no results found.
					</p>
				}
			/>
		</div>
	);
};

export default MultipleSelectorDemo;
