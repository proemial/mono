"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import {
	Header2,
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
	const { user } = useUser();
	const { signOut } = useClerk();
	const { membership } = useOrganization();

	return (
		<div className="space-y-4">
			<div>
				<div className="select-none">
					<Header2>Your profile</Header2>
				</div>
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
										className="flex items-center gap-1 mr-1"
									>
										{membership.organization.name}
									</Link>
								</TableCell>
							</TableRow>
						)}
						{!user && (
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
						{user && (
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
			<About />
		</div>
	);
}
