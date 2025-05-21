import { SearchForm } from "./components/search-form";
import { cookies } from "next/headers";
import { QdrantClient } from "@qdrant/js-client-rest";
import { vectorSpaces } from "@/data/db/vector-spaces";
import dayjs from "dayjs";

const client = new QdrantClient({
	url: process.env.QDRANT_URL,
	apiKey: process.env.QDRANT_API_KEY,
});

export default async function Home() {
	const cookieStore = cookies();
	const cookie = cookieStore.get("search-input");
	const searchInput =
		cookie && (JSON.parse(cookie.value) as Record<string, string>);

	const spaces = Object.values(vectorSpaces);
	const stats = await Promise.all(
		spaces.map(async (collection) => {
			const index = await client.getCollection(collection.collection);
			return {
				name: collection.collection,
				count: index.points_count ?? 0,
			};
		}),
	);

	return (
		<div>
			<SearchForm searchInput={searchInput} stats={stats} />
		</div>
	);
}
