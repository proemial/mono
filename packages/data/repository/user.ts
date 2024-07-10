import { neonDb } from "..";

export async function getAllUserIds() {
	const collections = await neonDb.query.collections.findMany();
	return collections.map((collection) => collection.id);
}
