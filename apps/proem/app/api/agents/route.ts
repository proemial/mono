import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { NextRequest, NextResponse } from "next/server";
import papers from "./papers.json";

export const runtime = "edge";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
	if (message.role === "user") {
		return new HumanMessage(message.content);
	}
	if (message.role === "assistant") {
		return new AIMessage(message.content);
	}
	return new ChatMessage(message.content, message.role);
};

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const messages = (body.messages ?? []).filter(
			(message: VercelChatMessage) =>
				message.role === "user" || message.role === "assistant",
		);
		const returnIntermediateSteps = body.show_intermediate_steps;
		const previousMessages = messages
			.slice(0, -1)
			.map(convertVercelMessageToLangChainMessage);
		const currentMessageContent = messages[messages.length - 1].content;

		const tools = getTools();
		const llm = new ChatOpenAI({
			modelName: "gpt-3.5-turbo-1106",
			temperature: 0,
			// IMPORTANT: Must "streaming: true" on OpenAI to enable final output streaming below.
			streaming: true,
		});

		const prompt = getPrompt();

		const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });

		const agentExecutor = new AgentExecutor({
			agent,
			tools,
			returnIntermediateSteps,
		});

		if (!returnIntermediateSteps) {
			const logStream = await agentExecutor.streamLog({
				input: currentMessageContent,
				chat_history: previousMessages,
			});

			const textEncoder = new TextEncoder();
			const transformStream = new ReadableStream({
				async start(controller) {
					for await (const chunk of logStream) {
						// @ts-ignore
						if (chunk.ops?.length > 0 && chunk?.ops[0].op === "add") {
							const addOp = chunk.ops[0];
							if (
								addOp.path.startsWith("/logs/ChatOpenAI") &&
								typeof addOp.value === "string" &&
								addOp.value.length
							) {
								controller.enqueue(textEncoder.encode(addOp.value));
							}
						}
					}
					controller.close();
				},
			});

			return new StreamingTextResponse(transformStream);
		}
		const result = await agentExecutor.invoke({
			input: currentMessageContent,
			chat_history: previousMessages,
		});
		return NextResponse.json(
			{ output: result.output, intermediate_steps: result.intermediateSteps },
			{ status: 200 },
		);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
	}
}

function getPrompt() {
	return ChatPromptTemplate.fromMessages([
		["system", template],
		new MessagesPlaceholder("chat_history"),
		["human", "{input}"],
		new MessagesPlaceholder("agent_scratchpad"),
	]);
}

function getTools() {
	const foo = new DynamicTool({
		name: "foo",
		description: "returns the answer to what foo is",
		func: async () => {
			console.log("Triggered foo function");
			return 'The value of food is "This is a demo for YouTube"';
		},
	});

	const life = new DynamicTool({
		name: "SearchPapers",
		description: "Find specific research papers matching a user query",
		func: async (options) => {
			console.log("Triggered SearchPapers,", `input: '${options}'`);
			return JSON.stringify(papers);
		},
	});

	return [foo, life];
}

const template = `
You will provide conclusive answers to user questions, based on relevant research articles, retrieved using the provided SearchPapers tool.

Answers must be grounded in specific research papers.
`;
