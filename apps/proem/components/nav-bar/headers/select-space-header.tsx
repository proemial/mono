"use client";

import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
import { Profile } from "@/app/profile/profile";
import { CreateCollectionDrawer } from "@/app/profile/profile-collections";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { routes } from "@/routes";
import { useAuth } from "@clerk/nextjs";
import { Collection } from "@proemial/data/neon/schema";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ForwardedRef,
	ReactNode,
	forwardRef,
	useEffect,
	useState,
} from "react";
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
					{userId ? (
						<SelectItem
							value={userId}
							className="py-2 text-base cursor-pointer"
						>
							{PERSONAL_DEFAULT_COLLECTION_NAME}
						</SelectItem>
					) : (
						<Link
							href={routes.space}
							className="hover:bg-neutral-200 relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-8 text-base outline-none focus:bg-muted focus:text-foreground"
						>
							{PERSONAL_DEFAULT_COLLECTION_NAME}
						</Link>
					)}
					<SelectGroup className="p-0">
						<SelectSeparator />
						<SelectLabel className="cursor-default select-none">
							Recently visited
						</SelectLabel>
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
						<RequireAuthenticationItem
							trigger={<NonSelectItem label="More…" />}
							restricted={
								<Profile
									trigger={<NonSelectItem label="More…" />}
									className="flex w-full"
								/>
							}
						/>
						<SelectSeparator />
						<RequireAuthenticationItem
							trigger={<NonSelectItem label="Create new space" />}
							restricted={
								userId && (
									<CreateCollectionDrawer
										trigger={<NonSelectItem label="Create new space" />}
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

const RequireAuthenticationItem = ({
	trigger,
	restricted,
}: { trigger: ReactNode; restricted: ReactNode }) => {
	const { isSignedIn } = useAuth();
	if (isSignedIn) {
		return restricted;
	}
	return <SignInDrawer trigger={trigger} />;
};

const NonSelectItem = forwardRef(
	(props: { label: string }, ref: ForwardedRef<HTMLDivElement>) => {
		return (
			<div
				ref={ref}
				{...props}
				className="hover:bg-neutral-200 relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-8 text-base outline-none focus:bg-muted focus:text-foreground"
			>
				{props.label}
			</div>
		);
	},
);
