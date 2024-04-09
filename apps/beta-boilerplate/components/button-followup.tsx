'use client'

import { Button } from "@/components/ui/button"

export function ButtonFollowup({ onClick, label }: { onClick: () => void, label: string }) {
    return (
        <div className="flex justify-center pb-12">
            <Button variant="chat" size="pillLg" onClick={() => onClick()} className="w-full">
                {label}
            </Button>
        </div>
    )
}