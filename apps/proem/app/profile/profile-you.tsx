"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { CollapsibleSection } from "@/components/collapsible-section";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Header2,
	Header5,
} from "@proemial/shadcn-ui";
import { LogIn01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { SignInDrawer } from "../../components/sign-in-drawer";
import { About } from "./about";
import { ProfileCollections } from "./profile-collections";

export function ProfileYou() {
	const { user, isSignedIn } = useUser();
	const { membership } = useOrganization();

	return (
		<div className="h-full px-4 flex flex-col gap-4 justify-between">
			<div className="space-y-8">
				{!isSignedIn && (
					<div className="space-y-4">
						<SignInDrawer
							trigger={
								<div className="flex gap-2 items-center">
									<LogIn01 className="size-4 opacity-85" />
									<div
										className="text-sm cursor-pointer"
										onClick={trackHandler(analyticsKeys.ui.menu.click.signin)}
									>
										Sign in
									</div>
								</div>
							}
						/>
					</div>
				)}
				{isSignedIn && user && (
					<>
						<div className="select-none">
							<Header2>Your profile</Header2>
						</div>
						<div className="space-y-2">
							<Header5>
								<div className="opacity-50 select-none">Profile</div>
							</Header5>
							<CollapsibleSection
								className="space-x-0"
								collapsed={true}
								trigger={
									<div className="flex w-full gap-4 justify-between items-center">
										<Avatar className="size-9">
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>
												{getUserInitials(user.fullName ?? "")}
											</AvatarFallback>
										</Avatar>
										<div>{user.fullName}</div>
									</div>
								}
								trackingKey={analyticsKeys.ui.menu.click.collapse.profile}
							>
								<About />
							</CollapsibleSection>
						</div>
					</>
				)}
				{isSignedIn && (
					<div>
						<Header5>
							<div className="opacity-50 select-none mb-2">Social</div>
						</Header5>
						<div className="flex flex-col gap-6">
							<ProfileCollections orgName={membership?.organization.name} />
						</div>
					</div>
				)}
			</div>
			<div className="flex gap-6 justify-center py-1 opacity-60 text-sm">
				<Link
					href="/terms"
					onClick={trackHandler(analyticsKeys.ui.menu.click.terms)}
					prefetch={false}
				>
					Terms of use
				</Link>
				<Link
					href="/privacy"
					onClick={trackHandler(analyticsKeys.ui.menu.click.privacy)}
					prefetch={false}
				>
					Privacy policy
				</Link>
			</div>
		</div>
	);
}

const getUserInitials = (fullname: string) => {
	const names = fullname.split(" ");
	if (names.length === 1) {
		return names[0]?.charAt(0).toUpperCase();
	}
	// @ts-ignore: Length of `names` is guaranteed to be at least 2
	const initials = names[0]?.charAt(0) + names[names.length - 1].charAt(0);
	return initials.toUpperCase();
};
