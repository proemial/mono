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
	fromTrackingKey: CollectionFromOptions;
};

function CollectionSelector({
	paperId,
	bookmarks,
	onClose,
	fromTrackingKey,
}: CollectionSelectorProps) {
	const { user } = useUser();
	const { data: collections } = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getAvailableCollections(),
	});

	return (
		<Notification closeOnBlur>
			<div className="divide-y pb-3">
				<p className="font-semibold text-center py-4">Added to Collection</p>
				{collections?.map((collection) => (
					<div key={collection.id} className="px-4 py-2 text-base">
						<Checkbox
							id={collection.id}
							defaultChecked={bookmarks?.some(
								(collectionIdFromExistingBookmarks) =>
									collectionIdFromExistingBookmarks === collection.id,
							)}
							onCheckedChange={async (newCheckedValue) => {
								const isEnabled = Boolean(newCheckedValue);
								trackHandler(
									isEnabled
										? analyticsKeys.collection.addPaper[fromTrackingKey]
										: analyticsKeys.collection.removePaper[fromTrackingKey],
								)();

								await togglePaperInCollection({
									paperId,
									collectionId: collection.id,
									isEnabled,
								});
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
				<Link
					href={`${routes.space}/new?paperId=${paperId}`}
					onClick={() => onClose?.()}
				>
					<div className="flex gap-4 px-4 py-2 text-base items-center">
						<Plus className="size-4" />
						<span>Create new collection</span>
					</div>
				</Link>
			</div>
		</Notification>
	);
}

type CollectionNotificationProps = CollectionSelectorProps & {
	newBookmarksCollectionId: string;
};

export function CollectionManager({
	onClose,
	paperId,
	bookmarks,
	newBookmarksCollectionId,
	fromTrackingKey,
}: CollectionNotificationProps) {
	const [showSelector, setShowSelector] = useState(false);
	const { user } = useUser();
	const { data: collections } = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getAvailableCollections(),
	});
	const currentCollection = collections?.find(
		({ id }) => id === newBookmarksCollectionId,
	);

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
						<span className="text-sm">
							Added to <strong>{currentCollection?.name}</strong>
						</span>
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
