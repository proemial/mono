import {
	ANONYMOUS_USER_ID,
	PAPER_BOT_USER_ID,
	getPersonalDefaultCollection,
} from "@/app/constants";
import { followUpQuestionChain } from "@/app/llm/chains/follow-up-questions-chain";
import { findRun } from "@/app/llm/helpers/find-run";
import { answers } from "@proemial/data/repository/answer";
import { findCollection } from "@proemial/data/repository/collection";
import { savePostWithComment } from "@proemial/data/repository/post";
import type { Run } from "langsmith";

type SaveAnswerParams = {
	question: string;
	isFollowUpQuestion: boolean;
	slug: string;
	userId?: string;
	run: Run;
	spaceId: string | undefined;
};

/**
 * @deprecated Use `saveAnswerFromAgent` (below) instead
 */
export async function saveAnswer({
	question,
	isFollowUpQuestion,
	slug,
	userId,
	run,
	spaceId,
}: SaveAnswerParams) {
	const answer = findRun(run, (run) => run.name === "AnswerEngine")?.outputs
		?.output;

	const fetchedPapers = findRun(run, (run) => run.name === "FetchPapers")
		?.outputs?.output;

	// TODO: Store `keywords` instead of `keyConcept` and `relatedConcepts`
	const searchParamsResponse = findRun(
		run,
		(run) => run.name === "ExtractSynonymGroups",
	)?.outputs as { keyConcept: string; relatedConcepts: string[] };

	if (answer && fetchedPapers?.length && searchParamsResponse) {
		const papers = isFollowUpQuestion
			? {}
			: {
					relatedConcepts: searchParamsResponse.relatedConcepts,
					keyConcept: searchParamsResponse.keyConcept,
					papers: {
						papers: fetchedPapers,
					},
				};

		return answers.create({
			slug,
			question,
			answer,
			ownerId: userId,
			...papers,
		});
	}
}

export async function saveAnswerFromAgent({
	question,
	isFollowUpQuestion,
	slug,
	userId,
	run,
	spaceId,
}: SaveAnswerParams) {
	const answer = run.outputs?.returnValues?.output;
	const tool = run.inputs?.steps?.find(
		(step: { action: { tool?: string } }) =>
			step.action.tool === "SearchPapers",
	);
	const fetchedPapers = tool?.observation && JSON.parse(tool?.observation);

	if (answer) {
		const persistPapers = !isFollowUpQuestion && fetchedPapers?.length;
		const papers = persistPapers
			? {
					papers: {
						papers: fetchedPapers,
					},
				}
			: {};

		// Generate follow-ups
		const followUps = await followUpQuestionChain().invoke({
			question,
			answer,
		});

		// Save the post and the AI reply, if the user is signed in
		if (userId && spaceId) {
			const space =
				spaceId === userId
					? getPersonalDefaultCollection(userId)
					: await findCollection(spaceId);
			await savePostWithComment(
				{
					content: question,
					authorId: userId ?? ANONYMOUS_USER_ID, // TODO: Do this for all posts
					// Inherit the space's sharing setting, or `public` if no space
					shared: space?.shared ?? "public",
					spaceId: space?.id,
					slug,
				},
				{
					content: answer,
					authorId: PAPER_BOT_USER_ID,
					followUps: followUps
						.split("?")
						.filter((f) => typeof f !== "undefined" && f.length > 0)
						.map((f) => `${f.trim()}?`),
					papers: papers.papers?.papers,
				},
			);
		}

		return answers.create({
			slug,
			question,
			answer,
			ownerId: userId,
			...papers,
		});
	}
}
