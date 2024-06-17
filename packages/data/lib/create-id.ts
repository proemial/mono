import { createId as createCuid } from "@paralleldrive/cuid2";

export const seperator = "_";
export const prefixes = {
	collection: "col",
} as const;

export function createId(prefix?: keyof typeof prefixes): string {
	const id = createCuid();
	if (!prefix) {
		return id;
	}

	return `${prefixes[prefix]}${seperator}${id}`;
}

export const isCollectionId = (id: string) =>
	id.startsWith(`${prefixes.collection}${seperator}`);
