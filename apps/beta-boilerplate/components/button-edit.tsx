'use client'

import { Button } from "@/components/ui/button"
import { SquarePen } from "lucide-react"

export function ButtonEdit({ handleClick }: { handleClick: () => void }) {
    return (
        <Button variant="ghost" size="actionBar" onClick={() => handleClick()}>
            <SquarePen className="size-4" />
        </Button>
    )
}