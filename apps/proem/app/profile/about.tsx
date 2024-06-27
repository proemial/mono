"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useClerk, useUser } from "@clerk/nextjs";
import { Drop, LogOut01, MessageSquare02 } from "@untitled-ui/icons-react";
import { useInternalUser } from "../hooks/use-user";
import { ProfileColorSchemeToggle } from "./profile-color-scheme-toggle";
import { ProfileQuestions } from "./profile-questions";

const feedback = "https://tally.so/r/wAv8Ve";
const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local";

export const About = () => {
	const { user, isSignedIn } = useUser();
	const { isInternal } = useInternalUser();
	const { signOut } = useClerk();

	const handleSignOut = () => {
		trackHandler(analyticsKeys.ui.menu.click.signout)();
		signOut();
	};

	return (
		<div className="flex flex-col gap-4 justify-between h-full w-full mt-4">
			<div className="space-y-4 mt-4">
				<div className="flex gap-2 items-center justify-between">
					<div className="flex gap-2 items-center">
						<Drop className="size-4 opacity-85" />
						<div className="text-sm select-none">Color scheme</div>
					</div>
					<ProfileColorSchemeToggle />
				</div>
				<div className="flex gap-2 items-center justify-between">
					<div className="flex gap-2 items-center">
						<MessageSquare02 className="size-4 opacity-85" />
						<a
							href={feedback}
							target="_blank"
							rel="noreferrer"
							onClick={trackHandler(analyticsKeys.ui.menu.click.feedback)}
							className="text-sm"
						>
							Give feedback
						</a>
					</div>
					<div
						className="flex gap-2 items-center select-none"
						onClick={trackHandler(analyticsKeys.ui.menu.click.version)}
					>
						<pre className="text-xs">{version.substring(0, 7)}</pre>
						<Beta />
					</div>
				</div>
				{isSignedIn && (
					<div className="flex justify-between gap-2 items-center">
						<div
							onClick={handleSignOut}
							className="flex items-center gap-2 text-sm cursor-pointer"
						>
							<LogOut01 className="size-4 opacity-85" />
							Sign out
						</div>
						<div className="text-xs text-gray-400">
							{isInternal && `${user.id}`}
						</div>
					</div>
				)}
				{user && isSignedIn && <ProfileQuestions />}
			</div>
		</div>
	);
};

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
