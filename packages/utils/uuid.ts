import { v5 as uuidV5, v4 as uuidV4 } from "uuid";
import { customAlphabet } from "nanoid";

const namespaces = {
	qdrant: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
	helicone: "123e4567-e89b-12d3-a456-426614174000",
	chat: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
};

export function uuid4() {
	return uuidV4();
}

export function uuid5(id: string, namespace: keyof typeof namespaces) {
	return uuidV5(id, namespaces[namespace]);
}

// Id prefixes and the length of their generated suffix
// E.g. all source reference ids will be like this: src_ref_1a2b3c
// Inspired by https://www.unkey.com/blog/uuid-ux
const PREFIXES = {
	source_reference: ["src_ref", 6],
} as const;

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; // Without disambiguating characters

export function newId(prefix: keyof typeof PREFIXES) {
	const nanoid = customAlphabet(ALPHABET);
	return [PREFIXES[prefix][0], nanoid(PREFIXES[prefix][1])].join("_");
}

export function isId(id: string) {
	return Object.values(PREFIXES).some(([prefix, suffixLength]) => {
		const pattern = new RegExp(`^${prefix}_\\w{${suffixLength}}$`);
		return pattern.test(id);
	});
}
