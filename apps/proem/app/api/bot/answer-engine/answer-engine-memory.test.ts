import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";
import {
  AnswerEngineChatMessageHistory,
  messageMemory,
} from "./answer-engine-memory";
import { neonDb } from "../../../../../../packages/data";
import { eq } from "drizzle-orm";
import { answerEngineMemory } from "../../../../../../packages/data/neon/schema/answer-engine-memory";

// vi.mock("../../../../../../packages/data", async (importOriginal) => {
//   return {
//     AnswerEngineChatMessageHistory: class AnswerEngineChatMessageHistory {
//       private messages = [new HumanMessage("Hi!")];
//       async getMessages() {
//         return this.messages;
//       }

//       async addMessges(message: BaseMessage) {
//         this.messages.push(message);
//       }
//     },
//   };
// });
vi.mock("../../../../../../packages/data", async (importOriginal) => {
  const messages = [
    {
      id: 0,
      sessionId: "",
      content: "",
      name: null,
      role: null,
      type: "human",
      toolCallId: null,
      additionalKwargs: "",
    },
  ];
  return {
    neonDb: {
      select: () => ({
        from: () => ({
          where: () => {
            return messages;
          },
        }),
      }),
      insert: () => ({
        values: () => {
          messages.push({
            id: 1,
            sessionId: "",
            content: "",
            name: null,
            role: null,
            type: "ai",
            toolCallId: null,
            additionalKwargs: "",
          });
        },
      }),
    },
  };
});

describe("AnswerEngineMemory", () => {
  beforeEach(() => {
    // Setup code before each test
    // messageMemory.clear();
  });

  afterEach(() => {
    // Teardown code after each test
  });

  // it("should do something", async () => {
  //   await messageMemory.chatHistory.addMessage(new HumanMessage("Hi!"));
  //   await messageMemory.chatHistory.addMessage(new AIMessage("What's up?"));

  //   const memory = await messageMemory.loadMemoryVariables({});
  //   expect(memory).toBe(false);
  // });

  // it("should do something else", async () => {
  //   const messages = [new HumanMessage("Hi!"), new AIMessage("What's up?")];
  //   const storedMessages = mapChatMessagesToStoredMessages(messages); //?

  //   expect(storedMessages).toBe(false);
  // });

  it("Answer Engine Memory", async () => {
    const answerEngineChatMessageHistory = new AnswerEngineChatMessageHistory();
    const messages = await answerEngineChatMessageHistory.getMessages();
    const test = eq(answerEngineMemory.sessionId, "this.sessionId");
    console.log(test);
    expect(messages.length).toBe(1);
    await answerEngineChatMessageHistory.addMessage(
      new AIMessage("What's up?")
    );
    const withInsertedMessages =
      await answerEngineChatMessageHistory.getMessages();
    expect(withInsertedMessages.length).toBe(2);
  });
});
