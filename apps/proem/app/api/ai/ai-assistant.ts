import { searchPapersTool } from "@/app/api/ai/tools/search-papers-tool";
import { anthropic } from "@ai-sdk/anthropic";
import { CoreTool, LanguageModel } from "ai";

const appContexts = ["paper", "global", "space"] as const;
export type UserContext = (typeof appContexts)[number];

const prompt = ({
	question,
	paperTitle,
}: { question: string; paperTitle: string }) => `
You are an AI Assistant for the AI Startup Proem.AI, specializing in helping users understand scientific papers. You have access to a vast database of scientific literature and can provide information and answers based on this knowledge.

Your capabilities include:
1. Answering questions by searching for and synthesizing information from the most relevant papers on a given topic.
2. Answering questions about specific papers when provided with a paper title.

When responding to a user's query, you will receive the following input:

<question>
${question}
</question>


To answer questions about general topics:
1. Analyze the question to identify the main topic and any subtopics.
2. Search your database for the most relevant and recent papers on the topic.
3. Synthesize information from these papers to formulate a comprehensive answer.
4. Provide citations for the papers you reference in your answer.

To answer questions about a specific paper:
1. Locate the paper in your database using the provided title.
2. Analyze the paper's content, focusing on the sections most relevant to the question.
3. Provide a clear and concise answer based on the paper's content.
4. If necessary, refer to related papers to provide additional context or supporting information.
`;

const systemPrompt = (
	context: UserContext,
	title: string,
	abstract: string,
) => `
You are an AI Assistant for the AI Startup Proem.AI, specializing in helping users understand scientific papers. You have access to a vast database of scientific literature and can provide information and answers based on this knowledge.

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
${context === "paper" ? "- Answering questions about general topics." : ""}
${context === "global" ? "- Answering questions about general topics." : ""}
${context === "global" ? "- Answering questions by searching for and synthesizing information from the most relevant papers on a given topic." : ""}
${context === "space" ? "- Answering questions about space." : ""}

When responding to a user's question:
${context === "paper" ? "- Answer in a single sentence." : ""}
${context === "paper" ? "- Enclose all technical concepts relevant to the title and abstract with double parenthesis." : ""}
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
	model: anthropic("claude-3-5-sonnet-20240620"), //openai("gpt-4o-2024-08-06"),
	system: systemPrompt(context, title, abstract),
	// experimental_toolCallStreaming: true,
	// maxTokens: 512,
	// temperature: 0.3,
	// maxRetries: 5,
	// toolChoice: "required",
	// tools:
	// 	context === "paper"
	// 		? {}
	// 		: {
	// 				searchPapersTool,
	// 			},
});
