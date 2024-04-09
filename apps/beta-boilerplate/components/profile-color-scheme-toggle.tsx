"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProfileColorSchemeToggle() {
    const { setTheme } = useTheme()

    return (
        <Select onValueChange={(value) => setTheme(value)}>
            <SelectTrigger className="w-20 border-0 focus:ring-0 focus:ring-offset-0 h-6 p-0">
                <SelectValue placeholder="System" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
            </SelectContent>
        </Select>

    )
}