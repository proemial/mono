"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { CollapsibleSection } from "@/components/collapsible-section";
import {
	Header4,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import {
	ClipboardCheck,
	File02,
	Lock01,
	MessageSquare02,
} from "@untitled-ui/icons-react";
import Link from "next/link";

const feedback = "https://tally.so/r/wAv8Ve";

export const About = () => {
	return (
		<CollapsibleSection trigger={<Header4>About</Header4>}>
			<Table className="text-base">
				<TableBody>
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
							<File02 className="mx-auto size-4" />
						</TableCell>
						<TableCell variant="key">
							<Link
								href="/terms"
								onClick={trackHandler(analyticsKeys.ui.menu.click.terms)}
								prefetch={false}
							>
								Terms of use
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
								Privacy policy
							</Link>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="icon">
							<ClipboardCheck className="mx-auto size-4" />
						</TableCell>
						<TableCell
							variant="key"
							className="w-full flex items-center gap-4 select-none"
						>
							<Version />
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</CollapsibleSection>
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

function Version() {
	const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local";
	return (
		// Check if anyone is actually clicking this
		<div
			className="flex gap-2 w-full justify-between items-center"
			onClick={trackHandler(analyticsKeys.ui.menu.click.version)}
		>
			<div>Version</div>
			<div className="flex gap-2 items-center">
				<pre className="text-xs">{version.substring(0, 7)}</pre>
				<Beta />
			</div>
		</div>
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
