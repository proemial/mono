"use client";
import { Tracker } from "@/app//components/analytics/tracker";
import { limit } from "@proemial/utils/array";
import { Search } from "lucide-react";
import { ChatStarter } from "./chat-message";
import { ChatTarget, useChatState } from "./state";


type Props = {
    target: ChatTarget;
    starters: string[];
    trackingKey: string;
};

export function StarterMessages({
    target,
    starters,
    trackingKey,
}: Props) {
    const { questions, appendQuestion } = useChatState(target);

    if (questions?.length > 0) {
        return null;
    }

    const trackAndInvoke = (text: string) => {
        Tracker.track(trackingKey, {
            text,
        });

        appendQuestion(text);
    };

    return (
        <>
            <div className="flex items-center font-sourceCodePro">
                <Search style={{ height: "12px", strokeWidth: "3" }} className="w-4" />
                SUGGESTED QUESTIONS
            </div>
            {limit(starters?.filter(Boolean), 3).map((question) => (
                <ChatStarter key={question} onClick={() => trackAndInvoke(question)}>
                    {question}
                </ChatStarter>
            ))}
        </>
    );
}
