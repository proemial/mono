import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";
import { askAgentPrompt, askPromptConfig } from "@/app/prompts/ask_agent";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { NextRequest, NextResponse } from "next/server";
import { getTools } from "./tools";

// GPT-4 flag
// - Add the flag to the agent

// Feedback
// - Fix streaming with intermediate steps
//    - https://js.langchain.com/docs/modules/agents/how_to/streaming
// - Add intermediate step (or streamEvents) when a tool is triggered

// Integrate
// - Implement sharing
// - Invoke genration of followups

// LangSmith housekeeping
// - Rename parent run
// - Extract trace id from agent execution, and add it to the tools

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { input, chat_history } = parseMessages(body.messages);

		const executor = await initializeAgent();
		const logStream = executor.streamLog({ input, chat_history });

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
	} catch (e) {
		return NextResponse.json(e, { status: 500 });
	}
}

async function initializeAgent() {
	const tools = getTools();
	const gpt4 = (await getFeatureFlag("askGpt4")) as boolean;
	const llm = new ChatOpenAI({
		...askPromptConfig(gpt4),
		streaming: true,
	});

	const prompt = getPrompt();
	const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });

	return new AgentExecutor({
		agent,
		tools,
		maxIterations: 3,
		returnIntermediateSteps: true,
	});
}

function getPrompt() {
	return ChatPromptTemplate.fromMessages([
		["system", askAgentPrompt],
		new MessagesPlaceholder("chat_history"),
		["human", "Based on science, {input}"],
		new MessagesPlaceholder("agent_scratchpad"),
	]);
}

function parseMessages(chatMessages?: VercelChatMessage[]) {
	const messages = (chatMessages ?? []).filter(
		(message: VercelChatMessage) =>
			message.role === "user" || message.role === "assistant",
	);

	const chat_history = messages
		.slice(0, -1)
		.map(convertVercelMessageToLangChainMessage);

	// @ts-ignore
	const input = messages[messages.length - 1].content;

	return { input, chat_history };
}

function convertVercelMessageToLangChainMessage(message: VercelChatMessage) {
	if (message.role === "user") {
		return new HumanMessage(message.content);
	}
	if (message.role === "assistant") {
		return new AIMessage(message.content);
	}
	return new ChatMessage(message.content, message.role);
}
