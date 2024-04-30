"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/components/analytics/tracking/tracker";
import { ClickFeedback } from "@/app/components/card/paper-card";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
	id: string;
	children: ReactNode;
};

export function ClickablePaperCard({ id, children }: Props) {
	const handleClick = () => {
		Tracker.track(analyticsKeys.feed.click.card, { id });
	};

	return (
		<Link href={`/oa/${id}`} onClick={handleClick}>
			<ClickFeedback>{children}</ClickFeedback>
		</Link>
	);
}
