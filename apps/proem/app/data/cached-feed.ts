import { unstable_cache } from "next/cache";
import { Feed } from "./feed";

export module CachedFeed {
	export const fromCollection = (
		...args: Parameters<typeof Feed.fromCollection>
	) =>
		unstable_cache(
			async () => {
				const feed = await Feed.fromCollection(...args);
				console.log("feed", feed);
				console.log([
					args[0],
					String(args[1].offset),
					args[2] ?? "anonymous",
					args[3] ?? "-",
				]);
				return feed;
			},
			[args[0], String(args[1].offset), args[2] ?? "anonymous", args[3] ?? "-"],
			{
				revalidate: false,
			},
		)();
}
