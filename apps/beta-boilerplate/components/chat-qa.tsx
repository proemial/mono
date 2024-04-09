"use client"

import { GanttChart } from "lucide-react";
import { Header4 } from "@/components/ui/typography";
import { SelectContentSelector } from "./select-content-selector";
import { QAMessage, qaSelectors } from "@/lib/definitions";
import { QAEntry } from "@/components/qa-message";

export function ChatQA() {

    const messages: QAMessage[] = [
        {
            type: "question",
            text: "What is the purpose of the Statistical Interpretation of quantum theory?",
            replies: 3,
            likes: 2,
            author: {
                name: "SANDY WILDER CHENG",
                avatar: "https://github.com/shadcn.png"
            }
        },
        {
            type: "question",
            text: "What is the implication of Bell’s theorem on hidden-variable theories that reproduce quantum mechanics excactly?",
            replies: 12,
            likes: 6,
            author: {
                name: "PETRA PETERSSON",
                avatar: "https://github.com/shadcn.png"
            }
        },
        {
            type: "question",
            text: "How does the Statistical Interpretation propose to view the quantum state description?",
            replies: 2,
            likes: 1,
            author: {
                name: "KEVIN LEONG",
                avatar: "https://github.com/shadcn.png"
            }
        },
        {
            type: "answer",
            text: "The purpose is to explain quantum phenomena statistically. A method for calculating functions in crystals is proposed. Statistical Interpretation of Quantum Mechanics Calculating Functions.",
            likes: 1,
            author: {
                name: "PROEM",
                avatar: "https://github.com/shadcn.png"
            }
        },
        {
            type: "answer",
            text: "@kevinleong Great question!",
            likes: 1,
            author: {
                name: "SANDY WILDER CHENG",
                avatar: "https://github.com/shadcn.png"
            }
        },
    ]


    function onClick() {
        console.log('Ask follow-up...');
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center place-content-between">
                <div className="flex gap-4 items-center">
                    <GanttChart className="size-4" />
                    <Header4>Q&A</Header4>
                </div>
                <div>
                    <SelectContentSelector selector={qaSelectors} />
                </div>
            </div>
            <div className="flex flex-col place-items-end gap-6">
                {messages.map((message, index) => (
                    <QAEntry key={"chat" + index} message={message} />
                ))}

            </div>
        </div>
    );
}
