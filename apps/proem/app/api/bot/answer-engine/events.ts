import { Runnable } from "@langchain/core/runnables";
import { z } from "zod";

type ExtractData<T> = Extract<AnswerEngineEvents, { type: T }>["data"];

// Chain names it's safe to publish to the client
export const stepStartedEvents = ["FetchPapers", "GenerateAnswer"];
export const stepStartedEvent = z.object({
	type: z.literal("step-started"),
	data: z.object({
		name: z.string(),
	}),
});

export const answerSlugGeneratedEvent = z.object({
	type: z.literal("answer-slug-generated"),
	data: z.object({
		slug: z.string(),
	}),
});

export const answerSavedEvent = z.object({
	type: z.literal("answer-saved"),
	data: z.object({
		shareId: z.string().nullable(),
		answer: z.string(),
		runId: z.string(),
	}),
});

export const searchParamsGeneratedEvent = z.object({
	type: z.literal("search-params-generated"),
	data: z.object({
		keyConcept: z.string(),
		relatedConcepts: z.array(z.string()),
	}),
});

export const followUpQuestionsGeneratedEvent = z.object({
	type: z.literal("follow-up-questions-generated"),
	data: z.array(
		z.object({
			question: z.string(),
		}),
	),
});

const answerEngineEvents = z.discriminatedUnion("type", [
	stepStartedEvent,
	answerSlugGeneratedEvent,
	answerSavedEvent,
	searchParamsGeneratedEvent,
	followUpQuestionsGeneratedEvent,
]);

export type AnswerEngineEvents = z.infer<typeof answerEngineEvents>;

// TODO: could be infered better
function validateAnswerEngineEvent<
	TEvent extends z.infer<typeof answerEngineEvents>,
>(event: TEvent | unknown) {
	const parsedEvent = answerEngineEvents.safeParse(event);
	if (parsedEvent.success) {
		return parsedEvent.data;
	}
}

type ValidateTagsParames = {
	tags: string[] | undefined;
	data: unknown;
};

function validateTags({ tags, data }: ValidateTagsParames) {
	return tags
		?.map((type) => validateAnswerEngineEvent({ type, data }))
		.find(Boolean);
}

export function handleAnswerEngineEvents(
	{ tags, data }: ValidateTagsParames,
	onSuccessCallback: (event: z.infer<typeof answerEngineEvents>) => void,
) {
	const validEvent = validateTags({ tags, data });
	if (validEvent) {
		onSuccessCallback(validEvent);
	}
}

/**
 * Only returns the first event of the given event type.
 * For multiple events see {@link findAllByEventType}.
 */
export function findByEventType<T extends AnswerEngineEvents["type"]>(
	events: AnswerEngineEvents[] | undefined,
	type: T,
) {
	return events?.find((event) => event.type === type)?.data as
		| ExtractData<T>
		| undefined;
}

export function findAllByEventType<T extends AnswerEngineEvents["type"]>(
	events: AnswerEngineEvents[] | undefined,
	type: T,
) {
	return (
		events
			?.filter((event) => event.type === type)
			.map((event) => event.data as ExtractData<T>) ?? []
	);
}

export function withEventTag<
	TEventType extends AnswerEngineEvents["type"],
	TFunc extends Runnable<any, ExtractData<TEventType>, any>,
>(func: TFunc, tag: TEventType) {
	return func.withConfig({ tags: [tag] });
}
