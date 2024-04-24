"use client";
import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/app/components/analytics/tracking/tracker";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignOutButton } from "@clerk/nextjs";

export function ProfileButtons() {
	// TODO: callback from clerk is quirky.
	//  Tracking before redirect breaks redirecting.
	//  Tracking after kinda works, but sometimes throws a console error
	const handleCallback = () => {
		window.location.replace("/");
		Tracker.track(analyticsKeys.profile.click.logout);
	};

	return (
		<SignOutButton signOutCallback={handleCallback}>
			<Button variant="danger">
				<span className="text-xs font-semibold">Log out</span>
			</Button>
		</SignOutButton>
	);
}
