import { Runnable } from "@langchain/core/runnables";
import { z } from "zod";

type ExtractData<T> = Extract<AnswerEngineEvents, { type: T }>["data"];

export function createEvent<T extends AnswerEngineEvents["type"]>(type: T) {
	return (data: Extract<AnswerEngineEvents, { type: T }>["data"]) => ({
		type,
		data,
	});
}

export function findByEventType<T extends AnswerEngineEvents["type"]>(
	events: AnswerEngineEvents[] | undefined,
	type: T,
) {
	return events?.find((event) => event.type === type)?.data as
		| ExtractData<T>
		| undefined;
}

export function withEventTag<
	TEventType extends AnswerEngineEvents["type"],
	TFunc extends Runnable<any, ExtractData<TEventType>, any>,
>(func: TFunc, tag: TEventType) {
	return func.withConfig({ tags: [tag] });
}

export const ANSWER_SLUG_GENERATED = z.literal("answer-slug-generated");
export const answerSlugGeneratedEvent = z.object({
	type: ANSWER_SLUG_GENERATED,
	data: z.object({
		slug: z.string(),
	}),
});

export const ANSWER_SAVED = z.literal("answer-saved");
export const answerSavedEvent = z.object({
	type: ANSWER_SAVED,
	data: z.object({
		shareId: z.string().nullable(),
		answer: z.string(),
	}),
});

export const SEARCH_PARAMS_GENERATED = z.literal("search-params-generated");
export const searchParamsGeneratedEvent = z.object({
	type: SEARCH_PARAMS_GENERATED,
	data: z.object({
		keyConcept: z.string(),
		relatedConcepts: z.array(z.string()),
	}),
});

export const createAnswerSlugEvent = createEvent(ANSWER_SLUG_GENERATED.value);
export const createSaveAnswerEvent = createEvent(ANSWER_SAVED.value);
