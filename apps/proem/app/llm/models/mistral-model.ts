import { ChatMistralAI } from "@langchain/mistralai";
import { ModelOptions } from "./model-options";

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

// export const buildMistralModel = (
// 	modelName: MistralModel,
// 	options?: ModelOptions,
// ) =>
// 	new ChatMistralAI({
// 		apiKey: Env.get("MISTRAL_API_KEY"),
// 		modelName,
// 		temperature: options?.temperature ?? 0.0,
// 		cache: options?.cache ?? true,
// 		verbose: options?.verbose ?? false,
// 		onFailedAttempt: (error) => {
// 			console.error(error);
// 		},
// 	});
