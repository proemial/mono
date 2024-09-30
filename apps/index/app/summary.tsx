"use server";
import { summarise } from "@/inngest/helpers/summarise";
import { SearchResult as Item } from "./search-action";

export async function Summary({ item }: { item: Item }) {
	const summarised = (await summarise(item.title, item.abstract)) as string;

	return <div className="text-xl">{summarised}</div>;
}
