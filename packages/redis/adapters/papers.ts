import {
	OpenAlexPaper,
	getIdFromOpenAlexPaper,
} from "../../repositories/oa/models/oa-paper";
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

	// ["oa:W4402559402","oa:W4402559416","oa:W4402559718","oa:W4402559769","oa:W4402560002","oa:W4402560539","oa:W4402561279","oa:W4402561739","oa:W4402562273","oa:W4402562848","oa:W4402562881","oa:W4402562886","oa:W4402562914","oa:W4402562936","oa:W4402563251","oa:W4402563294","oa:W4402563477","oa:W4402563508","oa:W4402563582","oa:W4402563856","oa:W4402564499","oa:W4402564720","oa:W4402564961","oa:W4402566229","oa:W4402567069","oa:W4402567309","oa:W4402567358","oa:W4402567378","oa:W4402567410","oa:W4402567506","oa:W4402567640","oa:W4402567691","oa:W4402567707","oa:W4402567719","oa:W4402567760","oa:W4402567910","oa:W4402568128","oa:W4402568605","oa:W4402570141","oa:W4402571903","oa:W4402571909","oa:W4402573254","oa:W4402573466","oa:W4402573848","oa:W4402573956","oa:W4402574331","oa:W4402574412","oa:W4402574421","oa:W4402574641","oa:W4402574711","oa:W4402574771","oa:W4402574781","oa:W4402574791","oa:W4402575182","oa:W4402575290","oa:W4402575461","oa:W4402575951","oa:W4402575992","oa:W4402576213","oa:W4402576663","oa:W4402576679","oa:W4402576705","oa:W4402576898","oa:W4402576914","oa:W4402576917","oa:W4402576922","oa:W4402576929","oa:W4402576941","oa:W4402576951","oa:W4402576991","oa:W4402577335","oa:W4402577815","oa:W4402577997","oa:W4402578294","oa:W4402579837","oa:W4402580249","oa:W4402580454","oa:W4402580589","oa:W4402580920","oa:W4402580950","oa:W4402581050","oa:W4402581277","oa:W4402581648","oa:W4402581718","oa:W4402581862","oa:W4402581867","oa:W4402581884","oa:W4402581954","oa:W4402581960","oa:W4402582105","oa:W4402582186","oa:W4402582205","oa:W4402582286","oa:W4402582340","oa:W4402582345","oa:W4402582375","oa:W4402583339","oa:W4402583373","oa:W4402583522","oa:W4402583965","oa:W4402584245","oa:W4402584451","oa:W4402584687","oa:W4402584889","oa:W4402585661","oa:W4402586946","oa:W4402589945","oa:W4402591493","oa:W4402595535","oa:W4402595593","oa:W4402595661","oa:W4402595848","oa:W4402595850","oa:W4402596007","oa:W4402597114","oa:W4402597550","oa:W4402597795","oa:W4402598360","oa:W4402598391","oa:W4402598432","oa:W4402598441","oa:W4402598578","oa:W4402599419","oa:W4402599430","oa:W4402599503","oa:W4402599691","oa:W4402599960","oa:W4402600051","oa:W4402600065","oa:W4402600895","oa:W4402601138","oa:W4402601366","oa:W4402601410","oa:W4402603482","oa:W4402605438","oa:W4402615117","oa:W4402615360","oa:W4402615598","oa:W4402616394","oa:W4402616507","oa:W4402616581","oa:W4402616737","oa:W4402616800","oa:W4402617300","oa:W4402617949","oa:W4402620534","oa:W4402622559","oa:W4402622612","oa:W4402623793","oa:W4402626006","oa:W4402627461","oa:W4402628087","oa:W4402628539","oa:W4402629659","oa:W4402640542","oa:W4402641521","oa:W4402645734","oa:W4402648299","oa:W4402648912","oa:W4402651781","oa:W4402653246","oa:W4402653544","oa:W4402655214","oa:W4402657960","oa:W4402658782","oa:W4402660826","oa:W4402664597","oa:W4402666377","oa:W4402690307","oa:W4402698197","oa:W4402705710","oa:W4402710373","oa:W4402713838","oa:W4402723255","oa:W4402725565","oa:W4402729096","oa:W4402730787","oa:W4402733870","oa:W4402735959","oa:W4402769957","oa:W4402786031"]
	getAll: async (ids: string[], prefix: Prefix = "oa") => {
		if (ids.length < 1) {
			return [];
		}
		console.log("MGET", JSON.stringify(ids.map((id) => `${prefix}:${id}`)));
		const begin = Time.now();

		try {
			const chunkSize = 30;
			const chunks = [];
			for (let i = 0; i < ids.length; i += chunkSize) {
				chunks.push(ids.slice(i, i + chunkSize));
			}

			const results = await Promise.all(
				chunks.map((chunk) =>
					UpStash.papers().mget(chunk.map((id) => `${prefix}:${id}`)),
				),
			);

			return results.flat() as (OpenAlexPaper | null)[];
		} catch (error) {
			console.error(error);
			console.error(
				"MGET ERROR",
				JSON.stringify(ids.map((id) => `${prefix}:${id}`)),
			);
			throw error;
		} finally {
			Time.log(begin, `[redis][getAll] ${ids.length} papers`);
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
			console.log("[upsertAll] fetched", dbPapers.length, "papers");

			// Update existing papers
			const updatePipeline = UpStash.papers().pipeline();
			for (const paper of dbPapers) {
				if (!paper) continue;
				const updated = papersArray.find((p) => p.id === paper.id);
				updatePipeline.set(`${prefix}:${paper.id}`, {
					...paper,
					...updated,
				});
			}
			if (updatePipeline.length() > 0) {
				await updatePipeline.exec<OpenAlexPaper[]>();
			}

			// Push missing papers
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
