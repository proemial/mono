import { applyLinks } from "@/app/components/chat/apply-links";
import type { Message } from "ai/react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function ChatMessageBubble(props: { message: Message, aiEmoji?: string, sources: any[] }) {
    const colorClassName =
        props.message.role === "user" ? "bg-secondary" : "bg-slate-600";
    const alignmentClassName =
        props.message.role === "user" ? "ml-auto" : "mr-auto";

    const msg = applyLinks(props.message.content ?? "")
    return (
        <div
            className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex`}
        >
            <div className="flex flex-col whitespace-pre-wrap">
                <span>{msg.content}</span>
            </div>
        </div>
    );
}