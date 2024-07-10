import { uuid } from "@proemial/utils/uid";

export const seperator = "_";
export const prefixes = {
	collection: "col",
} as const;

export function createId(prefix?: keyof typeof prefixes): string {
	const id = uuid();
	if (!prefix) {
		return id;
	}

	return `${prefixes[prefix]}${seperator}${id}`;
}
