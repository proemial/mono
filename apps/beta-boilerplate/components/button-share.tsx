'use client'

import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"

export function ButtonShare() {

    const handleClick = () => {
        // Share
    }

    return (
        <Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
            <Share />
        </Button>
    )
}