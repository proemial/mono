import type { Runnable } from "@langchain/core/runnables";
import { z } from "zod";

type ExtractData<T> = Extract<AnswerEngineEvents, { type: T }>["data"];

// Chain names it's safe to publish to the client
export const stepStartedEvents = ["FetchPapers", "GenerateAnswer"];
export const stepStartedEvent = z.object({
	type: z.literal("step-started"),
	transactionId: z.string(),
	data: z.object({
		name: z.string(),
	}),
});

export const answerSlugGeneratedEvent = z.object({
	type: z.literal("answer-slug-generated"),
	transactionId: z.string(),
	data: z.object({
		slug: z.string(),
	}),
});

export const answerSavedEvent = z.object({
	type: z.literal("answer-saved"),
	transactionId: z.string(),
	data: z.object({
		shareId: z.string().nullable(),
		runId: z.string(),
	}),
});

export const searchParamsGeneratedEvent = z.object({
	type: z.literal("search-params-generated"),
	transactionId: z.string(),
	data: z.object({
		keyConcept: z.string(),
		relatedConcepts: z.array(z.string()),
	}),
});

export const followUpQuestionsGeneratedEvent = z.object({
	type: z.literal("follow-up-questions-generated"),
	transactionId: z.string(),
	data: z.array(
		z.object({
			question: z.string(),
		}),
	),
});

export const agentSelectedToolEvent = z.object({
	type: z.literal("agent-selected-tool"),
	transactionId: z.string(),
	data: z.object({
		tool: z.string(),
	}),
});

export const papersFetchedEvent = z.object({
	type: z.literal("papers-fetched"),
	transactionId: z.string(),
	data: z.object({
		papers: z.array(
			z.object({
				link: z.string(),
				title: z.string(),
				published: z.string().optional(),
			}),
		),
	}),
});

const answerEngineEvents = z.discriminatedUnion("type", [
	stepStartedEvent,
	answerSlugGeneratedEvent,
	answerSavedEvent,
	searchParamsGeneratedEvent,
	followUpQuestionsGeneratedEvent,
	agentSelectedToolEvent,
	papersFetchedEvent,
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
	transactionId?: string,
) {
	return events?.find((event) => {
		if (transactionId) {
			return event.type === type && event.transactionId === transactionId;
		}
		return event.type === type;
	})?.data as ExtractData<T> | undefined;
}

/**
 * Finds the latest event of the given event type and returns its index and all follow-up events.
 * Consider use {@link findByEventType} if you only need a single event & know the transactionId.
 */
export function findLatestByEventType<T extends AnswerEngineEvents["type"]>(
	events: AnswerEngineEvents[] | undefined,
	type: T,
): { index: number; hits: ExtractData<T>[] } {
	if (!events) return { index: 0, hits: [] };

	// @ts-ignore
	const index = events.findLastIndex(
		// This is a little hacky as it's based on the assumtion the "answer-slug-generated" event is always
		// the first event of a new answer. This is true for now, but shouldn't be as it's not generated on each
		// request but only on the first question. It's just using the existing slug on follow-ups and we shouldn't emmit
		// a generated event for that.
		(event: AnswerEngineEvents) => event.type === "answer-slug-generated",
	);
	const hits =
		[...events]
			.slice(index)
			.filter((event) => event.type === type)
			.map((event) => event.data as ExtractData<T>) ?? [];

	return { index, hits };
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
