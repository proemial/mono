import LlmModels from "@proemial/adapters/llm/models";
import { answerParams } from "./summarize-prompt";

export const LlmAnswer = {
	model: async (id: string) => await LlmModels.assistant.answer(id),
};

export const LlmFollowups = {
	prompt: followupsPrompt,
	model: async (id: string) => await LlmModels.assistant.followups(id),
};

function followupsPrompt(
	question: string,
	answer: string,
	context: {
		title?: string;
		transcript?: string;
		papers?: { abstract: string }[];
	},
) {
	return answerParams.prompt;
}
