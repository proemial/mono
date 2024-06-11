"use client";
import { togglePaperInCollection } from "@/app/(pages)/(app)/discover/bookmark-paper";
import { Checkbox } from "@/components/checkbox";
import {
	Notification,
	openUnstyledNotifcation,
} from "@/components/notification";
import { Button, toast } from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";

const TOAST_OPEN_DURATION = 4000;

type CollectionSelectorProps = {
	paperId: string;
	bookmarks?: number[];
};

function CollectionSelector({ paperId, bookmarks }: CollectionSelectorProps) {
	// TODO! Fetch users collections
	const collections = [11, 12, 13];
	return (
		<Notification>
			<div className="divide-y pb-3">
				<p className="font-semibold text-center py-4">Added to Collection</p>
				{collections.map((collectionId) => (
					<div key={collectionId} className="px-4 py-2 text-base">
						<Checkbox
							key={collectionId}
							defaultChecked={bookmarks?.some(
								(collectionIdFromExistingBookmarks) =>
									collectionIdFromExistingBookmarks === collectionId,
							)}
							onCheckedChange={async (newCheckedValue) => {
								await togglePaperInCollection({
									paperId,
									collectionId: collectionId,
									isEnabled: Boolean(newCheckedValue),
								});
							}}
						>
							{collectionId}
						</Checkbox>
					</div>
				))}
				{/* TODO! add */}
				{/* <div>
		<Button>Create new collection</Button>
	</div> */}
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
	const [isOpen, setIsOpen] = useState(false);
	const [isTouched, setIsTouched] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!isTouched && isOpen) {
				onClose?.();
			}
		}, TOAST_OPEN_DURATION);

		return () => clearTimeout(timeoutId);
	}, [isOpen, isTouched, onClose]);

	return (
		<Notification>
			{isOpen ? (
				<CollectionSelector paperId={paperId} bookmarks={bookmarks} />
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
							setIsOpen(true);
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
	openUnstyledNotifcation(() => <CollectionSelector {...props} />);
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
