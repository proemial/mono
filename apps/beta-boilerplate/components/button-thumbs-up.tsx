'use client'

import { Button } from "@/components/ui/button"
import { Icons } from "./ui/icons"
import { useState } from "react"

export function ButtonThumbsUp() {
    const [thumbsUp, setThumbsUp] = useState(false)

    const handleClick = () => {
        setThumbsUp(!thumbsUp)
    }

    return (
        <Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
            <Icons.thumbsUp className={`${thumbsUp ? 'fill-foreground stroke-background' : 'fill-background stroke-foreground'}`} />
        </Button>
    )
}