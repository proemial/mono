"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { CollapsibleSection } from "@/components/collapsible-section";
import { CollectionListItem } from "@/components/collections/collection-list-item";
import { CollectionListItemHeader } from "@/components/collections/collection-list-item-header";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Header2,
	Header5,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import { Building05, LogIn01 } from "@untitled-ui/icons-react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SignInDrawer } from "../../components/sign-in-drawer";
import { useInternalUser } from "../hooks/use-user";
import { About } from "./about";

// TODO: Replace with type from DB
type Collection = {
	id: number;
	name: string;
	description: string;
};

export function ProfileYou() {
	const { user, isSignedIn } = useUser();
	const { membership } = useOrganization();
	const { isInternal } = useInternalUser();
	const collections: Collection[] = []; // TODO: Fetch user collections

	return (
		<div className="h-full px-4 flex flex-col gap-4 justify-between">
			<div className="space-y-8">
				<div className="select-none">
					<Header2>Your profile</Header2>
				</div>
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
										onClick={trackHandler(analyticsKeys.ui.menu.click.signin)}
									>
										Sign in
									</div>
								</TableCell>
							</TableRow>
						}
					/>
				)}
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
				{isSignedIn && (
					<div>
						<Header5>
							<div className="opacity-50 select-none mb-2">Social</div>
						</Header5>
						<div className="flex flex-col gap-6">
							{membership && (
								<CollapsibleSection
									collapsed
									extra={<div>1</div>}
									trigger={<div>Organisations</div>}
								>
									<div className="space-y-4 mt-4">
										<Link
											href={`/org/${membership.organization.id}`}
											onClick={trackHandler(analyticsKeys.ui.menu.click.org)}
											prefetch={false}
											className="text-sm"
										>
											<div className="flex gap-2 items-center">
												<Building05 className="size-4 opacity-85" />
												<div>{membership.organization.name}</div>
											</div>
										</Link>
									</div>
								</CollapsibleSection>
							)}
							{isInternal && (
								<CollapsibleSection
									collapsed
									extra={<div>{collections.length}</div>}
									trigger={<div>Collections</div>}
								>
									<div className="space-y-4 mt-4">
										{collections.length === 0 && (
											<div className="text-sm">
												There are no collections to display.
											</div>
										)}
										{collections.map((collection) => (
											<CollectionListItem
												key={collection.id}
												name={collection.name}
											/>
										))}
										<CollectionListItemHeader
											onClick={() => alert("Not implemented.")}
										>
											<Plus className="size-4 opacity-85" />
											<div className="text-sm">Create New Collection…</div>
										</CollectionListItemHeader>
									</div>
								</CollapsibleSection>
							)}
						</div>
					</div>
				)}
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
