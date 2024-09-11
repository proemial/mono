"use client";
import { togglePaperInCollection } from "@/app/(pages)/(app)/space/(discover)/bookmark-paper";
import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
import { useUser } from "@/app/hooks/use-user";
import { getAvailableCollections } from "@/app/profile/actions";
import {
	CollectionFromOptions,
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Checkbox } from "@/components/checkbox";
import {
	Notification,
	openUnstyledNotifcation,
} from "@/components/notification";
import { Throbber } from "@/components/throbber";
import { routes } from "@/routes";
import { Button, toast } from "@proemial/shadcn-ui";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "@untitled-ui/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TOAST_OPEN_DURATION = 4000;

export type CollectionSelectorProps = {
	paperId: string;
	bookmarks?: string[];
	onClose?: () => void;
	onValueToggle?: ({
		paperId,
		collectionId,
		isEnabled,
	}: {
		paperId: string;
		collectionId: string;
		isEnabled: boolean;
	}) => void;
	fromTrackingKey: CollectionFromOptions;
};

function CollectionSelector({
	paperId,
	bookmarks,
	onClose,
	onValueToggle,
	fromTrackingKey,
}: CollectionSelectorProps) {
	const { user } = useUser();
	const {
		data: collections,
		refetch: refetchCollectionsQuery,
		isLoading,
	} = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getAvailableCollections(),
	});

	return (
		<Notification closeOnBlur>
			<div className="divide-y pb-3">
				<p className="font-semibold text-center py-4">
					{isLoading ? "Adding" : "Added"} to Collection
				</p>
				{isLoading ? <Throbber /> : null}
				{collections?.map((collection) => (
					<div key={collection.id} className="px-4 py-2 text-base">
						<Checkbox
							id={collection.id}
							defaultChecked={
								//@ts-expect-error
								collection.collectionsToPapers.find(
									//@ts-expect-error When we stop type asserting all stop ignoring type
									(collectionToPaper) => collectionToPaper.paperId === paperId,
								)?.isEnabled ||
								bookmarks?.some(
									(collectionIdFromExistingBookmarks) =>
										collectionIdFromExistingBookmarks === collection.id,
								)
							}
							onCheckedChange={async (newCheckedValue) => {
								const isEnabled = Boolean(newCheckedValue);
								trackHandler(
									isEnabled
										? analyticsKeys.collection.addPaper[fromTrackingKey]
										: analyticsKeys.collection.removePaper[fromTrackingKey],
								)();

								const newBookmark = {
									paperId,
									collectionId: collection.id,
									isEnabled,
								};
								onValueToggle?.(newBookmark);
								await togglePaperInCollection(newBookmark);
								refetchCollectionsQuery();
							}}
						>
							<span className="font-normal">
								{collection.id.includes("user_")
									? PERSONAL_DEFAULT_COLLECTION_NAME
									: collection.name}
							</span>
						</Checkbox>
					</div>
				))}
				{/* TODO: Add this back in */}
				{/* <Link
					href={`${routes.space}/new?paperId=${paperId}`}
					onClick={() => onClose?.()}
				>
					<div className="flex gap-4 px-4 py-2 text-base items-center">
						<Plus className="size-4" />
						<span>Create new collection</span>
					</div>
				</Link> */}
			</div>
		</Notification>
	);
}

type CollectionNotificationProps = CollectionSelectorProps & {
	newBookmarksCollectionId: string;
};

function CollectionManager({
	onClose,
	paperId,
	bookmarks,
	newBookmarksCollectionId,
	fromTrackingKey,
}: CollectionNotificationProps) {
	const [showSelector, setShowSelector] = useState(false);
	const { user } = useUser();
	const { data: collections, isLoading } = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getAvailableCollections(),
	});
	const currentCollectionName = newBookmarksCollectionId.includes("user_")
		? PERSONAL_DEFAULT_COLLECTION_NAME
		: collections?.find(({ id }) => id === newBookmarksCollectionId)?.name;

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!showSelector) {
				onClose?.();
			}
		}, TOAST_OPEN_DURATION);

		return () => clearTimeout(timeoutId);
	}, [showSelector, onClose]);

	return (
		<Notification closeOnBlur={showSelector}>
			{showSelector ? (
				<CollectionSelector
					paperId={paperId}
					bookmarks={bookmarks}
					onClose={onClose}
					fromTrackingKey={fromTrackingKey}
				/>
			) : (
				<div className="flex justify-between items-center py-0.5 pl-2.5">
					<div className="flex items-center space-x-2">
						<Checkbox checked className="cursor-default" />
						<div className="text-sm flex flex-row gap-1.5 items-center">
							<div>
								Added to{" "}
								{!isLoading ? <strong>{currentCollectionName}</strong> : ""}
							</div>
							{isLoading ? (
								<div className="h-4 w-20 bg-theme-200/75 rounded-md animate-pulse" />
							) : null}
						</div>
					</div>

					<Button
						variant="ghost"
						className="p-2.5 text-sm"
						onClick={() => {
							trackHandler(
								analyticsKeys.collection.openCollectionSelector[
									fromTrackingKey
								],
							)();
							setShowSelector(true);
						}}
					>
						Manage
					</Button>
				</div>
			)}
		</Notification>
	);
}

export function showCollectionSelector(props: CollectionSelectorProps) {
	trackHandler(
		analyticsKeys.collection.openCollectionSelector[props.fromTrackingKey],
	)();

	openUnstyledNotifcation((toastId) => (
		<CollectionSelector
			{...props}
			onClose={() => {
				toast.dismiss(toastId);
			}}
		/>
	));
}

export function showCollectionNotification(props: CollectionNotificationProps) {
	openUnstyledNotifcation((toastId) => (
		<CollectionManager
			{...props}
			onClose={() => {
				toast.dismiss(toastId);
			}}
		/>
	));
}
