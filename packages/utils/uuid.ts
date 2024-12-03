import { v5 as uuid } from "uuid";

const namespaces = {
	qdrant: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
	helicone: "123e4567-e89b-12d3-a456-426614174000",
	chat: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
};

export function uuid5(id: string, namespace: keyof typeof namespaces) {
	return uuid(id, namespaces[namespace]);
}
