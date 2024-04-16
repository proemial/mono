"use client";

import { ProfileColorSchemeToggle } from "@/components/profile-color-scheme-toggle";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Header4,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import {
	ChevronDown,
	ChevronUp,
	CircleHelp,
	Droplet,
	FileText,
	LockKeyhole,
	LogOut,
	Mail,
	MessageSquare,
	ClipboardCheck
} from "lucide-react";
import * as React from "react";

const feedback = "https://tally.so/r/wAv8Ve";
const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local";

export function ProfileYou() {
	const [isOpen, setIsOpen] = React.useState(true);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			{/* <CollapsibleTrigger className="w-full">
				<div className="flex items-center place-content-between">
					<div className="flex items-center gap-4">
						<Avatar className="size-6">
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<Header4>You</Header4>
					</div>
					<div>
						{isOpen ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</div>
				</div>
			</CollapsibleTrigger> */}
			<CollapsibleContent>
				<Table className="text-base">
					<TableBody>
						{/* <TableRow>
							<TableCell variant="icon">
								<Mail className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">Email</TableCell>
							<TableCell variant="value">johnconner@proemial.ai</TableCell>
						</TableRow> */}
						<TableRow>
							<TableCell variant="icon">
								<Droplet className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">Color Scheme</TableCell>
							<TableCell variant="value">
								<ProfileColorSchemeToggle />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<MessageSquare className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">
								<a href={feedback} target="_blank" rel="noreferrer">Give feedback</a>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<ClipboardCheck className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">Version: {version.substring(0, 7)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<FileText className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">Terms of Use</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<LockKeyhole className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">Privacy Policy</TableCell>
						</TableRow>
						{/* <Tableine */}
					</TableBody>
				</Table>
			</CollapsibleContent>
		</Collapsible>
	);
}
