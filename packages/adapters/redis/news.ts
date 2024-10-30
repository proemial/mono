import { Time } from "@proemial/utils/time";
import { UpStash } from "./upstash-client";

export const RedisNews = {
	get: async (identifier: string) => {
		const begin = Time.now();

		try {
			return (await UpStash.news().get(identifier)) as NewsItem | null;
		} finally {
			Time.log(begin, `[redis][news][get] ${identifier}`);
		}
	},

	set: async (identifier: string, item: NewsItem) => {
		const begin = Time.now();

		try {
			return await UpStash.news().set(identifier, item);
		} finally {
			Time.log(begin, `[redis][news][set] ${identifier}`);
		}
	},

	list: async () => {
		let keys = [] as string[];

		let begin = Time.now();
		try {
			keys = (
				await UpStash.newsFeed().scan(0, {
					count: 200,
				})
			)[1];
		} finally {
			Time.log(begin, "[redis][news][scan]");
		}

		begin = Time.now();
		try {
			const pipeline = UpStash.news().pipeline();
			for (const key of keys) {
				pipeline.get(key);
			}
			const results = await pipeline.exec();
			return results as NewsItem[];
		} finally {
			Time.log(begin, "[redis][news][mget]");
		}
	},
};

export function backgroundColor(item: NewsItem) {
	return item._?.background ?? "#000000";
}

export type NewsItem = {
	source?: NewsSource;
	references?: Array<ReferencedPaper>;
	generated?: NewsEnrichments;
	_?: {
		background?: string;
	};
};

export type NewsSource = {
	url: string;
	text: string;
	image: string;
	name: string;
	logo: string;
};

export type NewsEnrichments = {
	title: string;
	background: string;
	questions: Array<[string, string]>;
};

export type ReferencedPaper = {
	id: string;
	title: string;
	abstract: string;
	primary_location: {
		source: {
			display_name: string;
			host_organization_name: string;
		};
		landing_page_url: string;
	};
	authorships: Array<{
		author: {
			id: string;
			display_name: string;
		};
	}>;
	created: string;
	published: string;
};
