"use client";
import { ProfileColorSchemeToggle } from "@/app/profile/profile-color-scheme-toggle";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import {
	Collapsible,
	CollapsibleContent,
	Icons,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import {
	ClipboardCheck,
	Drop,
	File02,
	Lock01,
	LogIn01,
	LogOut01,
	MessageSquare02,
} from "@untitled-ui/icons-react";
import Link from "next/link";
import * as React from "react";
import { SignInDrawer } from "./sign-in-drawer";

const feedback = "https://tally.so/r/wAv8Ve";

export function ProfileYou() {
	const [isOpen, setIsOpen] = React.useState(true);
	const { user } = useUser();
	const { signOut } = useClerk();
	const { membership } = useOrganization();

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
								<Drop className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">Color Scheme</TableCell>
							<TableCell variant="value">
								<ProfileColorSchemeToggle />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<MessageSquare02 className="mx-auto size-4" />
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
								<File02 className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">
								<Link
									href="/terms"
									onClick={trackHandler(analyticsKeys.ui.menu.click.terms)}
									prefetch={false}
								>
									Terms of Use
								</Link>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell variant="icon">
								<Lock01 className="mx-auto size-4" />
							</TableCell>
							<TableCell variant="key">
								<Link
									href="/privacy"
									onClick={trackHandler(analyticsKeys.ui.menu.click.privacy)}
									prefetch={false}
								>
									Privacy Policy
								</Link>
							</TableCell>
						</TableRow>
						{membership && (
							<TableRow>
								<TableCell variant="icon">
									<Icons.organization className="mx-auto size-4" />
								</TableCell>
								<TableCell variant="key">
									<Link
										href={`/org/${membership.organization.id}`}
										onClick={trackHandler(analyticsKeys.ui.menu.click.org)}
										prefetch={false}
										className="flex items-center gap-1"
									>
										<div>Organization:</div>
										<div>{membership.organization.name}</div>
									</Link>
								</TableCell>
							</TableRow>
						)}
						{user ? (
							<TableRow>
								<TableCell variant="icon">
									{user && <LogOut01 className="mx-auto size-4" />}
								</TableCell>
								<TableCell
									variant="key"
									onClick={() => {
										trackHandler(analyticsKeys.ui.menu.click.signout)();
										signOut();
									}}
									className="cursor-pointer"
								>
									Sign out
								</TableCell>
							</TableRow>
						) : (
							<SignInDrawer
								trigger={
									<TableRow>
										<TableCell variant="icon">
											<LogIn01 className="mx-auto size-4" />
										</TableCell>
										<TableCell
											variant="key"
											className="cursor-pointer"
											onClick={trackHandler(analyticsKeys.ui.menu.click.signin)}
										>
											Sign in
										</TableCell>
									</TableRow>
								}
							/>
						)}
					</TableBody>
				</Table>
			</CollapsibleContent>
		</Collapsible>
	);
}

function Feedback() {
	return (
		<a
			href={feedback}
			target="_blank"
			rel="noreferrer"
			onClick={trackHandler(analyticsKeys.ui.menu.click.feedback)}
		>
			Give feedback
		</a>
	);
}

function Version() {
	const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local";
	return (
		// Check if anyone is actually clicking this
		<div onClick={trackHandler(analyticsKeys.ui.menu.click.version)}>
			Version: {version.substring(0, 7)} <Beta />
		</div>
	);
}

function Beta() {
	return (
		<span
			className="px-2 py-1.5 text-xs font-bold rounded-md text-secondary-foreground bg-secondary"
			onClick={trackHandler(analyticsKeys.ui.menu.click.version, {
				value: "button",
			})}
		>
			BETA
		</span>
	);
}
