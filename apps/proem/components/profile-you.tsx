"use client";

import { ProfileColorSchemeToggle } from "@/components/profile-color-scheme-toggle";
import { useUser } from "@clerk/nextjs";
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
	LogIn,
	Mail,
	MessageSquare,
	ClipboardCheck
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

const feedback = "https://tally.so/r/wAv8Ve";

export function ProfileYou() {
	const [isOpen, setIsOpen] = React.useState(true);
	const { user } = useUser();

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
								<Feedback />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<ClipboardCheck className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key" className="flex items-center gap-4">
								<Version />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<FileText className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">
								<Link href="/terms">Terms of Use</Link>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<LockKeyhole className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">
								<Link href="/privacy">Privacy Policy</Link>
							</TableCell>
						</TableRow>
						<TableRow className="text-slate-400">
							<TableCell variant="icon">
								{user && <LogOut className="mx-auto size-4" />}
								{!user && <LogIn className="mx-auto size-4" />}
							</TableCell>
							<TableCell variant="key">Sign in</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CollapsibleContent>
		</Collapsible>
	);
}

function Feedback() {
	return <a href={feedback} target="_blank" rel="noreferrer">Give feedback</a>
}

function Version() {
	const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local";
	return <>Version: {version.substring(0, 7)} <Beta /></>;
}

function Beta() {
	return (
		<span className="px-2 py-1.5 text-xs font-bold rounded-md text-secondary-foreground bg-secondary">BETA</span>
	);
}