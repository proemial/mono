import {
	OpenAlexPaper,
	getIdFromOpenAlexPaper,
} from "@proemial/papers/oa/open-alex.models";
import { Time } from "@proemial/utils/time";
import { UpStash } from "./upstash-client";

export type Prefix = "oa" | "arxiv";

export const OpenAlexPapers = {
	get: async (id: string, prefix: Prefix = "oa") => {
		try {
			return (await UpStash.papers().get(
				`${prefix}:${id}`,
			)) as OpenAlexPaper | null;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	getAll: async (ids: string[], prefix: Prefix = "oa") => {
		try {
			return (await UpStash.papers().mget(
				ids.map((id) => `${prefix}:${id}`),
			)) as (OpenAlexPaper | null)[];
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	pushAll: async (
		papers: OpenAlexPaper | Array<OpenAlexPaper>,
		prefix: Prefix = "oa",
	) => {
		if (Array.isArray(papers) && papers.length < 1) {
			return;
		}
		const papersArray = Array.isArray(papers) ? papers : [papers];

		const begin = Time.now();
		try {
			console.log("[pushAll] pushing", papersArray.length, "papers");
			const pipeline = UpStash.papers().pipeline();
			for (const paper of papersArray) {
				const id = getIdFromOpenAlexPaper(paper);
				pipeline.set(`${prefix}:${id}`, { ...paper, id });
			}

			await pipeline.exec();
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			Time.log(begin, `[pushAll] ${papersArray.length} papers`);
		}
	},

	upsert: async (
		id: string,
		appendFn: (existingPaper: OpenAlexPaper) => OpenAlexPaper,
		prefix: Prefix = "oa",
	) => {
		try {
			const redisPaper = (await UpStash.papers().get(
				`${prefix}:${id}`,
			)) as OpenAlexPaper;

			const updatedPaper = appendFn(redisPaper || {});

			console.log("[upsert] pushing paper", id);
			await UpStash.papers().set(`${prefix}:${id}`, updatedPaper);

			return updatedPaper;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	upsertAll: async (
		papers: OpenAlexPaper | Array<OpenAlexPaper>,
		prefix: Prefix = "oa",
	) => {
		if (Array.isArray(papers) && papers.length < 1) {
			return;
		}

		const papersArray = Array.isArray(papers) ? papers : [papers];

		try {
			const pipeline = UpStash.papers().pipeline();
			for (const paper of papersArray) {
				const id = getIdFromOpenAlexPaper(paper);
				pipeline.get(`${prefix}:${id}`);
			}
			const dbPapers = await pipeline.exec<OpenAlexPaper[]>();

			const dbPaperIds = dbPapers.map((paper) => paper?.id);
			const missingPapers = papersArray.filter(
				(paper) => !dbPaperIds.includes(paper?.id),
			);

			if (missingPapers.length > 0) {
				await OpenAlexPapers.pushAll(missingPapers);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};
