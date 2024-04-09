"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Textarea } from "@/components/ui/textarea"
import { QuerySchema } from "@/lib/definitions"

export function ChatForm({ placeholder }: { placeholder: string }) {
    const [isFocused, setIsFocused] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const form = useForm<z.infer<typeof QuerySchema>>({
        resolver: zodResolver(QuerySchema),
    })

    function onSubmit(data: z.infer<typeof QuerySchema>) {
        const params = new URLSearchParams(searchParams);
        if (data.query) {
            params.set("query", data.query);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function onBlur() {
        // Necessary delay to fire the form when the button is clicked and goes invisible
        setTimeout(() => setIsFocused(false), 100);
    }

    return (
        <Form {...form}>
            <form onFocus={() => setIsFocused(true)} onBlur={onBlur} onSubmit={form.handleSubmit(onSubmit)} className={`${isFocused ? 'bg-primary p-0 md:p-4' : 'p-4'} w-full flex gap-2 items-center`}>
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem className={`${isFocused ? 'rounded-none md:rounded-3xl' : 'rounded-3xl'} w-full overflow-hidden`}>
                            <FormControl>
                                <Textarea
                                    placeholder={placeholder}
                                    className="w-full h-10 pl-4 pt-[10px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className={`${isFocused ? 'visible' : 'hidden'} rounded-full text-foreground bg-background p-2 size-6`} size="icon" type="submit"><ChevronRight /></Button>
            </form>
        </Form >
    )
}
