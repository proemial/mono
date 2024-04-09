'use client'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Mail, Droplet, CircleHelp, FileText, LockKeyhole, LogOut } from "lucide-react"
import { Header4 } from "@/components/ui/typography"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ProfileColorSchemeToggle } from "@/components/profile-color-scheme-toggle"



export function ProfileYou() {
    const [isOpen, setIsOpen] = React.useState(true)

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="w-full">
                <div className="flex items-center place-content-between">
                    <div className="flex gap-4 items-center">
                        <Avatar className="size-6">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Header4>You</Header4>
                    </div>
                    <div>

                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}


                    </div>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Table className="text-base">
                    <TableBody>
                        <TableRow>
                            <TableCell variant="icon"><Mail className="mx-auto size-4" /></TableCell>
                            <TableCell variant="key">Email</TableCell>
                            <TableCell variant="value">johnconner@proemial.ai</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="icon"><Droplet className="mx-auto size-4" /></TableCell>
                            <TableCell variant="key">Color Scheme</TableCell>
                            <TableCell variant="value">
                                <ProfileColorSchemeToggle />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="icon"><CircleHelp className="mx-auto size-4" /></TableCell>
                            <TableCell variant="key">Help Center</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="icon"><FileText className="mx-auto size-4" /></TableCell>
                            <TableCell variant="key">Terms of Use</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="icon"><LockKeyhole className="mx-auto size-4" /></TableCell>
                            <TableCell variant="key">Privacy Policy</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="icon"><LogOut className="mx-auto size-4" /></TableCell>
                            <TableCell variant="key">Sign out</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

            </CollapsibleContent>
        </Collapsible>
    )
}