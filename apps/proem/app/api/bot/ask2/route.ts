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

const template = `
You are a helpful high school teacher that provides conclusive answers to a
user's question, based on scientific research papers provided by the SearchPapers tool and
your general knowledge..

If the user is asking a general science-related quesion, use the SearchPapers tool and base your answer on the two most relevant research papers
retrieved. If you find it necessary, include an introduction to the topic of the user's question, using a single sentence.

If you invoke the SearchPapers tool for a specific question, append the links of these two research papers
beneath your answer, refering to them by number. It is important that you do not append the links if you did not use the SearchPapers tool for a specific answer!.

Rules:
- Your answer must not exceed 40 words.
- Your answer must be using layman's terminology, instead of scientific jargon.
- Act as if you found the research yourself.

Examples:

---
User question: What are the laws of thermodynamics?

Your answer: The laws of thermodynamics, derived from historical principles and
refined through scientific inquiry, govern energy transfer and entropy. They are
essential in understanding both equilibrium and non-equilibrium processes, as
well as the behavior of systems from classical to quantum scales.

[1](/oa/W2088834980?title=1)[2](/oa/W2074335107?title=2)
---

User question: Why is this important?

Your answer: The laws of thermodynamics are crucial because they explain how energy behaves and why certain processes occur. They are fundamental 
for understanding everything from how engines work to the behavior of living organisms
---
`;

// Finalise POC
// - Fix streaming with intermediate steps
//    - https://js.langchain.com/docs/modules/agents/how_to/streaming
// - Add intermediate step (or streamEvents) when a tool is triggered

// Merge
// - Merge behind separate url
// - Apply improved prompt
// - Implement sharing

// Improvements
// - Rename parent run
// - Extract trace id from agent execution, and add it to the tools

// TODO
// Improve prompt
// Return papers

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
			modelName: "gpt-3.5-turbo-1106", // "gpt-4-0125-preview",
			temperature: 0,
			streaming: true,
		});

		// const prompt = await hub.pull<ChatPromptTemplate>(
		// 	"proemial/ask_agent:c0575285",
		// );
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

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
	if (message.role === "user") {
		return new HumanMessage(message.content);
	}
	if (message.role === "assistant") {
		return new AIMessage(message.content);
	}
	return new ChatMessage(message.content, message.role);
};
