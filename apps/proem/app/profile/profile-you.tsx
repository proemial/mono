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
	Icons,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import { LogIn01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { SignInDrawer } from "../../components/sign-in-drawer";
import { About } from "./about";

export function ProfileYou() {
	const { user, isSignedIn } = useUser();
	const { membership } = useOrganization();

	return (
		<div className="h-full px-4 flex flex-col gap-4 justify-between">
			<div className="space-y-8">
				<div className="select-none">
					<Header2>Your profile</Header2>
				</div>
				{isSignedIn && user && (
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
						>
							<About />
						</CollapsibleSection>
					</div>
				)}
				<div>
					<Header5>
						<div className="opacity-50 select-none">Social</div>
					</Header5>
					<Table className="text-base">
						<TableBody>
							{membership && (
								<TableRow>
									<TableCell variant="icon">
										<Icons.organization className="mx-auto size-4" />
									</TableCell>
									<TableCell variant="key" className="select-none">
										Organization
									</TableCell>
									<TableCell variant="value">
										<Link
											href={`/org/${membership.organization.id}`}
											onClick={trackHandler(analyticsKeys.ui.menu.click.org)}
											prefetch={false}
											className="flex items-center gap-1"
										>
											{membership.organization.name}
										</Link>
									</TableCell>
								</TableRow>
							)}
							{!isSignedIn && (
								<SignInDrawer
									trigger={
										<TableRow>
											<TableCell variant="icon">
												<LogIn01 className="mx-auto size-4" />
											</TableCell>
											<TableCell variant="key" className="flex">
												<div
													className="cursor-pointer"
													onClick={trackHandler(
														analyticsKeys.ui.menu.click.signin,
													)}
												>
													Sign in
												</div>
											</TableCell>
										</TableRow>
									}
								/>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			<div className="flex gap-8 justify-center py-1 opacity-60">
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
