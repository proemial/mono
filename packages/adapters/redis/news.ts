import { Time } from "@proemial/utils/time";
import { UpStash } from "./upstash-client";

export const RedisNews = {
	get: async (identifier: string) => {
		const begin = Time.now();

		try {
			return (await UpStash.news().get(identifier)) as NewsItem | null;
		} finally {
			Time.debug(begin, `[redis][news][get] ${identifier}`);
		}
	},

	set: async (identifier: string, item: NewsItem) => {
		const begin = Time.now();

		try {
			return await UpStash.news().set(identifier, item);
		} finally {
			Time.debug(begin, `[redis][news][set] ${identifier}`);
		}
	},

	list: async () => {
		const begin = Time.now();
		try {
			const keys = await UpStash.news().scan(0, {
				count: 100,
			});
			console.log(keys);

			return (await UpStash.news().mget(keys[1])) as NewsItem[];
		} finally {
			Time.debug(begin, "[redis][news][scan]");
		}
	},
};

export type NewsItem = {
	source?: NewsSource;
	references?: Array<ReferencedPaper>;
	generated?: NewsEnrichments;
	_?: {
		public: boolean;
		background: string;
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
