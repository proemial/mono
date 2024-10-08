"use client";

import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
import { Profile } from "@/app/profile/profile";
import { CreateCollectionDrawer } from "@/app/profile/profile-collections";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { PromptForSignIn } from "@/components/prompt-for-sign-in";
import { routes } from "@/routes";
import { useAuth } from "@clerk/nextjs";
import { Collection } from "@proemial/data/neon/schema";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { RecentSpaces } from "./recent-spaces";

type SelectSpaceHeaderProps = {
	spaces: Collection[];
	selectedSpaceId?: string;
	onRouteChange?: ({ url, name }: { url: string; name?: string }) => void;
};

export const SelectSpaceHeader = ({
	spaces,
	selectedSpaceId,
	onRouteChange,
}: SelectSpaceHeaderProps) => {
	const { userId, orgId } = useAuth();
	const router = useRouter();
	const [recentSpaces, setRecentSpaces] = useState<string[]>([]);

	useEffect(() => {
		if (selectedSpaceId) {
			const currentRecentSpaces = RecentSpaces.get();
			if (selectedSpaceId === userId || typeof userId === "undefined") {
				if (currentRecentSpaces.join() !== recentSpaces.join()) {
					setRecentSpaces(currentRecentSpaces);
				}
				return;
			}
			const modified = RecentSpaces.add(selectedSpaceId);
			if (
				currentRecentSpaces.join() !== modified.join() ||
				recentSpaces.length === 0
			) {
				setRecentSpaces(modified);
			}
		}
	}, [selectedSpaceId, recentSpaces, userId]);

	const handleValueChange = (id: string) => {
		trackHandler(analyticsKeys.ui.header.click.changeSpace)();
		const selectedCollection = spaces.find((c) => c.id === id);
		const route = `/space/${id}`;
		onRouteChange?.({ url: route, name: selectedCollection?.name });
		router.push(route);
	};

	return (
		<div className="flex items-center gap-1">
			<Select onValueChange={handleValueChange} value={selectedSpaceId}>
				<SelectTrigger
					data-placeholder="data placeholder"
					className="flex gap-2 text-lg border-none bg-transparent focus:ring-0 focus:ring-offset-0"
				>
					<SelectValue
						placeholder={spaces.find((s) => s.id === selectedSpaceId)?.name}
					/>
				</SelectTrigger>
				<SelectContent
					align="center"
					className="border-none shadow-2xl min-w-64 max-w-80 rounded-xl"
				>
					<SelectGroup className="p-0">
						<Link
							href={routes.space}
							className="hover:bg-neutral-200 relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-8 text-base outline-none focus:bg-muted focus:text-foreground"
						>
							{PERSONAL_DEFAULT_COLLECTION_NAME}
						</Link>
						{recentSpaces
							.map((spaceId) => spaces.find((s) => s.id === spaceId))
							.filter((space) => typeof space !== "undefined")
							.toReversed()
							.map((space) => (
								<SelectItem
									key={space.id}
									value={space.id}
									className="py-2 text-base cursor-pointer"
								>
									{space.id.includes("user_")
										? PERSONAL_DEFAULT_COLLECTION_NAME
										: space.name}
								</SelectItem>
							))}

						<PromptForSignIn
							trigger={
								<NonSelectItem
									label="View all your spaces"
									onClick={trackHandler(
										analyticsKeys.ui.header.click.viewAllSpaces,
									)}
								/>
							}
							restricted={
								<Profile
									trigger={
										<NonSelectItem
											label="View all your spaces"
											onClick={trackHandler(
												analyticsKeys.ui.header.click.viewAllSpaces,
											)}
										/>
									}
									className="flex w-full"
								/>
							}
						/>
						<SelectSeparator />
						<PromptForSignIn
							trigger={
								<NonSelectItem
									label="Create a space"
									onClick={trackHandler(
										analyticsKeys.ui.header.click.createSpace,
									)}
								/>
							}
							restricted={
								userId && (
									<CreateCollectionDrawer
										trigger={
											<NonSelectItem
												label="Create a space"
												onClick={trackHandler(
													analyticsKeys.ui.header.click.createSpace,
												)}
											/>
										}
										userId={userId}
										orgId={orgId}
									/>
								)
							}
						/>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

const NonSelectItem = forwardRef(
	(
		props: { label: string; onClick?: () => void },
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		return (
			<div
				ref={ref}
				{...props}
				className="hover:bg-neutral-200 relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-8 text-base outline-none focus:bg-muted focus:text-foreground text-gray-600"
			>
				{props.label}
			</div>
		);
	},
);
