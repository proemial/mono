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

export const ANSWER_SLUG_GENERATED = z.literal("answer-slug-generated");
export const answerSlugGeneratedEvent = z.object({
	type: ANSWER_SLUG_GENERATED,
	data: z.object({
		slug: z.string(),
	}),
});
type AnswerSlugGeneratedEvent = z.infer<typeof answerSlugGeneratedEvent>;

export const ANSWER_SAVED = z.literal("answer-saved");
export const answerSavedEvent = z.object({
	type: ANSWER_SAVED,
	data: z.object({
		shareId: z.string().nullable(),
		answer: z.string(),
	}),
});
type AnswerSavedEvent = z.infer<typeof answerSavedEvent>;

export type AnswerEngineEvents = AnswerSlugGeneratedEvent | AnswerSavedEvent;

export const createAnswerSlugEvent = createEvent(ANSWER_SLUG_GENERATED.value);
export const createSaveAnswerEvent = createEvent(ANSWER_SAVED.value);
