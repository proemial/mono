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
import { askPrompt, askPromptConfig } from "@/app/prompts/ask2";

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

		const messages = (body.messages ?? []).filter(
			(message: VercelChatMessage) =>
				message.role === "user" || message.role === "assistant",
		);

		const previousMessages = messages
			.slice(0, -1)
			.map(convertVercelMessageToLangChainMessage);
		const currentMessageContent = messages[messages.length - 1].content;

		const tools = getTools();
		const llm = new ChatOpenAI({
			...askPromptConfig,
			streaming: true,
		});

		const prompt = getPrompt();
		const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });

		const agentExecutor = new AgentExecutor({
			agent,
			tools,
			maxIterations: 3,
		});

		const logStream = agentExecutor.streamLog({
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
	} catch (e) {
		return NextResponse.json(e, { status: 500 });
	}
}

function getPrompt() {
	return ChatPromptTemplate.fromMessages([
		["system", askPrompt],
		new MessagesPlaceholder("chat_history"),
		["human", "{input}"],
		new MessagesPlaceholder("agent_scratchpad"),
	]);
}

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
	if (message.role === "user") {
		return new HumanMessage(message.content);
	}
	if (message.role === "assistant") {
		return new AIMessage(message.content);
	}
	return new ChatMessage(message.content, message.role);
};
