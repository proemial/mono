"use client";
import { Button } from "@proemial/shadcn-ui";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useState } from "react";

export function FollowButton({ id }: { id: string }) {
	const [following, setFollowing] = useState(!!getCookie(`following-${id}`));
	// const following = getCookie(`following-${id}`);

	const handleToggle = () => {
		if (getCookie(`following-${id}`)) {
			deleteCookie(`following-${id}`);
		} else {
			setCookie(`following-${id}`, "true");
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
