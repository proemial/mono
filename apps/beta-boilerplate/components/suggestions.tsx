"use client"

import { Button } from "@/components/ui/button"
import { useSearchParams, usePathname, useRouter } from "next/navigation"

export function Suggestions({ suggestions }: { suggestions: string[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function onClick(suggestion: string) {
        const params = new URLSearchParams(searchParams);
        if (suggestion) {
            params.set("query", suggestion);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-col gap-5 pb-4">
            <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, i) => (
                    <Button variant="suggestion" size="suggestion" key={i} onClick={() => onClick(suggestion)}>
                        {suggestion}</Button>
                ))}
            </div>
            <div className="flex justify-center">
                <Button size="pill">More</Button>
            </div>
        </div>
    )
}
