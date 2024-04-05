import { useState } from "react";
import type { Message } from "ai/react";
import type { AgentStep } from "langchain/schema";
import { Paper } from "@/app/api/paper-search/search";

export function IntermediateStep(props: { message: Message }) {
    const parsedInput: AgentStep = JSON.parse(props.message.content);
    const action = parsedInput.action;
    const observation = parsedInput.observation;
    const [expanded, setExpanded] = useState(false)

    if (action.tool === "SearchPapers") {
        return <Papers input={action.toolInput} observation={observation} />
    }

    return (
        <div
            className={"w-full mr-auto bg-slate-900 rounded px-4 py-2 mb-8 whitespace-pre-wrap flex flex-col cursor-pointer"}
        >
            <div className={`text-left ${expanded ? "w-full" : ""}`} onClick={(e) => setExpanded(!expanded)}>
                <code className="px-2 py-1 mr-2 rounded bg-slate-600 hover:text-blue-600">
                    🛠️ <b>{action.tool}</b>
                </code>
                <span className={expanded ? "hidden" : ""}>🔽</span>
                <span className={expanded ? "" : "hidden"}>🔼</span>
            </div>
            <div className={`overflow-hidden max-h-[0px] transition-[max-height] ease-in-out ${expanded ? "max-h-[360px]" : ""}`}>
                <div className={`rounded p-1 mt-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}>
                    <code className={`opacity-0 max-h-[100px] overflow-auto transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`}>
                        Tool Input: {JSON.stringify(action.toolInput)}
                    </code>
                </div>
                <div className={`rounded p-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}>
                    <code className={`opacity-0 max-h-[260px] overflow-auto transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`}>{observation}</code>
                </div>
            </div>
        </div>
    );
}

function Papers(props: { input: string, observation: string }) {
    const papers = JSON.parse(props.observation) as Paper[];

    return (
        <div className={"w-full mr-auto bg-slate-900 rounded px-4 py-2 mb-8 flex flex-col"}>
            {/* @ts-ignore */}
            Search term: "{props.input.input}"
            {papers.map((paper, i: number) => (
                <CollapsiblePaper key={i} paper={paper} />
            ))}
        </div>
    );
}

function CollapsiblePaper(props: { paper: Paper }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="p-1 border rounded ">
            <div className={`text-left flex justify-between items-center ${expanded ? "w-full" : ""}`}>
                <code className="px-2 py-1 mr-2 rounded text-slate-300">
                    <a href={props.paper.link} target="_blank" rel="noreferrer" className="underline">{props.paper.title}</a>
                </code>
                <div className="mr-2" onClick={(e) => setExpanded(!expanded)}>
                    <span className={expanded ? "hidden" : ""}>🔽</span>
                    <span className={expanded ? "" : "hidden"}>🔼</span>
                </div>
            </div>
            <div className={`overflow-hidden max-h-[0px] transition-[max-height] ease-in-out ${expanded ? "max-h-[360px]" : ""}`}>
                <div className={`rounded p-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}>
                    <code className={`opacity-0 max-h-[260px] overflow-auto transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`}>{props.paper.abstract}</code>
                </div>
            </div>
        </div>
    );
}