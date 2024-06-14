import { createId as createCuid } from "@paralleldrive/cuid2";

const prefixes = {
	collection: "col",
} as const;

export function createId(prefix: keyof typeof prefixes): string {
	return `${prefixes[prefix]}_${createCuid()}`;
}
