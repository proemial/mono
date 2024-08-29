import { searchPapersTool } from "@/app/api/ai/tools/search-papers-tool";
import { anthropic } from "@ai-sdk/anthropic";
import { CoreTool, LanguageModel } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";

const appContexts = ["paper", "global", "space"] as const;
export type UserContext = (typeof appContexts)[number];

const systemPrompt = (
	context: UserContext,
	title: string,
	abstract: string,
) => `
You are Proem AI, specializing in helping users understand scientific papers. You have access to a vast database of scientific literature and can provide information and answers based on this knowledge.

${
	context === "paper"
		? `
	<paper>
		<title>${title}</title>
		<abstract>${abstract}</abstract>
	</paper>
	`
		: ""
}

Your capabilities include:
${
	context === "paper"
		? `
- Answering questions about general topics.
	`
		: `
- Answering questions by searching for and synthesizing information from the most relevant papers on a given topic.
- Base your answer on the two most relevant research papers retrieved.
- If you find it necessary, include an introduction to the topic of the user's question, using a single sentence.


	`
}

When responding to a user's question:
- Always keep your answer concise and to the point.
- Keep your answers short and preferably in a single sentence.
${
	context === "paper"
		? `
- Answer in a single sentence.
- Enclose all technical concepts relevant to the title and abstract with double parenthesis.
	`
		: `
- Use layman's terminology instead of scientific jargon.
- Start the answer without any introduction about the papers you found.
- Never reveal or mention the tools you're using.
	`
}
`;

type Assistant = (
	context: UserContext,
	title: string,
	abstract: string,
) => {
	model: LanguageModel;
	system: string;
	tools?: Record<string, CoreTool>;
};

export const assistant: Assistant = (context, title, abstract) => ({
	model: wrapAISDKModel(anthropic("claude-3-5-sonnet-20240620")),
	system: systemPrompt(context, title, abstract),
	// experimental_toolCallStreaming: true,
	// maxTokens: 512,
	// temperature: 0.3,
	// maxRetries: 5,
	// toolChoice: "required",
	...(context !== "paper"
		? {
				tools: { searchPapersTool },
			}
		: {}),
});
