"use server";
import { getPaperId } from "@/utils/oa-paper";
import { fetchPaper } from "../../paper/oa/[id]/fetch-paper";
import { getFingerprint } from "./fingerprint";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function getFingerprints(prev: any, formData: any) {
	const identifiers = formData.get("identifier").split(",");
	return await Promise.all(identifiers.map(getFingerprintForPaper));
}

export async function getFingerprintForPaper(identifier: string) {
	const paperId = await getPaperId(identifier);

	if (!paperId) {
		return undefined;
	}

	const paper = await fetchPaper(paperId);
	console.log(paper?.data.keywords);

	return getFingerprint(paper);
}
