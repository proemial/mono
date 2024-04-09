'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Heart } from "lucide-react"

export function ButtonHeart({ small }: { small?: boolean }) {
    const [hearted, setHearted] = useState(false)

    const handleClick = () => {
        setHearted(!hearted)
    }

    return (
        <Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
            <Heart className={`${hearted ? 'fill-foreground' : 'fill-background'} ${small ? 'size-3' : ''}`} />
        </Button>
    )
}