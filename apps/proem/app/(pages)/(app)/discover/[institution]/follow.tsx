"use client";
import { Button } from "@proemial/shadcn-ui";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";

export function FollowButton({ id, name }: { id: string, name: string }) {
	const [following, setFollowing] = useState(!!getCookie(`following-${id}`));

	// onClick={trackHandler(analyticsKeys.feed.click.tag)}

	const handleToggle = () => {
		if (getCookie(`following-${id}`)) {
			deleteCookie(`following-${id}`);
		} else {
			setCookie(`following-${id}`, "true");
			trackHandler(analyticsKeys.institutions.follow.click, {institution: name})();
		}
		setFollowing(!following);
	};

	return (
		<Button
			className="h-8 bg-theme-200/30 rounded-full text-wrap whitespace-nowrap inline"
			onClick={handleToggle}
		>
			{following ? "Unfollow" : "Follow"}
		</Button>
	);
}
