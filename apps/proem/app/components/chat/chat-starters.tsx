"use client";
import { Tracker } from "@/app//components/analytics/tracker";
import { limit } from "@proemial/utils/array";
import { Search } from "lucide-react";
import { ChatStarter } from "./chat-message";
import { ChatTarget, useChatState } from "./state";


type Props = {
    target: ChatTarget;
    trackingKey: string;
};

export function StarterMessages({
    target,
    trackingKey,
}: Props) {
    const { suggestions, addQuestion } = useChatState(target);

    if (suggestions?.length === 0) {
        return null;
    }

    const trackAndInvoke = (text: string) => {
        Tracker.track(trackingKey, {
            text,
        });

        addQuestion(text);
    };

    return (
        <>
            <div className="flex items-center font-sourceCodePro">
                <Search style={{ height: "12px", strokeWidth: "3" }} className="w-4" />
                SUGGESTED QUESTIONS
            </div>
            {suggestions.map((suggestion) => (
                <ChatStarter
                    key={suggestion}
                    onClick={() => trackAndInvoke(suggestion)}
                >
                    {suggestion}
                </ChatStarter>
            ))}
        </>
    );
}
