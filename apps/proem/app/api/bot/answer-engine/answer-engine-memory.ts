import { BufferMemory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

export const messageMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
  // Create PostgressNeon BaseChatMessageHistory or use this?
  // chatHistory: new UpstashRedisChatMessageHistory({
  //   sessionId: new Date().toISOString(), // Or some other unique identifier for the conversation
  //   sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
  //   config: {
  //     url: "more-ringtail-36022.upstash.io", // Override with your own instance's URL
  //     token: "26a29a39a1564f05ab61bd6ee0496727", // Override with your own instance's token
  //   },
  // }),
});

// TODO! SessionId doesn't work as a cache
// https://js.langchain.com/docs/modules/model_io/chat/caching#in-memory-cache

import { BaseListChatMessageHistory } from "@langchain/core/chat_history";
import {
  BaseMessage,
  type StoredMessage,
  type StoredMessageData,
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages,
} from "@langchain/core/messages";
import type { drizzle } from "drizzle-orm/bun-sqlite";
import { answerEngineMemory } from "../../../../../../packages/data/neon/schema/answer-engine-memory";
import { neonDb } from "../../../../../../packages/data";
import { eq } from "drizzle-orm";

/**
 * Interface for the data transfer object used when selecting stored
 * messages from the PlanetScale database.
 */
interface selectStoredMessagesDTO {
  id: string;
  session_id: string;
  type: string;
  content: string;
  role: string | null;
  name: string | null;
  additional_kwargs: string;
}

/**
 * Class for storing and retrieving chat message history from a
 * PlanetScale database. Extends the BaseListChatMessageHistory class.
 * @example
 * ```typescript
 * const chatHistory = new PlanetScaleChatMessageHistory({
 *   tableName: "stored_message",
 *   sessionId: "lc-example",
 *   config: {
 *     url: "ADD_YOURS_HERE",
 *   },
 * });
 * const chain = new ConversationChain({
 *   llm: new ChatOpenAI(),
 *   memory: chatHistory,
 * });
 * const response = await chain.invoke({
 *   input: "What did I just say my name was?",
 * });
 * console.log({ response });
 * ```
 */
export class AnswerEngineChatMessageHistory extends BaseListChatMessageHistory {
  lc_namespace = ["langchain", "stores", "message", "answer-engine-memory"];

  private sessionId: string;
  constructor(sessionId: string) {
    super();

    this.sessionId = sessionId;
  }
  /**
   * Method to retrieve all messages from the Neon database for the
   * current session.
   * @returns Promise that resolves to an array of BaseMessage objects.
   */
  async getMessages(): Promise<BaseMessage[]> {
    console.log("getMessages");

    // const query = `SELECT * FROM ${this.tableName} WHERE session_id = :session_id`;
    // const params = {
    //   session_id: this.sessionId,
    // };

    const rawStoredMessages = await neonDb
      .select()
      .from(answerEngineMemory)
      .where(eq(answerEngineMemory.sessionId, this.sessionId));
    console.log({ rawStoredMessages });

    const orderedMessages = rawStoredMessages.map((message): StoredMessage => {
      return {
        type: message.type,
        data: {
          content: message.content,
          role: message.role || undefined,
          name: message.name || undefined,
          tool_call_id: message.toolCallId || undefined,
          ...(message.additionalKwargs
            ? { additional_kwargs: JSON.parse(message.additionalKwargs) }
            : {}),
        },
      };
    });
    return mapStoredMessagesToChatMessages(orderedMessages);
  }

  /**
   * Method to add a new message to the Neon database for the current
   * session.
   * @param message The BaseMessage object to be added to the database.
   * @returns Promise that resolves to void.
   */
  async addMessage(message: BaseMessage): Promise<void> {
    console.log("addMessage");
    console.log(message);
    const [messageToAdd] = mapChatMessagesToStoredMessages([message]);
    console.log(messageToAdd);

    if (!messageToAdd) {
      return;
    }

    const params = {
      sessionId: this.sessionId,
      type: messageToAdd.type,
      content: messageToAdd.data.content,
      role: messageToAdd.data.role,
      name: messageToAdd.data.name,
      additionalKwargs: JSON.stringify(messageToAdd.data.additional_kwargs),
    };
    console.log(params);

    const returned = await neonDb.insert(answerEngineMemory).values(params);
    console.log(returned);
  }

  /**
   * Method to delete all messages from the PlanetScale database for the
   * current session.
   * @returns Promise that resolves to void.
   */
  async clear(): Promise<void> {
    console.log("clear");
    // const query = `DELETE FROM ${this.tableName} WHERE session_id = :session_id`;
    // const params = {
    //   session_id: this.sessionId,
    // };
    // await this.connection.execute(query, params);
  }
}
