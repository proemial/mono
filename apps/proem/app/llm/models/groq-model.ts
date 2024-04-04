import { ChatGroq, ChatGroqInput } from "@langchain/groq";
import { COMMON_MODEL_DEFAULTS } from "./model-options";

type GroqModel = "llama2-70b-4096" | "mixtral-8x7b-32768";

export const buildGroqChatModel = (
	modelName: GroqModel,
	options?: ChatGroqInput,
) =>
	new ChatGroq({
		...COMMON_MODEL_DEFAULTS,
		...options,
		modelName,
	});
