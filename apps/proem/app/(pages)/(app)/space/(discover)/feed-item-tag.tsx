"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Button } from "@proemial/shadcn-ui";

export const FeedItemTag = ({ tag }: { tag: string }) => {
	return (
		<Button
			key={tag}
			size="pill"
			className="bg-foreground/5"
			onClick={trackHandler(analyticsKeys.feed.click.tag)}
		>
			{tag}
		</Button>
	);
};
