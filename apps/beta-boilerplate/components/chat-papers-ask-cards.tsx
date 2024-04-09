'use client'

import * as React from "react"
import { ChevronUp, ChevronDown, Globe, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Card,
    CardBullet,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Header4 } from "@/components/ui/typography"
import { dummyPapers } from "@/lib/definitions"

export function ChatPapersAskCards() {
    const [isOpen, setIsOpen] = React.useState(true)

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
        >
            <div className="flex items-center justify-between space-x-4">
                <div className="flex gap-4 items-center"><FileText className="size-4" /><Header4>Research Papers Found</Header4></div>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}

                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
                <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                    <div className="flex w-max space-x-3">
                        {dummyPapers.map((paper, i) => (
                            <Card key={i} variant="paper">
                                <CardHeader variant="paperAsk">
                                    <CardBullet variant="numbered">{i + 1}</CardBullet>
                                    <CardDescription variant="paperDate">{paper.date}</CardDescription>
                                </CardHeader>
                                <CardContent variant="paper">
                                    <CardTitle variant="paper">{paper.title}</CardTitle>
                                </CardContent>
                                <CardFooter>
                                    <CardDescription variant="paperPublisher">{paper.publisher}</CardDescription>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    )
}