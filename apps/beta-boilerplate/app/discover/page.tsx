import { ChatPapersDiscover } from "@/components/chat-papers-discover";
import { Suspense } from "react";
import { ChatArticle } from "@/components/chat-article";
import { ChatPanel } from "@/components/chat-panel";
import { ChatActionBarDiscover } from "@/components/chat-action-bar-discover";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { ChatQA } from "@/components/chat-qa";
import { dummySummary } from "@/lib/definitions";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";

export default function Page({ searchParams }: {
    searchParams?: {
        query?: string;
    }
}) {
    const query = searchParams?.query || '';

    const state = searchParams?.query ? "follow-up-discover" : "empty";

    const scrollToBottom = () => {
        console.log("scroll to bottom");
    }

    return (
        <main className="flex w-full">
            <div className="flex flex-col p-4 pb-0 gap-6 w-full">
                {query &&
                    <ChatPapersDiscover />
                }
                {query &&
                    <Suspense key={query + "Summary"}>
                        <ChatArticle article={dummySummary} />
                    </Suspense>
                }
                {query &&
                    <>
                        <ChatActionBarDiscover />
                        <ChatQA />
                        <ChatSuggestedFollowups label="Ask this paper..." />
                    </>
                }
                {state !== "empty" && <ButtonScrollToBottom />}
                <ChatPanel state={state} />
            </div>
        </main>
    );
}
