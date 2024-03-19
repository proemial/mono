import { ChatGroq } from "@langchain/groq";
import { ModelOptions } from "./model-options";

type GroqModel = "llama2-70b-4096" | "mixtral-8x7b-32768";

const apiKey = process.env.GROQ_API_KEY;

export const buildGroqModel = (modelName: GroqModel, options?: ModelOptions) =>
	new ChatGroq({
		apiKey,
		modelName,
		temperature: options?.temperature ?? 0.0,
		cache: options?.cache ?? true,
		verbose: options?.verbose ?? false,
		onFailedAttempt: (error) => {
			console.error(error);
		},
	});
