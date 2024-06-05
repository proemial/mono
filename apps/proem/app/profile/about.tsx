"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useClerk, useUser } from "@clerk/nextjs";
import { Table, TableBody, TableCell, TableRow } from "@proemial/shadcn-ui";
import { Drop, LogOut01, MessageSquare02 } from "@untitled-ui/icons-react";
import { ProfileColorSchemeToggle } from "./profile-color-scheme-toggle";
import { ProfileQuestions } from "./profile-questions";

const feedback = "https://tally.so/r/wAv8Ve";
const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local";

export const About = () => {
	const { user, isSignedIn } = useUser();
	const { signOut } = useClerk();

	return (
		<div className="flex flex-col gap-4 justify-between h-full w-full mt-4">
			<Table className="text-base">
				<TableBody>
					<TableRow>
						<TableCell variant="icon">
							<Drop className="mx-auto size-4" />
						</TableCell>
						<TableCell variant="key" className="select-none">
							Color scheme
						</TableCell>
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
						<TableCell variant="value">
							<div
								className="flex gap-2 items-center"
								onClick={trackHandler(analyticsKeys.ui.menu.click.version)}
							>
								<pre className="text-xs">{version.substring(0, 7)}</pre>
								<Beta />
							</div>
						</TableCell>
					</TableRow>
					{isSignedIn && (
						<TableRow>
							<TableCell variant="icon">
								{user && <LogOut01 className="mx-auto size-4" />}
							</TableCell>
							<TableCell variant="key" className="flex">
								<div
									onClick={() => {
										trackHandler(analyticsKeys.ui.menu.click.signout)();
										signOut();
									}}
									className="cursor-pointer"
								>
									Sign out
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{user && isSignedIn && <ProfileQuestions />}
		</div>
	);
};

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

function Beta() {
	return (
		<span
			className="px-1.5 py-1 text-xs font-bold rounded-md text-secondary-foreground bg-secondary"
			onClick={trackHandler(analyticsKeys.ui.menu.click.version, {
				value: "button",
			})}
		>
			BETA
		</span>
	);
}
