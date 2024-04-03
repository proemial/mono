import type { Message } from "ai/react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function ChatMessageBubble(props: { message: Message, aiEmoji?: string, sources: any[] }) {
    const colorClassName =
        props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
    const alignmentClassName =
        props.message.role === "user" ? "ml-auto" : "mr-auto";
    return (
        <div
            className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex`}
        >
            <div className="flex flex-col whitespace-pre-wrap">
                <span>{props.message.content}</span>
                {props.sources?.length ? <>
                    <code className="px-2 py-1 mt-4 mr-auto rounded bg-slate-600">
                        <h2>
                            🔍 Sources:
                        </h2>
                    </code>
                    <code className="px-2 py-1 mt-1 mr-2 text-xs rounded bg-slate-600">
                        {props.sources?.map((source, i) => (
                            <div className="mt-2" key={`source:${i}`}>
                                {i + 1}. &quot;{source.pageContent}&quot;{
                                    source.metadata?.loc?.lines !== undefined
                                        ? <div><br />Lines {source.metadata?.loc?.lines?.from} to {source.metadata?.loc?.lines?.to}</div>
                                        : ""
                                }
                            </div>
                        ))}
                    </code>
                </> : ""}
            </div>
        </div>
    );
}