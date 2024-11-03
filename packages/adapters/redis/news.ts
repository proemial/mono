import { Time } from "@proemial/utils/time";
import { UpStash } from "./upstash-client";

// craping, querying, analyzing, building, asking, summoning magic, casting spells…
export const RedisNews = {
	get: async (identifier: string) => {
		const begin = Time.now();

		try {
			return (await UpStash.news().json.get(identifier)) as
				| NewsAnnotatorSteps
				| undefined;
		} finally {
			Time.log(begin, `[redis][news][get] ${identifier}`);
		}
	},

	set: async (identifier: string, item: NewsAnnotatorInputStep) => {
		const begin = Time.now();

		try {
			const { name, ...rest } = item;
			await UpStash.news().json.set(identifier, "$", { [name]: rest });
			return await RedisNews.get(identifier);
		} finally {
			Time.log(begin, `[redis][news][set] ${identifier}`);
		}
	},

	update: async (identifier: string, item: NewsAnnotatorInputStep) => {
		const begin = Time.now();

		try {
			const { name, ...rest } = item;
			await UpStash.news().json.set(identifier, `$.${name}`, rest);
			return await RedisNews.get(identifier);
		} finally {
			Time.log(begin, `[redis][news][update] ${identifier}`);
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
				pipeline.json.get(key);
			}
			const results = await pipeline.exec();
			return results as NewsAnnotatorSteps[];
		} finally {
			Time.log(begin, "[redis][news][mget]");
		}
	},
};

export function backgroundColor(background?: string) {
	return background ?? "#000000";
}

export type NewsAnnotatorStepItem =
	| NewsAnnotatorInitStep
	| NewsAnnotatorScrapeStep
	| NewsAnnotatorQueryStep
	| NewsAnnotatorPapersStep
	| NewsAnnotatorSummariseStep;

export type NewsAnnotatorSteps = {
	init?: NewsAnnotatorInitStep;
	scrape?: NewsAnnotatorScrapeStep;
	query?: NewsAnnotatorQueryStep;
	papers?: NewsAnnotatorPapersStep;
	summarise?: NewsAnnotatorSummariseStep;
};

export type NewsAnnotatorInputStep =
	| NewsAnnotatorInitInputStep
	| NewsAnnotatorScrapeInputStep
	| NewsAnnotatorQueryInputStep
	| NewsAnnotatorPapersInputStep
	| NewsAnnotatorSummariseInputStep;

export type NewsAnnotatorInitInputStep = NewsAnnotatorInitStep & {
	name: "init";
};
export type NewsAnnotatorInitStep = {
	url: string;
	host: string;
	logo: string;
	background?: string;
	sort?: number;
};

export type NewsAnnotatorScrapeInputStep = NewsAnnotatorScrapeStep & {
	name: "scrape";
};
export type NewsAnnotatorScrapeStep = {
	transcript: string;
	title?: string;
	artworkUrl?: string;
	date?: string;
};
export type NewsAnnotatorQueryInputStep = NewsAnnotatorQueryStep & {
	name: "query";
};
export type NewsAnnotatorQueryStep = {
	value: string;
};
export type NewsAnnotatorPapersInputStep = NewsAnnotatorPapersStep & {
	name: "papers";
};
export type NewsAnnotatorPapersStep = {
	value: Array<ReferencedPaper>;
};
export type NewsAnnotatorSummariseInputStep = NewsAnnotatorSummariseStep & {
	name: "summarise";
};
export type NewsAnnotatorSummariseStep = {
	commentary: string;
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
