import { ChatQuestion } from "@/components/chat-question";
import { ChatPapersAsk } from "@/components/chat-papers-ask";
import { Suspense } from "react";
import { ChatPapersSkeleton, ChatAnswerSkeleton } from "@/components/skeletons";
import { ChatArticle } from "@/components/chat-article";
import { ChatPanel } from "@/components/chat-panel";
import { ChatActionBarAsk } from "@/components/chat-action-bar-ask";
import { ChatSuggestedFollowups } from "@/components/chat-suggested-followups";
import { dummyAnswer } from "@/lib/definitions";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";

export default function Page({ searchParams }: {
    searchParams?: {
        query?: string;
    }
}) {
    const query = searchParams?.query || '';

    const state = searchParams?.query ? "follow-up-ask" : "empty";

    const scrollToBottom = () => {
        console.log("scroll to bottom");
    }

    return (
        <main className="flex w-full">
            <div className="flex flex-col p-4 gap-6 w-full">
                {query && <ChatQuestion question={query} />}
                {query &&
                    <ChatPapersAsk loading={false} />
                }
                {query &&
                    <Suspense key={query + "Answer"} fallback={<ChatAnswerSkeleton />}>
                        <ChatArticle article={dummyAnswer} />
                    </Suspense>
                }
                {query &&
                    <>
                        <ChatActionBarAsk />
                        <ChatSuggestedFollowups label="Ask follow-up..." />
                    </>
                }
                {state !== "empty" && <ButtonScrollToBottom />}
                <ChatPanel state={state} />
            </div>
        </main>
    );
}
