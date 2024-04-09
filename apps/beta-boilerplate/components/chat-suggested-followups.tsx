"use client"

import { GanttChart } from "lucide-react";
import { Header4 } from "@/components/ui/typography";
import { SelectContentSelector } from "./select-content-selector";
import { Suggestions } from "@/components/suggestions";
import { ButtonFollowup } from "./button-followup";
import { followupSelectors } from "@/lib/definitions";

export function ChatSuggestedFollowups({ label }: { label: string }) {

    function onClick() {
        console.log('Ask follow-up...');
    }

    const suggestions = [
        "What is the purpose of the Statistical Interpretation of quantum theory?",
        "What is the implication of Bell’s theorem on hidden-variable theories that reproduce quantum mechanics exactly?",
        "How does the Statistical Interpretation propose to view the quantum state description?",
    ]

    return (
        <div className="flex flex-col gap-5 mb-8">
            <div className="flex items-center place-content-between">
                <div className="flex gap-4 items-center">
                    <GanttChart className="size-4" />
                    <Header4>Suggested follow-ups</Header4>
                </div>
                <div>
                    <SelectContentSelector selector={followupSelectors} />
                </div>
            </div>
            <div>
                <Suggestions suggestions={suggestions} />
            </div>
        </div>
    );
}
