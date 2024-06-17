"use client";
import { togglePaperInCollection } from "@/app/(pages)/(app)/discover/bookmark-paper";
import { useUser } from "@/app/hooks/use-user";
import { getCollections } from "@/app/profile/actions";
import { Checkbox } from "@/components/checkbox";
import {
	Notification,
	openUnstyledNotifcation,
} from "@/components/notification";
import { Button, toast } from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const TOAST_OPEN_DURATION = 4000;

type CollectionSelectorProps = {
	paperId: string;
	bookmarks?: string[];
	onClose?: () => void;
};

function CollectionSelector({
	paperId,
	bookmarks,
	onClose,
}: CollectionSelectorProps) {
	const { user } = useUser();
	const { data: collections } = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getCollections(user?.id ?? ""),
	});

	return (
		<Notification closeOnBlur>
			<div className="divide-y pb-3">
				<p className="font-semibold text-center py-4">Added to Collection</p>
				{collections?.map(({ id, name }) => (
					<div key={id} className="px-4 py-2 text-base">
						<Checkbox
							id={id}
							defaultChecked={bookmarks?.some(
								(collectionIdFromExistingBookmarks) =>
									collectionIdFromExistingBookmarks === id,
							)}
							onCheckedChange={async (newCheckedValue) => {
								await togglePaperInCollection({
									paperId,
									collectionId: id,
									isEnabled: Boolean(newCheckedValue),
								});
							}}
						>
							{name}
						</Checkbox>
					</div>
				))}
				{/* <CreateCollectionDrawer
					trigger={
						<Button
							onClick={() => {
								// TODO! This doesn't work
								// onClose?.();
							}}
						>
							Create new collection
						</Button>
					}
				/> */}
			</div>
		</Notification>
	);
}

type CollectionNotificationProps = CollectionSelectorProps & {
	onClose?: () => void;
};

export function CollectionManager({
	onClose,
	paperId,
	bookmarks,
}: CollectionNotificationProps) {
	const [showSelector, setShowSelector] = useState(false);
	const [isTouched, setIsTouched] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!isTouched && !showSelector) {
				onClose?.();
			}
		}, TOAST_OPEN_DURATION);

		return () => clearTimeout(timeoutId);
	}, [showSelector, isTouched, onClose]);

	return (
		<Notification closeOnBlur={showSelector}>
			{showSelector ? (
				<CollectionSelector
					paperId={paperId}
					bookmarks={bookmarks}
					onClose={onClose}
				/>
			) : (
				<div className="flex justify-between items-center py-0.5 pl-2.5">
					<div className="flex items-center space-x-2">
						<Checkbox checked className="cursor-default" />
						<span className="text-sm">
							Added to <strong>Your Collection</strong>
						</span>
					</div>

					<Button
						variant="ghost"
						className="p-2.5 text-sm"
						onClick={() => {
							// showCollectionSelector(paperId, bookmarks);
							setIsTouched(true);
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
	openUnstyledNotifcation((toastId) => (
		<CollectionSelector
			{...props}
			onClose={() => {
				toast.dismiss(toastId);
			}}
		/>
	));
}

export function showCollectionNotification(props: CollectionSelectorProps) {
	openUnstyledNotifcation((toastId) => (
		<CollectionManager
			{...props}
			onClose={() => {
				toast.dismiss(toastId);
			}}
		/>
	));
}
