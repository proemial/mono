"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { useUser } from "@clerk/nextjs";
import { Button as ButtonComponent } from "@proemial/shadcn-ui";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useState } from "react";

export function FollowButton({ id, name }: { id: string; name: string }) {
	const { user } = useUser();
	const [following, setFollowing] = useState(!!getCookie(`following-${id}`));

	// onClick={trackHandler(analyticsKeys.feed.click.tag)}

	const handleToggle = () => {
		if (getCookie(`following-${id}`)) {
			deleteCookie(`following-${id}`);
		} else {
			setCookie(`following-${id}`, "true");
			trackHandler(analyticsKeys.institutions.follow.click, {
				institution: name,
			})();
		}
		setFollowing(!following);
	};

	if (!user) {
		return (
			<SignInDrawer
				trigger={
					// extra div to make the trigger a ref
					<div>
						<Button following={following} onClick={handleToggle} />
					</div>
				}
			/>
		);
	}

	return <Button following={following} onClick={handleToggle} />;
}

function Button({
	following,
	onClick,
}: { following: boolean; onClick: () => void }) {
	return (
		<ButtonComponent
			className="h-8 bg-theme-200/30 rounded-full text-wrap whitespace-nowrap inline"
			onClick={onClick}
		>
			{following ? "Unfollow" : "Follow"}
		</ButtonComponent>
	);
}
