'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Bookmark } from "lucide-react"

export function ButtonBookmark() {
    const [bookmarked, setBookmarked] = useState(false)

    const handleClick = () => {
        setBookmarked(!bookmarked)
    }

    return (
        <Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
            <Bookmark className={`${bookmarked ? 'fill-foreground' : 'fill-background'}`} />
        </Button>
    )
}