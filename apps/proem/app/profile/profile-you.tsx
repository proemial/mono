"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
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
import { Drop, LogIn01, LogOut01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { SignInDrawer } from "../../components/sign-in-drawer";
import { About } from "./about";
import { ProfileColorSchemeToggle } from "./profile-color-scheme-toggle";

export function ProfileYou() {
	const { user, isSignedIn } = useUser();
	const { signOut } = useClerk();
	const { membership } = useOrganization();

	return (
		<div className="space-y-8">
			<div className="space-y-6">
				<div className="select-none">
					<Header2>Your profile</Header2>
				</div>
				<div className="space-y-8">
					{isSignedIn && user && (
						<div className="space-y-2">
							<Header5>
								<div className="opacity-50 select-none">Profile</div>
							</Header5>
							<div className="flex gap-4 justify-between items-center">
								<Avatar className="size-9">
									<AvatarImage src={user.imageUrl} />
									<AvatarFallback>
										{getUserInitials(user.fullName ?? "")}
									</AvatarFallback>
								</Avatar>
								<div className="select-none">{user.fullName}</div>
							</div>
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
								<TableRow>
									<TableCell variant="icon">
										<Drop className="mx-auto size-4" />
									</TableCell>
									<TableCell variant="key" className="select-none">
										Color scheme
									</TableCell>
									<TableCell variant="value">
										<ProfileColorSchemeToggle />
									</TableCell>
								</TableRow>
								{isSignedIn && (
									<TableRow>
										<TableCell variant="icon">
											{user && <LogOut01 className="mx-auto size-4" />}
										</TableCell>
										<TableCell variant="key" className="flex">
											<div
												onClick={() => {
													trackHandler(analyticsKeys.ui.menu.click.signout)();
													signOut();
												}}
												className="cursor-pointer"
											>
												Sign out
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
			<About />
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
