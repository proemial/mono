import { createId as createCuid } from "@paralleldrive/cuid2";

const prefixes = {
	collection: "col",
} as const;

export function createId(prefix?: keyof typeof prefixes): string {
	const id = createCuid();
	if (!prefix) {
		return id;
	}

	return `${prefixes[prefix]}_${id}`;
}
