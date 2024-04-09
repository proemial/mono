'use client'

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function ButtonReplies() {
    return (
        <Button size="actionBar" variant="ghost">
            <MessageSquare />
        </Button>
    )
}