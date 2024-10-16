import { RedisSummaries } from "../../redis/summaries";
import { Redis } from "../../redis";
import {
	summariseTitle,
	model as titleModel,
	prompt as titlePrompt,
} from "../prompts/microtitle";
import {
	model as descriptionModel,
	prompt as descriptionPrompt,
	summariseDescription,
} from "../prompts/description";

export async function getSummaries(
	identifier: string,
	title: string,
	abstract: string,
): Promise<RedisSummaries> {
	const cached = await Redis.summaries.get(identifier);
	if (cached && isValid(cached, title, abstract)) {
		return cached;
	}

	return await RedisSummaries.insert(identifier, {
		title: {
			summary: await summariseTitle(title, abstract),
			hash: hashSummary(title, abstract, titleModel, titlePrompt),
		},
		description: {
			summary: await summariseDescription(title, abstract),
			hash: hashSummary(title, abstract, descriptionModel, descriptionPrompt),
		},
	});
}

function isValid(cached: RedisSummaries, title: string, abstract: string) {
	if (
		hashSummary(title, abstract, titleModel, titlePrompt) !== cached.title?.hash
	) {
		return false;
	}
	if (
		hashSummary(title, abstract, descriptionModel, descriptionPrompt) !==
		cached.description?.hash
	) {
		return false;
	}

	return true;
}

function hashSummary(
	title: string,
	abstract: string,
	model: string,
	prompt: (title: string, abstract: string) => string,
): string {
	const input = `${model}${prompt(title, abstract)}`;

	return require("node:crypto")
		.createHash("sha256")
		.update(input)
		.digest("hex");
}
