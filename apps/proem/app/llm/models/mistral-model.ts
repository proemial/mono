import { ChatMistralAI, ChatMistralAIInput } from "@langchain/mistralai";
import { COMMON_MODEL_DEFAULTS } from "./model-options";

type MistralModel =
	| "open-mistral-7b"
	| "mistral-tiny-2312"
	| "mistral-tiny"
	| "open-mixtral-8x7b"
	| "mistral-small-2312"
	| "mistral-small"
	| "mistral-small-2402"
	| "mistral-small-latest"
	| "mistral-medium-latest"
	| "mistral-medium-2312"
	| "mistral-medium"
	| "mistral-large-latest"
	| "mistral-large-2402"
	| "mistral-embed";

// The type-casting is far from ideal, but it fixes the TypeScript "cannot be named" error
export const buildMistralChatModel = <T extends ChatMistralAI<never>>(
	modelName: MistralModel,
	options?: ChatMistralAIInput,
) =>
	new ChatMistralAI({
		...COMMON_MODEL_DEFAULTS,
		...options,
		modelName,
	}) as T;
