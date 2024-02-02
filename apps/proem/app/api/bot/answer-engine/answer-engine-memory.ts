import { BufferMemory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

export const messageMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
  // Create PostgressNeon BaseChatMessageHistory or use this?
  chatHistory: new UpstashRedisChatMessageHistory({
    sessionId: new Date().toISOString(), // Or some other unique identifier for the conversation
    sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
    config: {
      url: "more-ringtail-36022.upstash.io", // Override with your own instance's URL
      token: "26a29a39a1564f05ab61bd6ee0496727", // Override with your own instance's token
    },
  }),
});

// TODO! SessionId doesn't work as a cache
// https://js.langchain.com/docs/modules/model_io/chat/caching#in-memory-cache
