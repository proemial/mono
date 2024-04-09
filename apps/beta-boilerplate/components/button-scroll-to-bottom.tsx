'use client'

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function ButtonScrollToBottom() {
    return (
        <div className="z-10 w-full max-w-screen-md mx-auto overflow-visible fixed inset-x-0 bottom-0">
            <div className="flex justify-center pb-24">
                <Button size="icon">
                    <ChevronDown className="size-4" />
                </Button>
            </div>
        </div>
    )
}