import Chat from "@/app/(pages)/(app)/(answer-engine)/chat";
import { Message } from "ai/react";

export const revalidate = 1;

export default async function AnswerEngine() {
  // TODO! fetch answer if it exists
  // get question from ?q
  // convert to
  const question = "how does an engine work?";
  console.log("answer engine!!!");

  // TODO! render answers if it doesn't exist

  const initialMessages: Message[] = [
    { id: "something", role: "user", content: question },
    { id: "something2", role: "assistant", content: "Whhaaaat?" },
  ];

  return (
    <div className="p-6">
      <Chat />
    </div>
  );
}

// after initial question
// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=u

// after follow up
// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=u

// after share button click
// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=c#96b652c3-7689-4dcb-b3cb-c3f43ca5d681

// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=c#55fe2042-801b-4e73-bc06-b6a3db1b709e
