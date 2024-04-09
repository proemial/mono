"use client"

import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, FileText } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { dummyPapers } from "@/lib/definitions";
import { Header4 } from "@/components/ui/typography";
import { PaperCardAsk } from "@/components/paper-card-ask";

export function ChatPapersAsk({ loading }: { loading: boolean }) {
    const [isOpen, setIsOpen] = React.useState(true)

    const headers = {
        loading: "Research papers found",
        loaded: "Research papers interrogated"
    }

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
        >
            <div className="flex items-center justify-between space-x-4">
                <div className="flex gap-4 items-center">
                    <FileText className="size-4" />
                    <Header4>{loading ? headers.loading : headers.loaded}</Header4>
                </div>
                <div className="flex items-center">
                    {dummyPapers.length}
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}

                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </div>
            <CollapsibleContent className="space-y-2">
                <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                    <div className="flex w-max space-x-3">
                        {dummyPapers.map((paper, i) => (
                            <PaperCardAsk paper={paper} key={i} index={`${i + 1}`} />
                        ))}
                        <PaperCardAsk key={dummyPapers.length} index={`${dummyPapers.length + 1}`} />
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    )
}